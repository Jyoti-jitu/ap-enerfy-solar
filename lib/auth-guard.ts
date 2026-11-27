import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { cache } from "react";
import { db, schema } from "@/db";
import { eq, and, gt, sql } from "drizzle-orm";
import { AuthService } from "@/services/auth.service";
import { hasPermission as checkPermission, hasAnyPermission as checkAnyPermission } from "./rbac";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  username: string | null;
  role: string;
  roles: string[];
  permissions: string[];
  branchId: string | null;
  companyId: string | null;
  authorizedBranchIds: string[];
  mustChangePassword: boolean;
  sessionVersion: number;
}

/**
 * Retrieve the current authenticated user from session cookie or Auth.js session.
 * Enforces real-time account status checks (Active/Inactive) and session version invalidation.
 */
export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("ap_solar_session")?.value;

    if (!sessionToken) {
      return null;
    }

    // 1. Fetch active session record
    const [sessionRecord] = await db
      .select()
      .from(schema.sessions)
      .where(
        and(
          eq(schema.sessions.sessionToken, sessionToken),
          eq(schema.sessions.isValid, true),
          gt(schema.sessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!sessionRecord) return null;

    // 2. Fetch user record
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, sessionRecord.userId))
      .limit(1);

    if (!user) return null;

    // 3. Strict Real-time Security Checks:
    // a. Must be active
    if (user.status !== "Active" || !user.isActive) {
      // Invalidate the session record if user was deactivated
      await db.update(schema.sessions).set({ isValid: false }).where(eq(schema.sessions.id, sessionRecord.id));
      return null;
    }

    // b. Session version match (revocation check)
    if (sessionRecord.sessionVersion < (user.sessionVersion || 1)) {
      await db.update(schema.sessions).set({ isValid: false }).where(eq(schema.sessions.id, sessionRecord.id));
      return null;
    }

    // 4. Retrieve User Roles, Permissions, and Authorized Branches
    const { roles, permissions } = await AuthService.getUserPermissions(user.id, user.role);

    // Fetch multi-branch access
    const userBranchRows = await db
      .select({ branchId: schema.userBranches.branchId })
      .from(schema.userBranches)
      .where(eq(schema.userBranches.userId, user.id));

    const authorizedBranchIds = new Set<string>();
    if (user.branchId) authorizedBranchIds.add(user.branchId);
    userBranchRows.forEach((r: any) => authorizedBranchIds.add(r.branchId));

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      roles,
      permissions,
      branchId: user.branchId,
      companyId: user.companyId,
      authorizedBranchIds: Array.from(authorizedBranchIds),
      mustChangePassword: Boolean(user.mustChangePassword),
      sessionVersion: user.sessionVersion || 1,
    };
  } catch (err: any) {
    if (err?.message?.includes("outside a request scope")) {
      return null;
    }
    console.error("Auth guard error:", err);
    return null;
  }
});

/**
 * Require authentication. Throws or returns 401 if unauthenticated.
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED: Authentication required");
  }
  return user;
}

/**
 * Check if the currently authenticated user has the requested permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return checkPermission(user.permissions, permission);
}

/**
 * Require a specific permission. Throws error if unauthorized.
 */
export async function requirePermission(permission: string): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!checkPermission(user.permissions, permission)) {
    throw new Error(`FORBIDDEN: Missing required permission [${permission}]`);
  }
  return user;
}

/**
 * Check if current user has any of the listed permissions
 */
export async function hasAnyPermission(permissions: string[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return checkAnyPermission(user.permissions, permissions);
}

/**
 * Validate company-level data isolation
 */
export async function requireCompanyAccess(companyId?: string | null): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (user.roles.includes("super_admin") || user.permissions.includes("*")) {
    return user;
  }
  if (!companyId || user.companyId !== companyId) {
    throw new Error("FORBIDDEN: Cross-company access violation");
  }
  return user;
}

/**
 * Validate branch-level data isolation
 */
