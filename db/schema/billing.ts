import { pgTable, uuid, text, timestamp, boolean, integer, numeric, index } from "drizzle-orm/pg-core";
import { companies, branches } from "./company";
import { customers } from "./customers";
import { products, warehouses } from "./inventory";
import { salesOrders } from "./solar";
import { users } from "./auth";

/**
 * 6. BILLING, INVOICING, PAYMENTS, CREDIT/DEBIT NOTES, CHALLANS
 */

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNumber: text("invoice_number").notNull().unique(), // e.g. 'INV-2025-0145'
  invoiceType: text("invoice_type").default("Tax Invoice").notNull(), // 'Tax Invoice' | 'Proforma' | 'Advance Invoice' | 'Delivery Challan'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  financialYear: text("financial_year").default("2024-2025").notNull(),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  projectId: uuid("project_id"),
  salesOrderId: uuid("sales_order_id").references(() => salesOrders.id, { onDelete: "set null" }),
  invoiceDate: timestamp("invoice_date", { withTimezone: true }).notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  systemType: text("system_type").default("On-Grid"),
  capacity: numeric("capacity", { precision: 8, scale: 2 }),
  taxableAmount: numeric("taxable_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  cgstAmount: numeric("cgst_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  sgstAmount: numeric("sgst_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  igstAmount: numeric("igst_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  totalTax: numeric("total_tax", { precision: 14, scale: 2 }).default("0.00").notNull(),
  subsidyDeduction: numeric("subsidy_deduction", { precision: 14, scale: 2 }).default("0.00").notNull(),
  roundOff: numeric("round_off", { precision: 5, scale: 2 }).default("0.00").notNull(),
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  paidAmount: numeric("paid_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  balanceAmount: numeric("balance_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  status: text("status").default("Pending").notNull(), // 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid' | 'Cancelled'
  terms: text("terms"),
  notes: text("notes"),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("invoices_number_idx").on(table.invoiceNumber),
  index("invoices_customer_idx").on(table.customerId),
  index("invoices_status_idx").on(table.status),
  index("invoices_date_idx").on(table.invoiceDate),
]);

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").references(() => invoices.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }),
  description: text("description").notNull(),
  hsnCode: text("hsn_code").default("85414011").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  unit: text("unit").default("Nos").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).default("5.00").notNull(),
  taxableAmount: numeric("taxable_amount", { precision: 12, scale: 2 }).notNull(),
  cgstAmount: numeric("cgst_amount", { precision: 12, scale: 2 }).default("0.00").notNull(),
  sgstAmount: numeric("sgst_amount", { precision: 12, scale: 2 }).default("0.00").notNull(),
  igstAmount: numeric("igst_amount", { precision: 12, scale: 2 }).default("0.00").notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
}, (table) => [
  index("inv_items_inv_idx").on(table.invoiceId),
]);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentNumber: text("payment_number").notNull().unique(), // e.g. 'PAY-2025-0089'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  invoiceId: uuid("invoice_id").references(() => invoices.id, { onDelete: "set null" }),
  projectId: uuid("project_id"),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date", { withTimezone: true }).notNull(),
  paymentMode: text("payment_mode").default("UPI").notNull(), // 'Bank Transfer' | 'UPI' | 'Cheque' | 'Cash' | 'Direct Debit' | 'Online Gateway'
  referenceNumber: text("reference_number"), // UTR / Cheque Number / Transaction ID
  receiptType: text("receipt_type").default("Installment").notNull(), // 'Full Payment' | 'Advance' | 'Installment' | 'Subsidy Credit'
  status: text("status").default("Completed").notNull(), // 'Completed' | 'Pending' | 'Cleared' | 'Bounced' | 'Refunded'
  clearedAt: timestamp("cleared_at", { withTimezone: true }),
  notes: text("notes"),
  recordedById: uuid("recorded_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("payments_number_idx").on(table.paymentNumber),
  index("payments_customer_idx").on(table.customerId),
  index("payments_invoice_idx").on(table.invoiceId),
  index("payments_date_idx").on(table.paymentDate),
]);

