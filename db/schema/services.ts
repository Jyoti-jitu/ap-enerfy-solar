import { pgTable, uuid, text, timestamp, boolean, integer, numeric, index } from "drizzle-orm/pg-core";
import { companies, branches } from "./company";
import { customers } from "./customers";
import { projects } from "./projects";
import { users } from "./auth";

/**
 * 11. SERVICE, MAINTENANCE & AMC CONTRACTS
 */

export const warranties = pgTable("warranties", {
  id: uuid("id").primaryKey().defaultRandom(),
  warrantyCertificateNo: text("warranty_certificate_no").notNull().unique(), // e.g. 'WAR-2025-0104'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  itemType: text("item_type").notNull(), // 'Solar Modules' | 'Solar Inverter' | 'System Workmanship' | 'Battery Bank'
  brand: text("brand"),
  serialNumber: text("serial_number"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  durationYears: integer("duration_years").default(25).notNull(),
  status: text("status").default("Active").notNull(), // 'Active' | 'Expired' | 'Claimed'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("warranties_cert_idx").on(table.warrantyCertificateNo),
  index("warranties_customer_idx").on(table.customerId),
]);

export const warrantyClaims = pgTable("warranty_claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  claimNumber: text("claim_number").notNull().unique(),
  warrantyId: uuid("warranty_id").references(() => warranties.id, { onDelete: "restrict" }).notNull(),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  claimDate: timestamp("claim_date", { withTimezone: true }).notNull(),
  issueDescription: text("issue_description").notNull(),
  status: text("status").default("Submitted").notNull(), // 'Submitted' | 'Under Review' | 'OEM Approved' | 'Replaced' | 'Rejected'
  replacementSerial: text("replacement_serial"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("claims_warranty_idx").on(table.warrantyId),
]);

export const serviceTickets = pgTable("service_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketNumber: text("ticket_number").notNull().unique(), // e.g. 'SRV-2025-0089'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").default("Medium").notNull(), // 'Low' | 'Medium' | 'High' | 'Critical'
  status: text("status").default("Open").notNull(), // 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed'
  issueType: text("issue_type").default("Inverter Error").notNull(), // 'Inverter Error' | 'Generation Drop' | 'Panel Cleaning' | 'Cable Fault' | 'Net Meter Issue' | 'Routine Check'
  assignedTechnicianId: uuid("assigned_technician_id").references(() => users.id),
  reportedDate: timestamp("reported_date", { withTimezone: true }).notNull(),
  scheduledDate: timestamp("scheduled_date", { withTimezone: true }),
  resolvedDate: timestamp("resolved_date", { withTimezone: true }),
  resolutionNotes: text("resolution_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("service_tickets_num_idx").on(table.ticketNumber),
  index("service_tickets_cust_idx").on(table.customerId),
  index("service_tickets_tech_idx").on(table.assignedTechnicianId),
  index("service_tickets_status_idx").on(table.status),
]);

export const serviceVisits = pgTable("service_visits", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id").references(() => serviceTickets.id, { onDelete: "cascade" }).notNull(),
  technicianId: uuid("technician_id").references(() => users.id).notNull(),
  visitDate: timestamp("visit_date", { withTimezone: true }).notNull(),
  workDone: text("work_done").notNull(),
  partsReplaced: text("parts_replaced"),
  customerFeedback: text("customer_feedback"),
  customerRating: integer("customer_rating"), // 1 to 5
  customerSignatureUrl: text("customer_signature_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("visits_ticket_idx").on(table.ticketId),
]);

export const amcContracts = pgTable("amc_contracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractNumber: text("contract_number").notNull().unique(), // e.g. 'AMC-2025-0012'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  planName: text("plan_name").notNull(), // 'Gold Maintenance Plan' | 'Comprehensive Solar AMC'
  annualVisits: integer("annual_visits").default(4).notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  contractValue: numeric("contract_value", { precision: 12, scale: 2 }).notNull(),
  status: text("status").default("Active").notNull(), // 'Active' | 'Expired' | 'Renewed' | 'Cancelled'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("amc_number_idx").on(table.contractNumber),
  index("amc_customer_idx").on(table.customerId),
]);

export const maintenanceSchedules = pgTable("maintenance_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  amcContractId: uuid("amc_contract_id").references(() => amcContracts.id, { onDelete: "cascade" }).notNull(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  visitQuarter: text("visit_quarter"), // 'Q1 2025', 'Q2 2025'
  scheduledDate: timestamp("scheduled_date", { withTimezone: true }).notNull(),
  serviceType: text("service_type").default("Panel Cleaning & Electrical Audit").notNull(),
  status: text("status").default("Pending").notNull(), // 'Pending' | 'Completed' | 'Overdue'
  completedDate: timestamp("completed_date", { withTimezone: true }),
  technicianId: uuid("technician_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("maint_sched_contract_idx").on(table.amcContractId),
]);
