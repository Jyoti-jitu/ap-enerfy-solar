import { pgTable, uuid, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";
import { companies, branches } from "./company";

/**
 * 2. AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC)
 * Production-ready identity, permissions, multi-role, branch scoping, and session revocation.
 */

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  employeeId: text("employee_id"), // e.g. 'EMP-001'
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  normalizedEmail: text("normalized_email"), // lower-cased & trimmed for fast indexed lookups
  username: text("username").unique(),
  normalizedUsername: text("normalized_username"), // lower-cased & trimmed
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("super_admin"), // Primary role slug
  phone: text("phone"),
  avatar: text("avatar"),
  profileImage: text("profile_image"),
  isActive: boolean("is_active").default(true).notNull(),
  status: text("status").notNull().default("Active"), // 'Active' | 'Inactive' | 'Suspended'
  mustChangePassword: boolean("must_change_password").default(false).notNull(),
  sessionVersion: integer("session_version").default(1).notNull(), // Incremented to revoke all active sessions immediately
  failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  lastLoginIp: text("last_login_ip"),
  passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("users_email_idx").on(table.email),
  index("users_norm_email_idx").on(table.normalizedEmail),
  index("users_norm_username_idx").on(table.normalizedUsername),
  index("users_role_idx").on(table.role),
  index("users_branch_idx").on(table.branchId),
  index("users_session_ver_idx").on(table.id, table.sessionVersion),
]);

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull().unique(), // 'Super Admin', 'Accountant', etc.
  slug: text("slug").notNull().unique(), // 'super_admin', 'accountant', etc.
  description: text("description"),
  isSystem: boolean("is_system").default(true).notNull(),
  isSystemRole: boolean("is_system_role").default(true).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("roles_company_idx").on(table.companyId),
  index("roles_slug_idx").on(table.slug),
]);

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(), // e.g. 'invoices:create' or 'invoices.create'
  permissionKey: text("permission_key"), // e.g. 'invoices.create'
  name: text("name").notNull(),
  resource: text("resource").notNull(), // 'invoices', 'customers', etc.
  action: text("action").notNull(), // 'view', 'create', 'update', 'approve', 'cancel', 'export', 'admin'
  module: text("module"), // 'Billing', 'CRM', 'Inventory', 'System', etc.
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("perms_resource_idx").on(table.resource),
  index("perms_key_idx").on(table.permissionKey),
  index("perms_module_idx").on(table.module),
]);

export const rolePermissions = pgTable("role_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleId: uuid("role_id").references(() => roles.id, { onDelete: "cascade" }).notNull(),
  permissionId: uuid("permission_id").references(() => permissions.id, { onDelete: "cascade" }).notNull(),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("role_perm_idx").on(table.roleId, table.permissionId),
]);

export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roleId: uuid("role_id").references(() => roles.id, { onDelete: "cascade" }).notNull(),
  assignedBy: uuid("assigned_by"),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("user_role_idx").on(table.userId, table.roleId),
]);

export const userBranches = pgTable("user_branches", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "cascade" }).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("user_branch_idx").on(table.userId, table.branchId),
]);

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  isValid: boolean("is_valid").default(true).notNull(),
  sessionVersion: integer("session_version").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("sessions_token_idx").on(table.sessionToken),
  index("sessions_user_valid_idx").on(table.userId, table.isValid),
]);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  tokenHash: text("token_hash"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("pwd_reset_token_idx").on(table.token),
  index("pwd_reset_hash_idx").on(table.tokenHash),
]);