export const paymentAllocations = pgTable("payment_allocations", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentId: uuid("payment_id").references(() => payments.id, { onDelete: "cascade" }).notNull(),
  invoiceId: uuid("invoice_id").references(() => invoices.id, { onDelete: "cascade" }).notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("pay_alloc_payment_idx").on(table.paymentId),
  index("pay_alloc_invoice_idx").on(table.invoiceId),
]);

export const paymentSchedules = pgTable("payment_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id"),
  salesOrderId: uuid("sales_order_id").references(() => salesOrders.id, { onDelete: "set null" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "cascade" }).notNull(),
  installmentName: text("installment_name").notNull(), // e.g. 'Booking Advance (20%)', 'Material Dispatch (60%)', 'Grid Commissioning (20%)'
  percentage: numeric("percentage", { precision: 5, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  status: text("status").default("Pending").notNull(), // 'Pending' | 'Paid' | 'Overdue'
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("pay_sched_cust_idx").on(table.customerId),
]);

export const creditNotes = pgTable("credit_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  creditNoteNumber: text("credit_note_number").notNull().unique(), // e.g. 'CN-2025-0005'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  invoiceId: uuid("invoice_id").references(() => invoices.id, { onDelete: "restrict" }),
  noteDate: timestamp("note_date", { withTimezone: true }).notNull(),
  reason: text("reason").notNull(),
  taxableAmount: numeric("taxable_amount", { precision: 12, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").default("Issued").notNull(), // 'Issued' | 'Applied' | 'Void'
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("credit_notes_num_idx").on(table.creditNoteNumber),
]);

export const creditNoteItems = pgTable("credit_note_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  creditNoteId: uuid("credit_note_id").references(() => creditNotes.id, { onDelete: "cascade" }).notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
});

export const debitNotes = pgTable("debit_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  debitNoteNumber: text("debit_note_number").notNull().unique(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  supplierId: uuid("supplier_id"),
  noteDate: timestamp("note_date", { withTimezone: true }).notNull(),
  reason: text("reason").notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").default("Issued").notNull(),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const debitNoteItems = pgTable("debit_note_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  debitNoteId: uuid("debit_note_id").references(() => debitNotes.id, { onDelete: "cascade" }).notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
});

export const refunds = pgTable("refunds", {
  id: uuid("id").primaryKey().defaultRandom(),
  refundNumber: text("refund_number").notNull().unique(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  paymentId: uuid("payment_id").references(() => payments.id, { onDelete: "set null" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  refundDate: timestamp("refund_date", { withTimezone: true }).notNull(),
  reason: text("reason").notNull(),
  mode: text("mode").default("Bank Transfer").notNull(),
  referenceNumber: text("reference_number"),
  status: text("status").default("Completed").notNull(),
  approvedById: uuid("approved_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const deliveryChallans = pgTable("delivery_challans", {
  id: uuid("id").primaryKey().defaultRandom(),
  challanNumber: text("challan_number").notNull().unique(), // e.g. 'DC-2025-0031'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "restrict" }).notNull(),
  projectId: uuid("project_id"),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id, { onDelete: "restrict" }).notNull(),
  challanDate: timestamp("challan_date", { withTimezone: true }).notNull(),
  dispatchDate: timestamp("dispatch_date", { withTimezone: true }),
  vehicleNumber: text("vehicle_number"),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  destinationAddress: text("destination_address").notNull(),
  status: text("status").default("Dispatched").notNull(), // 'Preparing' | 'Dispatched' | 'Delivered' | 'Returned'
  receivedBySignature: text("received_by_signature"),
  receivedAt: timestamp("received_at", { withTimezone: true }),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("challans_num_idx").on(table.challanNumber),
]);

export const deliveryChallanItems = pgTable("delivery_challan_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  challanId: uuid("challan_id").references(() => deliveryChallans.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }).notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  serialNumbers: text("serial_numbers"), // comma-separated or json serial identifiers
});
