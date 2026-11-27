import { pgTable, uuid, text, timestamp, boolean, integer, numeric, index } from "drizzle-orm/pg-core";
import { companies } from "./company";
import { customers } from "./customers";
import { projects } from "./projects";
import { users } from "./auth";

/**
 * 9. SUBSIDY & NET METERING MANAGEMENT
 * Direct integrations with PM Surya Ghar scheme and state Discom utilities (TPCODL, etc.)
 */

export const subsidyApplications = pgTable("subsidy_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationNumber: text("application_number").notNull().unique(), // e.g. 'SUB-2025-0112'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  schemeName: text("scheme_name").default("PM Surya Ghar: Muft Bijli Yojana").notNull(),
  sanctionedCapacityKw: numeric("sanctioned_capacity_kw", { precision: 8, scale: 2 }).notNull(),
  eligibleSubsidyAmount: numeric("eligible_subsidy_amount", { precision: 12, scale: 2 }).notNull(),
  disbursedSubsidyAmount: numeric("disbursed_subsidy_amount", { precision: 12, scale: 2 }).default("0.00").notNull(),
  discomName: text("discom_name").default("TPCODL").notNull(),
  consumerNumber: text("consumer_number").notNull(),
  portalApplicationId: text("portal_application_id"), // National solar portal application ID
  applicationDate: timestamp("application_date", { withTimezone: true }).notNull(),
  inspectionDate: timestamp("inspection_date", { withTimezone: true }),
  approvalDate: timestamp("approval_date", { withTimezone: true }),
  disbursementDate: timestamp("disbursement_date", { withTimezone: true }),
  status: text("status").default("Application Submitted").notNull(), // 'Application Submitted' | 'Inspection Scheduled' | 'Approved' | 'Disbursed' | 'Rejected'
  remarks: text("remarks"),
  handledById: uuid("handled_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("subsidy_app_num_idx").on(table.applicationNumber),
  index("subsidy_customer_idx").on(table.customerId),
  index("subsidy_status_idx").on(table.status),
]);

export const subsidyStatusHistory = pgTable("subsidy_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  subsidyApplicationId: uuid("subsidy_application_id").references(() => subsidyApplications.id, { onDelete: "cascade" }).notNull(),
  previousStatus: text("previous_status"),
  newStatus: text("new_status").notNull(),
  changeDate: timestamp("change_date", { withTimezone: true }).defaultNow().notNull(),
  notes: text("notes"),
  updatedById: uuid("updated_by_id").references(() => users.id),
}, (table) => [
  index("subsidy_hist_app_idx").on(table.subsidyApplicationId),
]);

export const netMeteringApplications = pgTable("net_metering_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  netMeterAppNumber: text("net_meter_app_number").notNull().unique(), // e.g. 'NMA-2025-0078'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  discomUtility: text("discom_utility").default("TPCODL").notNull(),
  consumerNumber: text("consumer_number").notNull(),
  meterSerialNumber: text("meter_serial_number"),
  meterMake: text("meter_make"), // e.g. 'Secure Meters', 'L&T', 'Genus'
  applicationDate: timestamp("application_date", { withTimezone: true }).notNull(),
  feasibilityApprovedDate: timestamp("feasibility_approved_date", { withTimezone: true }),
  meterInstalledDate: timestamp("meter_installed_date", { withTimezone: true }),
  meterTestedDate: timestamp("meter_tested_date", { withTimezone: true }),
  status: text("status").default("Feasibility Applied").notNull(), // 'Feasibility Applied' | 'Feasibility Approved' | 'Meter Procured' | 'Meter Installed' | 'Synchronized' | 'Rejected'
  discomInspectorName: text("discom_inspector_name"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("net_meter_num_idx").on(table.netMeterAppNumber),
  index("net_meter_customer_idx").on(table.customerId),
]);
