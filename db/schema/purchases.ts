import { pgTable, uuid, text, timestamp, boolean, integer, numeric, index } from "drizzle-orm/pg-core";
import { companies, branches } from "./company";
import { products, warehouses } from "./inventory";
import { users } from "./auth";

/**
 * 7. PURCHASE & SUPPLIERS
 */

export const suppliers = pgTable("suppliers", {
  id: uuid("id").primaryKey().defaultRandom(),
  supplierCode: text("supplier_code").notNull().unique(), // e.g. 'SUP-001'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone").notNull(),
  gstin: text("gstin"),
  pan: text("pan"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  paymentTerms: text("payment_terms").default("Net 30"),
  rating: numeric("rating", { precision: 3, scale: 1 }).default("4.5"),
  status: text("status").default("Active").notNull(), // 'Active' | 'Inactive'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("suppliers_code_idx").on(table.supplierCode),
]);

export const purchaseOrders = pgTable("purchase_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  poNumber: text("po_number").notNull().unique(), // e.g. 'PO-2025-0081'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  supplierId: uuid("supplier_id").references(() => suppliers.id, { onDelete: "restrict" }).notNull(),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id, { onDelete: "restrict" }).notNull(),
  poDate: timestamp("po_date", { withTimezone: true }).notNull(),
  expectedDeliveryDate: timestamp("expected_delivery_date", { withTimezone: true }),
  taxableAmount: numeric("taxable_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  totalTax: numeric("total_tax", { precision: 14, scale: 2 }).default("0.00").notNull(),
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull(),
  status: text("status").default("Issued").notNull(), // 'Draft' | 'Issued' | 'Partially Received' | 'Received' | 'Cancelled'
  notes: text("notes"),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("po_number_idx").on(table.poNumber),
  index("po_supplier_idx").on(table.supplierId),
]);

export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  purchaseOrderId: uuid("purchase_order_id").references(() => purchaseOrders.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }).notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  receivedQuantity: integer("received_quantity").default(0).notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).default("12.00").notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
}, (table) => [
  index("po_items_po_idx").on(table.purchaseOrderId),
]);

export const goodsReceipts = pgTable("goods_receipts", {
  id: uuid("id").primaryKey().defaultRandom(),
  grnNumber: text("grn_number").notNull().unique(), // e.g. 'GRN-2025-0044'
  purchaseOrderId: uuid("purchase_order_id").references(() => purchaseOrders.id, { onDelete: "restrict" }),
  supplierId: uuid("supplier_id").references(() => suppliers.id, { onDelete: "restrict" }).notNull(),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id, { onDelete: "restrict" }).notNull(),
  receiptDate: timestamp("receipt_date", { withTimezone: true }).notNull(),
  deliveryNoteNumber: text("delivery_note_number"),
  status: text("status").default("Accepted").notNull(), // 'Accepted' | 'Inspection' | 'Rejected'
  receivedById: uuid("received_by_id").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("grn_number_idx").on(table.grnNumber),
]);

export const goodsReceiptItems = pgTable("goods_receipt_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  goodsReceiptId: uuid("goods_receipt_id").references(() => goodsReceipts.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }).notNull(),
  quantityReceived: integer("quantity_received").notNull(),
  quantityAccepted: integer("quantity_accepted").notNull(),
  quantityRejected: integer("quantity_rejected").default(0).notNull(),
  rejectionReason: text("rejection_reason"),
});

export const purchaseInvoices = pgTable("purchase_invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  purchaseInvoiceNumber: text("purchase_invoice_number").notNull().unique(),
  vendorBillNumber: text("vendor_bill_number").notNull(),
  supplierId: uuid("supplier_id").references(() => suppliers.id, { onDelete: "restrict" }).notNull(),
  purchaseOrderId: uuid("purchase_order_id").references(() => purchaseOrders.id, { onDelete: "set null" }),
  billDate: timestamp("bill_date", { withTimezone: true }).notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull(),
  paidAmount: numeric("paid_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  balanceAmount: numeric("balance_amount", { precision: 14, scale: 2 }).notNull(),
  status: text("status").default("Pending").notNull(), // 'Pending' | 'Paid' | 'Partially Paid'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("purchase_inv_num_idx").on(table.purchaseInvoiceNumber),
]);

export const purchaseInvoiceItems = pgTable("purchase_invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  purchaseInvoiceId: uuid("purchase_invoice_id").references(() => purchaseInvoices.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }).notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
});

export const supplierPayments = pgTable("supplier_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentNumber: text("payment_number").notNull().unique(),
  supplierId: uuid("supplier_id").references(() => suppliers.id, { onDelete: "restrict" }).notNull(),
  purchaseInvoiceId: uuid("purchase_invoice_id").references(() => purchaseInvoices.id, { onDelete: "set null" }),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date", { withTimezone: true }).notNull(),
  paymentMode: text("payment_mode").default("NEFT").notNull(),
  referenceNumber: text("reference_number"),
  paidById: uuid("paid_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const purchaseReturns = pgTable("purchase_returns", {
  id: uuid("id").primaryKey().defaultRandom(),
  returnNumber: text("return_number").notNull().unique(),
  supplierId: uuid("supplier_id").references(() => suppliers.id, { onDelete: "restrict" }).notNull(),
  purchaseOrderId: uuid("purchase_order_id").references(() => purchaseOrders.id, { onDelete: "set null" }),
  returnDate: timestamp("return_date", { withTimezone: true }).notNull(),
  reason: text("reason").notNull(),
  status: text("status").default("Pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const purchaseReturnItems = pgTable("purchase_return_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  purchaseReturnId: uuid("purchase_return_id").references(() => purchaseReturns.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
});
