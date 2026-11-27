import { pgTable, uuid, text, timestamp, boolean, integer, numeric, index } from "drizzle-orm/pg-core";
import { companies, branches } from "./company";
import { customers, leads } from "./customers";
import { quotations } from "./solar";
import { products, warehouses } from "./inventory";
import { users } from "./auth";

/**
 * 8. SOLAR INSTALLATION PROJECTS, MILESTONES, TASKS & MATERIALS
 */

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: text("project_id").notNull().unique(), // e.g. 'PRJ-0258'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  quotationId: uuid("quotation_id").references(() => quotations.id, { onDelete: "set null" }),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  systemType: text("system_type").default("On-Grid").notNull(), // 'On-Grid' | 'Hybrid' | 'Off-Grid'
  capacity: numeric("capacity", { precision: 8, scale: 2 }).notNull(), // in kW
  location: text("location").default("Bhubaneswar").notNull(),
  status: text("status").default("In Progress").notNull(), // 'Survey Done' | 'Material Dispatch' | 'Installation' | 'Inspection Scheduled' | 'Completed' | 'Delayed' | 'On Hold'
  progress: integer("progress").default(0).notNull(), // 0 to 100 percentage
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  targetEndDate: timestamp("target_end_date", { withTimezone: true }).notNull(),
  completedDate: timestamp("completed_date", { withTimezone: true }),
  assignedEngineerId: uuid("assigned_engineer_id").references(() => users.id),
  installationTeam: text("installation_team").default("Team Alfa"),
  discomConsumerNo: text("discom_consumer_no"),
  netMeterStatus: text("net_meter_status").default("Pending").notNull(), // 'Pending' | 'Applied' | 'Installed' | 'Synchronized'
  notes: text("notes"),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("projects_number_idx").on(table.projectId),
  index("projects_customer_idx").on(table.customerId),
  index("projects_status_idx").on(table.status),
  index("projects_engineer_idx").on(table.assignedEngineerId),
]);

export const projectMilestones = pgTable("project_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(), // 'Site Structure Assembly', 'Module Mounting', 'Inverter Cabling', 'Grid Synchronization'
  orderIndex: integer("order_index").default(0).notNull(),
  status: text("status").default("Pending").notNull(), // 'Pending' | 'In Progress' | 'Completed' | 'Blocked'
  targetDate: timestamp("target_date", { withTimezone: true }),
  completedDate: timestamp("completed_date", { withTimezone: true }),
  completedById: uuid("completed_by_id").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("milestones_project_idx").on(table.projectId),
]);

export const projectTasks = pgTable("project_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  milestoneId: uuid("milestone_id").references(() => projectMilestones.id, { onDelete: "cascade" }),
  taskName: text("task_name").notNull(),
  assignedToId: uuid("assigned_to_id").references(() => users.id),
  status: text("status").default("Pending").notNull(), // 'Pending' | 'In Progress' | 'Completed'
  dueDate: timestamp("due_date", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("tasks_project_idx").on(table.projectId),
]);

export const projectMembers = pgTable("project_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: text("role").default("Technician").notNull(), // 'Lead Engineer' | 'Supervisor' | 'Technician' | 'Quality Inspector'
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("proj_members_idx").on(table.projectId, table.userId),
]);

export const projectMaterials = pgTable("project_materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }).notNull(),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id, { onDelete: "restrict" }),
  requiredQuantity: integer("required_quantity").notNull(),
  dispatchedQuantity: integer("dispatched_quantity").default(0).notNull(),
  installedQuantity: integer("installed_quantity").default(0).notNull(),
  status: text("status").default("Pending").notNull(), // 'Pending' | 'Dispatched' | 'Installed'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("proj_materials_idx").on(table.projectId, table.productId),
]);

export const projectDocuments = pgTable("project_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(), // 'Structure Drawing', 'Single Line Diagram (SLD)', 'Inspection Report', 'Commissioning Certificate', 'Site Photos'
  documentType: text("document_type").notNull(),
  fileKey: text("file_key").notNull(),
  fileUrl: text("file_url"),
  uploadedById: uuid("uploaded_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("proj_docs_proj_idx").on(table.projectId),
]);

export const projectActivities = pgTable("project_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  activity: text("activity").notNull(),
  activityType: text("activity_type").default("Update").notNull(), // 'Milestone' | 'Material' | 'Status' | 'Note' | 'Inspection'
  performedById: uuid("performed_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("proj_acts_proj_idx").on(table.projectId),
]);