export async function requireBranchAccess(branchId?: string | null): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (user.roles.includes("super_admin") || user.permissions.includes("*")) {
    return user;
  }
  if (!branchId || !user.authorizedBranchIds.includes(branchId)) {
    throw new Error("FORBIDDEN: Cross-branch access violation");
  }
  return user;
}

/**
 * Validate project-level access
 */
export async function requireProjectAccess(projectId: string): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (user.roles.includes("super_admin") || user.permissions.includes("*")) {
    return user;
  }

  const [project] = await db
    .select({
      id: schema.projects.id,
      companyId: schema.projects.companyId,
      branchId: schema.projects.branchId,
      assignedEngineerId: schema.projects.assignedEngineerId,
    })
    .from(schema.projects)
    .where(eq(schema.projects.id, projectId))
    .limit(1);

  if (!project) {
    throw new Error("NOT_FOUND: Project not found");
  }

  // Check company match
  if (project.companyId && user.companyId && project.companyId !== user.companyId) {
    throw new Error("FORBIDDEN: Cross-company project violation");
  }

  // Check if assigned or branch matches
  const isAssigned = project.assignedEngineerId === user.id;
  const isBranchAllowed = project.branchId ? user.authorizedBranchIds.includes(project.branchId) : true;

  // Check project_members table
  const [membership] = await db
    .select()
    .from(schema.projectMembers)
    .where(and(eq(schema.projectMembers.projectId, projectId), eq(schema.projectMembers.userId, user.id)))
    .limit(1);

  if (!isAssigned && !isBranchAllowed && !membership) {
    throw new Error("FORBIDDEN: You do not have permission to access this project");
  }

  return user;
}

/**
 * Invalidate all sessions for a user immediately (revocation)
 */
export async function revokeUserSessions(userId: string): Promise<boolean> {
  try {
    // 1. Increment session_version in users table
    await db
      .update(schema.users)
      .set({
        sessionVersion: sql`"session_version" + 1`,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId));

    // 2. Mark all existing database sessions as invalid
    await db
      .update(schema.sessions)
      .set({ isValid: false })
      .where(eq(schema.sessions.userId, userId));

    return true;
  } catch (err) {
    console.error("Failed to revoke user sessions:", err);
    return false;
  }
}

/**
 * Protect the last active Super Admin account from accidental deletion, deactivation or demotion
 */
export async function protectLastSuperAdmin(
  targetUserId: string,
  action: "deactivate" | "delete" | "demote"
): Promise<{ allowed: boolean; reason?: string }> {
  // 1. Check if the target user is currently an active Super Admin
  const [targetUser] = await db
    .select({
      id: schema.users.id,
      role: schema.users.role,
      status: schema.users.status,
      isActive: schema.users.isActive,
    })
    .from(schema.users)
    .where(eq(schema.users.id, targetUserId))
    .limit(1);

  if (!targetUser) {
    return { allowed: false, reason: "Target user not found" };
  }

  if (targetUser.role !== "super_admin") {
    return { allowed: true };
  }

  // 2. Count active Super Admins
  const activeSuperAdmins = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(
      and(
        eq(schema.users.role, "super_admin"),
        eq(schema.users.isActive, true),
        eq(schema.users.status, "Active")
      )
    );

  if (activeSuperAdmins.length <= 1) {
    return {
      allowed: false,
      reason: `Cannot ${action} the last active Super Admin account. System must always have at least one active Super Admin.`,
    };
  }

  return { allowed: true };
}

/**
 * Enforce permission in API Route handlers.
 * Returns { user, errorResponse: null } if authorized, or a 401/403 NextResponse if unauthorized.
 */
export async function enforceApiPermission(
  requiredPermission: string
): Promise<{ user: AuthenticatedUser | null; errorResponse: NextResponse | null }> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, error: "Unauthorized. Authentication is required to access this resource." },
        { status: 401 }
      ),
    };
  }

  // Check permission
  if (!checkPermission(user.permissions, requiredPermission)) {
    return {
      user,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: `Forbidden. You lack the '${requiredPermission}' permission required for this action.`,
          requiredPermission,
          userRole: user.role,
        },
        { status: 403 }
      ),
    };
  }

  return { user, errorResponse: null };
}
