import { db, schema } from "@/db";
import { eq, or, and, gt, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ROLES, hasPermission, normalizePermissionCode } from "@/lib/rbac";
import { protectLastSuperAdmin } from "@/lib/auth-guard";

export interface LoginResult {
  success: boolean;
  error?: string;
  statusCode?: number;
  user?: {
    id: string;
    name: string;
    email: string;
    username: string | null;
    role: string;
    roles: string[];
    permissions: string[];
    branchId: string | null;
    companyId: string | null;
    mustChangePassword: boolean;
    sessionVersion: number;
  };
  sessionToken?: string;
  defaultPath?: string;
}

export class AuthService {
  /**
   * Authenticate user with persistent rate limiting, case-insensitive match, and session tracking
   */
  static async login(
    identifier: string,
    passwordPlain: string,
    ipAddress?: string,
    userAgent?: string,
    rememberMe = false
  ): Promise<LoginResult> {
    const cleanIdentifier = identifier.trim().toLowerCase();

    // Query user by normalized email OR normalized username OR standard fields
    const [user] = await db
      .select()
      .from(schema.users)
      .where(
        or(
          eq(schema.users.normalizedEmail, cleanIdentifier),
          eq(schema.users.email, cleanIdentifier),
          eq(schema.users.normalizedUsername, cleanIdentifier),
          eq(schema.users.username, cleanIdentifier)
        )
      )
      .limit(1);

    if (!user) {
      // Generic error to prevent account enumeration
      return {
        success: false,
        error: "Invalid email/username or password.",
        statusCode: 401,
      };
    }

    // 1. Check account lockout (Rate limiting)
    const now = new Date();
    if (user.lockedUntil && new Date(user.lockedUntil) > now) {
      const remainingMinutes = Math.ceil(
        (new Date(user.lockedUntil).getTime() - now.getTime()) / (60 * 1000)
      );
      await this.recordAuditLog(
        user.id,
        "LOGIN_LOCKED_ATTEMPT",
        "user",
        user.id,
        `Login attempted while account locked. Remaining: ${remainingMinutes}m`,
        ipAddress
      );
      return {
        success: false,
        error: `Account is temporarily locked due to excessive failed attempts. Please try again in ${remainingMinutes} minute(s) or contact your administrator.`,
        statusCode: 429,
      };
    }

    // 2. Check account activation status
    if (user.status !== "Active" || !user.isActive) {
      await this.recordAuditLog(
        user.id,
        "LOGIN_DEACTIVATED_ATTEMPT",
        "user",
        user.id,
        `Login attempted on inactive/suspended account (status: ${user.status})`,
        ipAddress
      );
      return {
        success: false,
        error: `Account is currently ${user.status.toLowerCase()}. Please contact your Super Admin.`,
        statusCode: 403,
      };
    }

    // 3. Verify password
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(passwordPlain, user.passwordHash);
    } catch (e) {
      isPasswordValid = false;
    }

    if (!isPasswordValid) {
      const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
      let lockedUntil: Date | null = null;
      let lockMessage = "";

      // Lock account after 5 consecutive failed attempts for 15 minutes
      if (newFailedAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        lockMessage = " Too many failed attempts. Account locked for 15 minutes.";
      }

      await db
        .update(schema.users)
        .set({
          failedLoginAttempts: newFailedAttempts,
          lockedUntil: lockedUntil,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, user.id));

      await this.recordAuditLog(
        user.id,
        "LOGIN_FAILED",
        "user",
        user.id,
        `Invalid password attempt (${newFailedAttempts}/5)`,
        ipAddress
      );

      return {
        success: false,
        error: `Invalid email/username or password.${lockMessage}`,
        statusCode: newFailedAttempts >= 5 ? 429 : 401,
      };
    }

    // 4. Successful Login - Reset failed attempts & update last login
    await db
      .update(schema.users)
      .set({
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress || null,
        normalizedEmail: user.normalizedEmail || user.email.toLowerCase().trim(),
        normalizedUsername: user.normalizedUsername || (user.username ? user.username.toLowerCase().trim() : null),
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, user.id));

    // 5. Retrieve User Roles and Granular Permissions
    const { roles, permissions } = await this.getUserPermissions(user.id, user.role);

    // 6. Create Database Session record with remember-me duration
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionDurationDays = rememberMe ? 30 : 7;
    const sessionExpires = new Date(Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000);

    try {
      await db.insert(schema.sessions).values({
        userId: user.id,
        sessionToken,
        expiresAt: sessionExpires,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
        isValid: true,
        sessionVersion: user.sessionVersion || 1,
      });
    } catch (err) {
      console.warn("Session insert notice:", err);
    }

    // 7. Audit Log for successful login
    await this.recordAuditLog(
      user.id,
      "LOGIN_SUCCESS",
      "user",
      user.id,
      `User logged in successfully as ${user.role}`,
      ipAddress
    );

