import { pgTable, uuid, text, timestamp, boolean, integer, numeric, index } from "drizzle-orm/pg-core";
import { companies, branches } from "./company";
import { projects } from "./projects";
import { users } from "./auth";

/**
 * 10. ACCOUNTING & GENERAL LEDGER
 * Double-entry ledger, chart of accounts, expenses, and bank accounts.
 */

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  accountCode: text("account_code").notNull().unique(), // e.g. '1001', '2001', '4001'
  accountName: text("account_name").notNull(), // 'Accounts Receivable', 'Cash & Bank', 'Solar Equipment Sales', 'GST Output SGST'
  accountType: text("account_type").notNull(), // 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'
  currency: text("currency").default("INR").notNull(),
  currentBalance: numeric("current_balance", { precision: 14, scale: 2 }).default("0.00").notNull(),
  isSystem: boolean("is_system").default(true).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("accounts_code_idx").on(table.accountCode),
  index("accounts_type_idx").on(table.accountType),
]);

export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  entryNumber: text("entry_number").notNull().unique(), // e.g. 'JRN-2025-0091'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  entryDate: timestamp("entry_date", { withTimezone: true }).notNull(),
  referenceType: text("reference_type"), // 'SALES_INVOICE' | 'CUSTOMER_PAYMENT' | 'PURCHASE_INVOICE' | 'SUPPLIER_PAYMENT' | 'EXPENSE' | 'MANUAL'
  referenceId: text("reference_id"),
  narration: text("narration").notNull(),
  totalDebit: numeric("total_debit", { precision: 14, scale: 2 }).notNull(),
  totalCredit: numeric("total_credit", { precision: 14, scale: 2 }).notNull(),
  isBalanced: boolean("is_balanced").default(true).notNull(),
  postedById: uuid("posted_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("journal_num_idx").on(table.entryNumber),
  index("journal_date_idx").on(table.entryDate),
]);

export const journalLines = pgTable("journal_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  journalEntryId: uuid("journal_entry_id").references(() => journalEntries.id, { onDelete: "cascade" }).notNull(),
  accountId: uuid("account_id").references(() => accounts.id, { onDelete: "restrict" }).notNull(),
  debitAmount: numeric("debit_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  creditAmount: numeric("credit_amount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  description: text("description"),
}, (table) => [
  index("journal_lines_entry_idx").on(table.journalEntryId),
  index("journal_lines_account_idx").on(table.accountId),
]);

export const expenseCategories = pgTable("expense_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // 'Site Survey & Travel', 'Structure Transportation', 'Labour & Installation', 'Safety Gear', 'Office Rent'
  code: text("code").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  expenseNumber: text("expense_number").notNull().unique(), // e.g. 'EXP-2025-0062'
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  categoryId: uuid("category_id").references(() => expenseCategories.id),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  expenseDate: timestamp("expense_date", { withTimezone: true }).notNull(),
  paymentMode: text("payment_mode").default("UPI").notNull(),
  paidTo: text("paid_to"),
  receiptUrl: text("receipt_url"),
  status: text("status").default("Approved").notNull(), // 'Pending' | 'Approved' | 'Rejected'
  recordedById: uuid("recorded_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("expenses_num_idx").on(table.expenseNumber),
  index("expenses_category_idx").on(table.categoryId),
  index("expenses_project_idx").on(table.projectId),
]);

export const bankAccounts = pgTable("bank_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  bankName: text("bank_name").notNull(), // e.g. 'State Bank of India', 'HDFC Bank'
  accountName: text("account_name").notNull(), // 'AP Enerfy Solar Pvt Ltd - Current'
  accountNumber: text("account_number").notNull(),
  ifscCode: text("ifsc_code").notNull(),
  branchName: text("branch_name"),
  currentBalance: numeric("current_balance", { precision: 14, scale: 2 }).default("0.00").notNull(),
  isPrimary: boolean("is_primary").default(true).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
