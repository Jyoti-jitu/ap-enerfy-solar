import { pgTable, uuid, text, timestamp, boolean, integer, numeric, index } from "drizzle-orm/pg-core";
import { companies, branches } from "./company";
import { customers, leads } from "./customers";
import { products } from "./inventory";
import { users } from "./auth";

/**
 * 5. SOLAR PACKAGES, QUOTATIONS & SALES ORDERS
 */

export const solarPackages = pgTable("solar_packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g. '3 kW On-Grid Residential Rooftop', '5 kW Hybrid Premium'
  code: text("code").notNull().unique(),
  systemType: text("system_type").default("On-Grid").notNull(), // 'On-Grid' | 'Hybrid' | 'Off-Grid'
  capacityKw: numeric("capacity_kw", { precision: 8, scale: 2 }).notNull(),
  estimatedGenerationKwhPerDay: numeric("estimated_generation_kwh_per_day", { precision: 8, scale: 2 }),
  estimatedAnnualSavings: numeric("estimated_annual_savings", { precision: 12, scale: 2 }),
  subsidyApplicable: boolean("subsidy_applicable").default(true).notNull(),
  estimatedSubsidyAmount: numeric("estimated_subsidy_amount", { precision: 12, scale: 2 }),
  basePrice: numeric("base_price", { precision: 12, scale: 2 }).notNull(),
  defaultGstRate: numeric("default_gst_rate", { precision: 5, scale: 2 }).default("5.00").notNull(),
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const solarPackageItems = pgTable("solar_package_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  packageId: uuid("package_id").references(() => solarPackages.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }),
  notes: text("notes"),
}, (table) => [
  index("pkg_items_pkg_idx").on(table.packageId),
]);

export const quotations = pgTable("quotations", {
  id: uuid("id").primaryKey().defaultRandom(),
  quotationNumber: text("quotation_number").notNull().unique(), // e.g. 'QTN-2025-0042'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  solarPackageId: uuid("solar_package_id").references(() => solarPackages.id, { onDelete: "set null" }),
  systemType: text("system_type").notNull().default("On-Grid"),
  capacity: numeric("capacity", { precision: 8, scale: 2 }).notNull(),
  validUntil: timestamp("valid_until", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("Quotation Sent"), // 'Draft' | 'Quotation Sent' | 'Accepted' | 'Pending' | 'Lost' | 'Revision'
  subtotal: numeric("subtotal", { precision: 14, scale: 2 }).default("0.00").notNull(),
  taxableAmount: numeric("taxable_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).default("5.00").notNull(),
  cgstAmount: numeric("cgst_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  sgstAmount: numeric("sgst_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  igstAmount: numeric("igst_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  totalTax: numeric("total_tax", { precision: 14, scale: 2 }).default("0.00").notNull(),
  subsidyAmount: numeric("subsidy_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  netPayable: numeric("net_payable", { precision: 14, scale: 2 }).default("0.00").notNull(),
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  termsAndConditions: text("terms_and_conditions"),
  notes: text("notes"),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("quotations_number_idx").on(table.quotationNumber),
  index("quotations_customer_idx").on(table.customerId),
  index("quotations_status_idx").on(table.status),
]);

export const quotationItems = pgTable("quotation_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  quotationId: uuid("quotation_id").references(() => quotations.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }),
  description: text("description").notNull(),
  hsnCode: text("hsn_code").default("85414011"),
  quantity: integer("quantity").default(1).notNull(),
  unit: text("unit").default("Nos").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).default("5.00").notNull(),
  taxableAmount: numeric("taxable_amount", { precision: 12, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
}, (table) => [
  index("qtn_items_qtn_idx").on(table.quotationId),
]);

export const quotationRevisions = pgTable("quotation_revisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  quotationId: uuid("quotation_id").references(() => quotations.id, { onDelete: "cascade" }).notNull(),
  revisionNumber: integer("revision_number").default(1).notNull(),
  changesSummary: text("changes_summary"),
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull(),
  revisedById: uuid("revised_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("qtn_revisions_qtn_idx").on(table.quotationId),
]);

export const salesOrders = pgTable("sales_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull().unique(), // e.g. 'SO-2025-0018'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  quotationId: uuid("quotation_id").references(() => quotations.id, { onDelete: "set null" }),
  orderDate: timestamp("order_date", { withTimezone: true }).notNull(),
  status: text("status").default("Confirmed").notNull(), // 'Confirmed' | 'In Progress' | 'Fulfilled' | 'Cancelled'
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull(),
  advanceRequired: numeric("advance_required", { precision: 14, scale: 2 }),
  advanceReceived: numeric("advance_received", { precision: 14, scale: 2 }).default("0.00"),
  notes: text("notes"),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("sales_orders_number_idx").on(table.orderNumber),
  index("sales_orders_customer_idx").on(table.customerId),
]);

export const salesOrderItems = pgTable("sales_order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  salesOrderId: uuid("sales_order_id").references(() => salesOrders.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }),
  description: text("description").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
}, (table) => [
  index("so_items_so_idx").on(table.salesOrderId),
]);
