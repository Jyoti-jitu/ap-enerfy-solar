import { pgTable, uuid, text, timestamp, boolean, integer, numeric, index } from "drizzle-orm/pg-core";
import { companies, branches } from "./company";
import { users } from "./auth";

/**
 * 3. CUSTOMER MANAGEMENT
 * Customers, multiple addresses, KYC documents, leads, follow-ups, and site surveys.
 */

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: text("customer_id").notNull().unique(), // e.g. 'CUST-0258'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  customerType: text("customer_type").notNull().default("residential"), // 'residential' | 'commercial' | 'industrial' | 'agricultural'
  mobile: text("mobile").notNull(),
  email: text("email"),
  gstin: text("gstin"),
  pan: text("pan"),
  address: text("address").notNull(),
  city: text("city").notNull().default("Bhubaneswar"),
  state: text("state").notNull().default("Odisha"),
  pincode: text("pincode"),
  solarCapacity: numeric("solar_capacity", { precision: 8, scale: 2 }).default("3.00").notNull(),
  projectStatus: text("project_status").default("survey").notNull(), // 'survey' | 'quotation' | 'installation' | 'commissioned' | 'maintenance'
  totalBilled: numeric("total_billed", { precision: 14, scale: 2 }).default("0.00").notNull(),
  totalPaid: numeric("total_paid", { precision: 14, scale: 2 }).default("0.00").notNull(),
  outstandingAmount: numeric("outstanding_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  discomName: text("discom_name").default("TPCODL").notNull(), // TPCODL, TPNODL, TPSODL, TPWODL
  consumerNumber: text("consumer_number"),
  sanctionedLoad: numeric("sanctioned_load", { precision: 8, scale: 2 }),
  notes: text("notes"),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("customers_code_idx").on(table.customerId),
  index("customers_mobile_idx").on(table.mobile),
  index("customers_branch_idx").on(table.branchId),
  index("customers_city_idx").on(table.city),
]);

export const customerAddresses = pgTable("customer_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "cascade" }).notNull(),
  addressType: text("address_type").notNull().default("installation"), // 'installation' | 'billing' | 'dispatch'
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: text("city").notNull().default("Bhubaneswar"),
  state: text("state").notNull().default("Odisha"),
  pincode: text("pincode").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("cust_addr_cust_idx").on(table.customerId),
]);

export const customerDocuments = pgTable("customer_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "cascade" }).notNull(),
  documentType: text("document_type").notNull(), // 'Electricity Bill' | 'Aadhaar Card' | 'PAN Card' | 'Roof Photo' | 'Property Tax Receipt' | 'Bank Passbook'
  documentNumber: text("document_number"),
  fileKey: text("file_key").notNull(),
  fileUrl: text("file_url"),
  mimeType: text("mime_type"),
  fileSize: integer("file_size"),
  isVerified: boolean("is_verified").default(false).notNull(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  verifiedById: uuid("verified_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("cust_docs_cust_idx").on(table.customerId),
]);

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadNumber: text("lead_number").notNull().unique(), // e.g., 'LEAD-001'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  city: text("city").default("Bhubaneswar").notNull(),
  state: text("state").default("Odisha").notNull(),
  address: text("address"),
  proposedCapacity: numeric("proposed_capacity", { precision: 8, scale: 2 }),
  systemType: text("system_type").default("On-Grid").notNull(), // 'On-Grid' | 'Hybrid' | 'Off-Grid'
  source: text("source").default("Website").notNull(), // 'Website' | 'Referral' | 'Exhibition' | 'Direct' | 'Campaign'
  status: text("status").default("New").notNull(), // 'New' | 'Contacted' | 'Site Visit Scheduled' | 'Quotation Sent' | 'Won' | 'Lost'
  assignedToId: uuid("assigned_to_id").references(() => users.id),
  estimatedBudget: numeric("estimated_budget", { precision: 14, scale: 2 }),
  discomName: text("discom_name").default("TPCODL"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("leads_status_idx").on(table.status),
  index("leads_phone_idx").on(table.phone),
  index("leads_assigned_idx").on(table.assignedToId),
]);

export const leadFollowUps = pgTable("lead_follow_ups", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }).notNull(),
  followUpDate: timestamp("follow_up_date", { withTimezone: true }).notNull(),
  followUpType: text("follow_up_type").default("Call").notNull(), // 'Call' | 'Meeting' | 'Site Visit' | 'WhatsApp' | 'Email'
  notes: text("notes").notNull(),
  nextAction: text("next_action"),
  nextActionDate: timestamp("next_action_date", { withTimezone: true }),
  status: text("status").default("Pending").notNull(), // 'Pending' | 'Completed' | 'Rescheduled'
  performedById: uuid("performed_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("follow_ups_lead_idx").on(table.leadId),
]);

export const siteSurveys = pgTable("site_surveys", {
  id: uuid("id").primaryKey().defaultRandom(),
  surveyNumber: text("survey_number").notNull().unique(), // e.g. 'SRV-001'
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  assignedToId: uuid("assigned_to_id").references(() => users.id),
  surveyDate: timestamp("survey_date", { withTimezone: true }).notNull(),
  roofType: text("roof_type").default("RCC Roof").notNull(), // 'RCC Roof' | 'Tin Shed' | 'Tile Roof' | 'Ground Mount'
  roofAreaSqFt: numeric("roof_area_sq_ft", { precision: 10, scale: 2 }),
  shadowFreeAreaSqFt: numeric("shadow_free_area_sq_ft", { precision: 10, scale: 2 }),
  recommendedCapacityKw: numeric("recommended_capacity_kw", { precision: 8, scale: 2 }),
  recommendedSystemType: text("recommended_system_type").default("On-Grid"),
  gridPhase: text("grid_phase").default("Three Phase"), // 'Single Phase' | 'Three Phase'
  sanctionedLoadKw: numeric("sanctioned_load_kw", { precision: 8, scale: 2 }),
  discomUtility: text("discom_utility").default("TPCODL"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  structuralCondition: text("structural_condition"),
  surveyNotes: text("survey_notes"),
  status: text("status").default("Scheduled").notNull(), // 'Scheduled' | 'Completed' | 'Cancelled'
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("surveys_customer_idx").on(table.customerId),
  index("surveys_lead_idx").on(table.leadId),
]);
