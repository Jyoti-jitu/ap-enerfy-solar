import { pgTable, uuid, text, timestamp, boolean, integer, numeric, index } from "drizzle-orm/pg-core";

/**
 * 1. COMPANY & ADMINISTRATION
 * Multi-company, branch hierarchy, financial years, and document numbering sequences.
 */

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  legalName: text("legal_name"),
  code: text("code").notNull().unique(), // e.g., 'APES'
  gstin: text("gstin"),
  pan: text("pan"),
  cin: text("cin"),
  state: text("state").default("Odisha").notNull(),
  stateCode: text("state_code").default("21").notNull(),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  address: text("address"),
  logoUrl: text("logo_url"),
  currency: text("currency").default("INR").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const branches = pgTable("branches", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code").notNull(), // e.g. 'BBSR', 'CTC', 'PURI'
  city: text("city").notNull(),
  state: text("state").default("Odisha").notNull(),
  pincode: text("pincode"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  gstin: text("gstin"),
  isHeadquarters: boolean("is_headquarters").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("branches_company_idx").on(table.companyId),
  index("branches_code_idx").on(table.code),
]);

export const companySettings = pgTable("company_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "cascade" }),
  settingKey: text("setting_key").notNull(),
  settingValue: text("setting_value").notNull(),
  description: text("description"),
  updatedBy: uuid("updated_by"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("company_settings_key_idx").on(table.companyId, table.settingKey),
]);

export const financialYears = pgTable("financial_years", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
  code: text("code").notNull(), // e.g., '2024-2025'
  name: text("name").notNull(), // e.g., 'FY 2024-25'
  startDate: timestamp("start_date", { withTimezone: true }).notNull(), // April 1
  endDate: timestamp("end_date", { withTimezone: true }).notNull(), // March 31
  isCurrent: boolean("is_current").default(false).notNull(),
  isLocked: boolean("is_locked").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("financial_years_code_idx").on(table.companyId, table.code),
]);

export const documentSequences = pgTable("document_sequences", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "cascade" }),
  financialYearId: uuid("financial_year_id").references(() => financialYears.id, { onDelete: "cascade" }),
  documentType: text("document_type").notNull(), // 'INVOICE' | 'QUOTATION' | 'PROJECT' | 'PAYMENT' | 'PURCHASE_ORDER' | 'CHALLAN' | 'CREDIT_NOTE' | 'DEBIT_NOTE' | 'LEAD' | 'SERVICE'
  prefix: text("prefix").notNull(), // 'INV-2025-', 'QTN-2025-', etc.
  currentNumber: integer("current_number").default(0).notNull(),
  padding: integer("padding").default(4).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("doc_sequences_type_idx").on(table.companyId, table.documentType),
]);
