import { pgTable, uuid, text, timestamp, boolean, integer, numeric, index } from "drizzle-orm/pg-core";
import { companies, branches } from "./company";
import { users } from "./auth";

/**
 * 12. SYSTEM, EMPLOYEES, NOTIFICATIONS, AUDIT & STORAGE
 */

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  employeeCode: text("employee_code").notNull().unique(), // e.g. 'EMP-001'
  name: text("name").notNull(),
  designation: text("designation").notNull(),
  department: text("department").notNull(), // 'Engineering' | 'Sales' | 'Accounts' | 'Warehouse' | 'Service' | 'Management'
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  joiningDate: timestamp("joining_date", { withTimezone: true }).notNull(),
  salary: numeric("salary", { precision: 12, scale: 2 }),
  status: text("status").default("Active").notNull(), // 'Active' | 'On Leave' | 'Terminated'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("employees_code_idx").on(table.employeeCode),
  index("employees_email_idx").on(table.email),
  index("employees_dept_idx").on(table.department),
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("INFO").notNull(), // 'PAYMENT' | 'PROJECT' | 'LEAD' | 'INVENTORY' | 'SYSTEM' | 'INFO'
  link: text("link"),
  isRead: boolean("is_read").default(false).notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("notifs_user_read_idx").on(table.userId, table.isRead),
]);

export const notificationPreferences = pgTable("notification_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  smsNotifications: boolean("sms_notifications").default(false).notNull(),
  whatsappNotifications: boolean("whatsapp_notifications").default(true).notNull(),
  paymentAlerts: boolean("payment_alerts").default(true).notNull(),
  projectUpdates: boolean("project_updates").default(true).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  action: text("action").notNull(), // 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'APPROVE' | 'REJECT' | 'STATUS_CHANGE'
  entity: text("entity").notNull(), // 'invoices' | 'customers' | 'payments' | 'projects' | 'users'
  entityId: text("entity_id"),
  oldValues: text("old_values"), // JSON string
  newValues: text("new_values"), // JSON string
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("audit_entity_idx").on(table.entity, table.entityId),
  index("audit_user_idx").on(table.userId),
  index("audit_created_idx").on(table.createdAt),
]);

export const fileAttachments = pgTable("file_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  entityType: text("entity_type").notNull(), // 'CUSTOMER_DOC' | 'INVOICE_PDF' | 'SITE_PHOTO' | 'QUOTATION' | 'EXPENSE_RECEIPT' | 'PROJECT_DRAWING'
  entityId: text("entity_id").notNull(),
  bucket: text("bucket").default("uploads").notNull(),
  fileKey: text("file_key").notNull().unique(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  isPrivate: boolean("is_private").default(true).notNull(),
  uploadedById: uuid("uploaded_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("file_att_entity_idx").on(table.entityType, table.entityId),
  index("file_att_key_idx").on(table.fileKey),
]);