    const primaryRole = roles[0] || user.role;
    const defaultPath = ROLES[primaryRole]?.defaultPath || "/dashboard";

    return {
      success: true,
      sessionToken,
      defaultPath,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        roles,
        permissions,
        branchId: user.branchId,
        companyId: user.companyId,
        mustChangePassword: Boolean(user.mustChangePassword),
        sessionVersion: user.sessionVersion || 1,
      },
    };
  }

  /**
   * Retrieve all roles and permissions for a user
   */
  static async getUserPermissions(userId: string, defaultRoleSlug?: string) {
    const assignedRoles: string[] = [];
    const permissionSet = new Set<string>();

    try {
      const userRolesList = await db
        .select({
          roleSlug: schema.roles.slug,
          roleId: schema.roles.id,
        })
        .from(schema.userRoles)
        .innerJoin(schema.roles, eq(schema.userRoles.roleId, schema.roles.id))
        .where(eq(schema.userRoles.userId, userId));

      for (const ur of userRolesList) {
        if (!assignedRoles.includes(ur.roleSlug)) {
          assignedRoles.push(ur.roleSlug);
        }

        // Fetch permissions for each role
        const rolePerms = await db
          .select({
            code: schema.permissions.code,
            permissionKey: schema.permissions.permissionKey,
          })
          .from(schema.rolePermissions)
          .innerJoin(
            schema.permissions,
            eq(schema.rolePermissions.permissionId, schema.permissions.id)
          )
          .where(eq(schema.rolePermissions.roleId, ur.roleId));

        for (const rp of rolePerms) {
          if (rp.permissionKey) permissionSet.add(normalizePermissionCode(rp.permissionKey));
          if (rp.code) permissionSet.add(normalizePermissionCode(rp.code));
        }
      }
    } catch (e) {
      console.warn("Error fetching DB user roles/permissions:", e);
    }

    // Fallback or augment with primary role from ROLES config
    if (assignedRoles.length === 0 && defaultRoleSlug) {
      assignedRoles.push(defaultRoleSlug);
    }

    // Merge static permissions for assigned roles
    for (const slug of assignedRoles) {
      const configured = ROLES[slug];
      if (configured) {
        configured.permissions.forEach((p) => permissionSet.add(normalizePermissionCode(p)));
      }
    }

    // Super Admin gets wildcard
    if (assignedRoles.includes("super_admin") || defaultRoleSlug === "super_admin") {
      permissionSet.add("*");
    }

    return {
      roles: assignedRoles.length > 0 ? assignedRoles : [defaultRoleSlug || "super_admin"],
      permissions: Array.from(permissionSet),
    };
  }

  /**
   * Generate an expiring, cryptographically secure password reset token (1 hour)
   */
  static async createPasswordResetToken(email: string, ipAddress?: string) {
    const cleanEmail = email.trim().toLowerCase();
    const [user] = await db
      .select()
      .from(schema.users)
      .where(
        or(
          eq(schema.users.normalizedEmail, cleanEmail),
          eq(schema.users.email, cleanEmail)
        )
      )
      .limit(1);

    if (!user) {
      // Generic message to prevent email enumeration
      return {
        success: true,
        message: "If an account with that email exists, password reset instructions have been dispatched.",
      };
    }

    // Generate cryptographically secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.insert(schema.passwordResetTokens).values({
      userId: user.id,
      email: user.email,
      token,
      tokenHash,
      expiresAt,
    });

    await this.recordAuditLog(
      user.id,
      "PASSWORD_RESET_REQUESTED",
      "user",
      user.id,
      "Password reset token generated",
      ipAddress
    );

    return {
      success: true,
      token,
      expiresAt,
      message: "If an account with that email exists, password reset instructions have been dispatched.",
    };
  }

  /**
   * Reset password using single-use token, enforcing session revocation
   */
  static async resetPassword(token: string, newPasswordPlain: string, ipAddress?: string) {
    if (!token || !newPasswordPlain) {
      return { success: false, error: "Token and new password are required." };
    }

    if (newPasswordPlain.length < 8) {
      return { success: false, error: "New password must be at least 8 characters long." };
    }

    // Check token by raw token OR tokenHash
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const [tokenRecord] = await db
      .select()
      .from(schema.passwordResetTokens)
      .where(
        and(
          or(
            eq(schema.passwordResetTokens.token, token),
            eq(schema.passwordResetTokens.tokenHash, tokenHash)
          ),
          gt(schema.passwordResetTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!tokenRecord || tokenRecord.usedAt) {
      return { success: false, error: "Reset token is invalid or has already been used." };
    }

    const newHash = await bcrypt.hash(newPasswordPlain, 12);

    // 1. Update user password, clear locks, and increment sessionVersion (revoking all active sessions)
    await db
      .update(schema.users)
      .set({
        passwordHash: newHash,
        mustChangePassword: false,
        failedLoginAttempts: 0,
        lockedUntil: null,
        passwordChangedAt: new Date(),
        sessionVersion: sql`"session_version" + 1`,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, tokenRecord.userId));

    // 2. Mark token as used (single-use enforcement)
    await db
      .update(schema.passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(schema.passwordResetTokens.id, tokenRecord.id));

    // 3. Mark database sessions invalid
    await db
      .update(schema.sessions)
      .set({ isValid: false })
      .where(eq(schema.sessions.userId, tokenRecord.userId));

    await this.recordAuditLog(
      tokenRecord.userId,
      "PASSWORD_RESET_COMPLETED",
      "user",
      tokenRecord.userId,
      "Password reset completed successfully. All active sessions invalidated.",
      ipAddress
    );

    return { success: true, message: "Password updated successfully! Please sign in with your new password." };
  }

  /**
   * Change password for logged in user (or first-login change)
   */
  static async changePassword(
    userId: string,
    currentPasswordPlain: string,
    newPasswordPlain: string,
    ipAddress?: string
  ) {
    if (!newPasswordPlain || newPasswordPlain.length < 8) {
      return { success: false, error: "New password must be at least 8 characters long." };
    }

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    if (!user) {
      return { success: false, error: "User not found." };
    }

    // If not first-login change, verify current password
    if (!user.mustChangePassword) {
      const match = await bcrypt.compare(currentPasswordPlain, user.passwordHash);
      if (!match) {
        return { success: false, error: "Current password does not match." };
      }
    }

    const newHash = await bcrypt.hash(newPasswordPlain, 12);

    // Update password, clear mustChangePassword, bump sessionVersion
    await db
      .update(schema.users)
      .set({
        passwordHash: newHash,
        mustChangePassword: false,
        passwordChangedAt: new Date(),
        sessionVersion: sql`"session_version" + 1`,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId));

    // Invalidate old database sessions
    await db
      .update(schema.sessions)
      .set({ isValid: false })
      .where(eq(schema.sessions.userId, userId));

    await this.recordAuditLog(
      userId,
      "PASSWORD_CHANGED",
      "user",
      userId,
      "User successfully updated password. Prior sessions revoked.",
      ipAddress
    );

    return { success: true, message: "Password updated successfully." };
  }

  /**
   * Invalidate active session on logout
   */
  static async logout(sessionToken?: string, userId?: string) {
    if (sessionToken) {
      await db
        .update(schema.sessions)
        .set({ isValid: false })
        .where(eq(schema.sessions.sessionToken, sessionToken));
    }
    if (userId) {
      await this.recordAuditLog(userId, "LOGOUT", "user", userId, "User logged out");
    }
    return { success: true };
  }

  /**
   * Create Employee Account (Admin only)
   */
  static async createEmployee(
    data: {
      name: string;
      email: string;
      username?: string;
      phone?: string;
      roleSlug: string;
      branchId?: string;
      additionalBranchIds?: string[];
      passwordPlain?: string;
      mustChangePassword?: boolean;
      employeeCode?: string;
      department?: string;
      designation?: string;
    },
    actorId?: string
  ) {
    const email = data.email.trim().toLowerCase();
    const username = (data.username || email.split("@")[0]).trim().toLowerCase();

    // Check duplicate email or username
    const existing = await db
      .select()
      .from(schema.users)
      .where(
        or(
          eq(schema.users.normalizedEmail, email),
          eq(schema.users.email, email),
          eq(schema.users.normalizedUsername, username),
          eq(schema.users.username, username)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: "An employee with this email or username already exists." };
    }

    const initialPassword = data.passwordPlain || "Solar@2025!";
    const passwordHash = await bcrypt.hash(initialPassword, 12);

    // 1. Insert user
    const [newUser] = await db
      .insert(schema.users)
      .values({
        name: data.name,
        email,
        normalizedEmail: email,
        username,
        normalizedUsername: username,
        phone: data.phone || null,
        role: data.roleSlug,
        branchId: data.branchId || null,
        passwordHash,
        status: "Active",
        isActive: true,
        mustChangePassword: data.mustChangePassword ?? true,
        sessionVersion: 1,
        createdBy: actorId ? (actorId as any) : null,
      })
      .returning();

    // 2. Link role in user_roles table
    const [roleRecord] = await db
      .select()
      .from(schema.roles)
      .where(eq(schema.roles.slug, data.roleSlug))
      .limit(1);

    if (roleRecord && newUser) {
      await db.insert(schema.userRoles).values({
        userId: newUser.id,
        roleId: roleRecord.id,
        assignedBy: actorId ? (actorId as any) : null,
      });
    }

    // 3. Link branches in user_branches table
    const allBranchIds = new Set<string>();
    if (data.branchId) allBranchIds.add(data.branchId);
    if (data.additionalBranchIds) data.additionalBranchIds.forEach((b) => allBranchIds.add(b));

    for (const bId of allBranchIds) {
      await db.insert(schema.userBranches).values({
        userId: newUser.id,
        branchId: bId,
        isPrimary: bId === data.branchId,
      });
    }

    // 4. Optionally insert into employees table for HR records
    if (data.employeeCode || data.department || data.designation) {
      try {
        await db.insert(schema.employees).values({
          userId: newUser.id,
          employeeCode: data.employeeCode || `EMP-${Date.now().toString().slice(-4)}`,
          name: data.name,
          email,
          phone: data.phone || "N/A",
          department: data.department || "Engineering",
          designation: data.designation || "Staff",
          branchId: data.branchId || null,
          joiningDate: new Date(),
          status: "Active",
        });
      } catch (e) {
        console.warn("Notice inserting employee profile:", e);
      }
    }

    await this.recordAuditLog(
      actorId || newUser.id,
      "EMPLOYEE_CREATED",
      "user",
      newUser.id,
      `Employee account created for ${newUser.name} with role ${data.roleSlug}`,
      undefined
    );

    return {
      success: true,
      user: newUser,
      temporaryPassword: initialPassword,
    };
  }

  /**
   * Toggle employee active status (Activate / Deactivate / Suspend) with last Super Admin protection
   */
  static async updateEmployeeStatus(
    userId: string,
    status: "Active" | "Inactive" | "Suspended",
    actorId?: string
  ) {
    // If deactivating, protect last active Super Admin
    if (status !== "Active") {
      const protection = await protectLastSuperAdmin(userId, "deactivate");
      if (!protection.allowed) {
        return { success: false, error: protection.reason };
      }
    }

    await db
      .update(schema.users)
      .set({
        status,
        isActive: status === "Active",
        sessionVersion: sql`"session_version" + 1`, // Revoke sessions immediately
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId));

    // Invalidate all active sessions immediately
    if (status !== "Active") {
      await db
        .update(schema.sessions)
        .set({ isValid: false })
        .where(eq(schema.sessions.userId, userId));
    }

    await this.recordAuditLog(
      actorId || userId,
      "EMPLOYEE_STATUS_CHANGED",
      "user",
      userId,
      `Employee status set to ${status}. All active sessions invalidated.`,
      undefined
    );

    return { success: true };
  }

  /**
   * Change user role with last Super Admin protection
   */
  static async changeUserRole(userId: string, newRoleSlug: string, actorId?: string) {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    if (!user) return { success: false, error: "User not found" };

    if (user.role === "super_admin" && newRoleSlug !== "super_admin") {
      const protection = await protectLastSuperAdmin(userId, "demote");
      if (!protection.allowed) {
        return { success: false, error: protection.reason };
      }
    }

    const [role] = await db
      .select()
      .from(schema.roles)
      .where(eq(schema.roles.slug, newRoleSlug))
      .limit(1);

    if (!role) return { success: false, error: `Role '${newRoleSlug}' does not exist` };

    // Update primary role on user
    await db
      .update(schema.users)
      .set({
        role: newRoleSlug,
        sessionVersion: sql`"session_version" + 1`, // Take effect immediately
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId));

    // Clear and re-link user_roles
    await db.delete(schema.userRoles).where(eq(schema.userRoles.userId, userId));
    await db.insert(schema.userRoles).values({
      userId,
      roleId: role.id,
      assignedBy: actorId ? (actorId as any) : null,
    });

    await this.recordAuditLog(
      actorId || userId,
      "ROLE_ASSIGNMENT_CHANGED",
      "user",
      userId,
      `Role updated from ${user.role} to ${newRoleSlug}`,
      undefined
    );

    return { success: true };
  }

  /**
   * Unlock locked employee account
   */
  static async unlockEmployee(userId: string, actorId?: string) {
    await db
      .update(schema.users)
      .set({
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId));

    await this.recordAuditLog(
      actorId || userId,
      "EMPLOYEE_UNLOCKED",
      "user",
      userId,
      "Account manually unlocked by administrator",
      undefined
    );

    return { success: true };
  }

  /**
   * Audit log writer helper
   */
  static async recordAuditLog(
    userId: string | null,
    action: string,
    entityType: string,
    entityId: string,
    details?: string,
    ipAddress?: string
  ) {
    try {
      await db.insert(schema.auditLogs).values({
        userId: userId || null,
        action,
        entity: entityType,
        entityId: entityId || null,
        newValues: details ? JSON.stringify({ message: details }) : null,
        ipAddress: ipAddress || null,
      });
    } catch (e) {
      console.warn("Audit log writing notice:", e);
    }
  }
}
