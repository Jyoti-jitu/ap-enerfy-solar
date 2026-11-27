import { relations } from "drizzle-orm";
import { companies, branches, companySettings, financialYears, documentSequences } from "./company";
import { users, roles, permissions, rolePermissions, userRoles, userBranches, sessions, passwordResetTokens } from "./auth";
import { customers, customerAddresses, customerDocuments, leads, leadFollowUps, siteSurveys } from "./customers";
import { productCategories, brands, taxRates, warehouses, products, stockLevels, stockMovements, stockReservations, productSerials } from "./inventory";
import { solarPackages, solarPackageItems, quotations, quotationItems, quotationRevisions, salesOrders, salesOrderItems } from "./solar";
import { invoices, invoiceItems, payments, paymentAllocations, paymentSchedules, creditNotes, creditNoteItems, debitNotes, debitNoteItems, refunds, deliveryChallans, deliveryChallanItems } from "./billing";
import { suppliers, purchaseOrders, purchaseOrderItems, goodsReceipts, goodsReceiptItems, purchaseInvoices, purchaseInvoiceItems, supplierPayments, purchaseReturns, purchaseReturnItems } from "./purchases";
import { projects, projectMilestones, projectTasks, projectMembers, projectMaterials, projectDocuments, projectActivities } from "./projects";
import { subsidyApplications, subsidyStatusHistory, netMeteringApplications } from "./subsidy";
import { accounts, journalEntries, journalLines, expenseCategories, expenses, bankAccounts } from "./accounting";
import { warranties, warrantyClaims, serviceTickets, serviceVisits, amcContracts, maintenanceSchedules } from "./services";
import { employees, notifications, notificationPreferences, auditLogs, fileAttachments } from "./system";

// 1. Company Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  branches: many(branches),
  users: many(users),
  financialYears: many(financialYears),
  settings: many(companySettings),
  customers: many(customers),
  projects: many(projects),
  invoices: many(invoices),
  products: many(products),
  warehouses: many(warehouses),
}));

export const branchesRelations = relations(branches, ({ one, many }) => ({
  company: one(companies, { fields: [branches.companyId], references: [companies.id] }),
  users: many(users),
  customers: many(customers),
  projects: many(projects),
  invoices: many(invoices),
  warehouses: many(warehouses),
  employees: many(employees),
}));

export const financialYearsRelations = relations(financialYears, ({ one, many }) => ({
  company: one(companies, { fields: [financialYears.companyId], references: [companies.id] }),
  documentSequences: many(documentSequences),
}));

// 2. Auth Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, { fields: [users.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [users.branchId], references: [branches.id] }),
  userRoles: many(userRoles),
  userBranches: many(userBranches),
  sessions: many(sessions),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  assignedProjects: many(projects, { relationName: "engineerProjects" }),
  assignedTickets: many(serviceTickets, { relationName: "technicianTickets" }),
}));

export const userBranchesRelations = relations(userBranches, ({ one }) => ({
  user: one(users, { fields: [userBranches.userId], references: [users.id] }),
  branch: one(branches, { fields: [userBranches.branchId], references: [branches.id] }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, { fields: [rolePermissions.permissionId], references: [permissions.id] }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, { fields: [passwordResetTokens.userId], references: [users.id] }),
}));

// 3. Customer Relations
export const customersRelations = relations(customers, ({ one, many }) => ({
  company: one(companies, { fields: [customers.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [customers.branchId], references: [branches.id] }),
  addresses: many(customerAddresses),
  documents: many(customerDocuments),
  quotations: many(quotations),
  salesOrders: many(salesOrders),
  invoices: many(invoices),
  payments: many(payments),
  projects: many(projects),
  subsidyApplications: many(subsidyApplications),
  netMeteringApplications: many(netMeteringApplications),
  serviceTickets: many(serviceTickets),
  warranties: many(warranties),
  amcContracts: many(amcContracts),
}));

export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
  customer: one(customers, { fields: [customerAddresses.customerId], references: [customers.id] }),
}));

export const customerDocumentsRelations = relations(customerDocuments, ({ one }) => ({
  customer: one(customers, { fields: [customerDocuments.customerId], references: [customers.id] }),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  company: one(companies, { fields: [leads.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [leads.branchId], references: [branches.id] }),
  assignedTo: one(users, { fields: [leads.assignedToId], references: [users.id] }),
  followUps: many(leadFollowUps),
  surveys: many(siteSurveys),
  quotations: many(quotations),
}));

export const leadFollowUpsRelations = relations(leadFollowUps, ({ one }) => ({
  lead: one(leads, { fields: [leadFollowUps.leadId], references: [leads.id] }),
  performedBy: one(users, { fields: [leadFollowUps.performedById], references: [users.id] }),
}));

export const siteSurveysRelations = relations(siteSurveys, ({ one }) => ({
  lead: one(leads, { fields: [siteSurveys.leadId], references: [leads.id] }),
  customer: one(customers, { fields: [siteSurveys.customerId], references: [customers.id] }),
  assignedTo: one(users, { fields: [siteSurveys.assignedToId], references: [users.id] }),
}));

// 4. Inventory Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, { fields: [products.categoryId], references: [productCategories.id] }),
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  taxRate: one(taxRates, { fields: [products.taxRateId], references: [taxRates.id] }),
  stockLevels: many(stockLevels),
  stockMovements: many(stockMovements),
  serials: many(productSerials),
}));

export const warehousesRelations = relations(warehouses, ({ one, many }) => ({
  company: one(companies, { fields: [warehouses.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [warehouses.branchId], references: [branches.id] }),
  stockLevels: many(stockLevels),
  stockMovements: many(stockMovements),
}));

export const stockLevelsRelations = relations(stockLevels, ({ one }) => ({
  product: one(products, { fields: [stockLevels.productId], references: [products.id] }),
  warehouse: one(warehouses, { fields: [stockLevels.warehouseId], references: [warehouses.id] }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, { fields: [stockMovements.productId], references: [products.id] }),
  warehouse: one(warehouses, { fields: [stockMovements.warehouseId], references: [warehouses.id] }),
  performedBy: one(users, { fields: [stockMovements.performedById], references: [users.id] }),
}));

// 5. Solar & Quotation Relations
export const solarPackagesRelations = relations(solarPackages, ({ many }) => ({
  items: many(solarPackageItems),
  quotations: many(quotations),
}));

export const solarPackageItemsRelations = relations(solarPackageItems, ({ one }) => ({
  package: one(solarPackages, { fields: [solarPackageItems.packageId], references: [solarPackages.id] }),
  product: one(products, { fields: [solarPackageItems.productId], references: [products.id] }),
}));

export const quotationsRelations = relations(quotations, ({ one, many }) => ({
  company: one(companies, { fields: [quotations.companyId], references: [companies.id] }),
  customer: one(customers, { fields: [quotations.customerId], references: [customers.id] }),
  lead: one(leads, { fields: [quotations.leadId], references: [leads.id] }),
  solarPackage: one(solarPackages, { fields: [quotations.solarPackageId], references: [solarPackages.id] }),
  items: many(quotationItems),
  revisions: many(quotationRevisions),
  salesOrders: many(salesOrders),
}));

export const quotationItemsRelations = relations(quotationItems, ({ one }) => ({
  quotation: one(quotations, { fields: [quotationItems.quotationId], references: [quotations.id] }),
  product: one(products, { fields: [quotationItems.productId], references: [products.id] }),
}));

export const salesOrdersRelations = relations(salesOrders, ({ one, many }) => ({
  customer: one(customers, { fields: [salesOrders.customerId], references: [customers.id] }),
  quotation: one(quotations, { fields: [salesOrders.quotationId], references: [quotations.id] }),
  items: many(salesOrderItems),
  invoices: many(invoices),
  projects: many(projects),
}));

export const salesOrderItemsRelations = relations(salesOrderItems, ({ one }) => ({
  salesOrder: one(salesOrders, { fields: [salesOrderItems.salesOrderId], references: [salesOrders.id] }),
  product: one(products, { fields: [salesOrderItems.productId], references: [products.id] }),
}));

// 6. Billing Relations
export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  company: one(companies, { fields: [invoices.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [invoices.branchId], references: [branches.id] }),
  customer: one(customers, { fields: [invoices.customerId], references: [customers.id] }),
  project: one(projects, { fields: [invoices.projectId], references: [projects.id] }),
  salesOrder: one(salesOrders, { fields: [invoices.salesOrderId], references: [salesOrders.id] }),
  items: many(invoiceItems),
  payments: many(payments),
  paymentAllocations: many(paymentAllocations),
  creditNotes: many(creditNotes),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, { fields: [invoiceItems.invoiceId], references: [invoices.id] }),
  product: one(products, { fields: [invoiceItems.productId], references: [products.id] }),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  customer: one(customers, { fields: [payments.customerId], references: [customers.id] }),
  invoice: one(invoices, { fields: [payments.invoiceId], references: [invoices.id] }),
  project: one(projects, { fields: [payments.projectId], references: [projects.id] }),
  allocations: many(paymentAllocations),
  refunds: many(refunds),
}));

export const paymentAllocationsRelations = relations(paymentAllocations, ({ one }) => ({
  payment: one(payments, { fields: [paymentAllocations.paymentId], references: [payments.id] }),
  invoice: one(invoices, { fields: [paymentAllocations.invoiceId], references: [invoices.id] }),
}));

// 7. Purchase Relations
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  purchaseOrders: many(purchaseOrders),
  purchaseInvoices: many(purchaseInvoices),
  goodsReceipts: many(goodsReceipts),
}));

export const purchaseOrdersRelations = relations(purchaseOrders, ({ one, many }) => ({
  supplier: one(suppliers, { fields: [purchaseOrders.supplierId], references: [suppliers.id] }),
  warehouse: one(warehouses, { fields: [purchaseOrders.warehouseId], references: [warehouses.id] }),
  items: many(purchaseOrderItems),
  goodsReceipts: many(goodsReceipts),
  purchaseInvoices: many(purchaseInvoices),
}));

export const purchaseOrderItemsRelations = relations(purchaseOrderItems, ({ one }) => ({
  purchaseOrder: one(purchaseOrders, { fields: [purchaseOrderItems.purchaseOrderId], references: [purchaseOrders.id] }),
  product: one(products, { fields: [purchaseOrderItems.productId], references: [products.id] }),
}));

// 8. Projects Relations
export const projectsRelations = relations(projects, ({ one, many }) => ({
  company: one(companies, { fields: [projects.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [projects.branchId], references: [branches.id] }),
  customer: one(customers, { fields: [projects.customerId], references: [customers.id] }),
  quotation: one(quotations, { fields: [projects.quotationId], references: [quotations.id] }),
  assignedEngineer: one(users, { fields: [projects.assignedEngineerId], references: [users.id], relationName: "engineerProjects" }),
  milestones: many(projectMilestones),
  tasks: many(projectTasks),
  members: many(projectMembers),
  materials: many(projectMaterials),
  documents: many(projectDocuments),
  activities: many(projectActivities),
  invoices: many(invoices),
  payments: many(payments),
  expenses: many(expenses),
  subsidyApplications: many(subsidyApplications),
  netMeteringApplications: many(netMeteringApplications),
  warranties: many(warranties),
  serviceTickets: many(serviceTickets),
}));

export const projectMilestonesRelations = relations(projectMilestones, ({ one, many }) => ({
  project: one(projects, { fields: [projectMilestones.projectId], references: [projects.id] }),
  tasks: many(projectTasks),
}));

export const projectTasksRelations = relations(projectTasks, ({ one }) => ({
  project: one(projects, { fields: [projectTasks.projectId], references: [projects.id] }),
  milestone: one(projectMilestones, { fields: [projectTasks.milestoneId], references: [projectMilestones.id] }),
  assignedTo: one(users, { fields: [projectTasks.assignedToId], references: [users.id] }),
}));

export const projectMaterialsRelations = relations(projectMaterials, ({ one }) => ({
  project: one(projects, { fields: [projectMaterials.projectId], references: [projects.id] }),
  product: one(products, { fields: [projectMaterials.productId], references: [products.id] }),
}));

// 9. Accounting Relations
export const accountsRelations = relations(accounts, ({ many }) => ({
  journalLines: many(journalLines),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one, many }) => ({
  company: one(companies, { fields: [journalEntries.companyId], references: [companies.id] }),
  lines: many(journalLines),
  postedBy: one(users, { fields: [journalEntries.postedById], references: [users.id] }),
}));

export const journalLinesRelations = relations(journalLines, ({ one }) => ({
  entry: one(journalEntries, { fields: [journalLines.journalEntryId], references: [journalEntries.id] }),
  account: one(accounts, { fields: [journalLines.accountId], references: [accounts.id] }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  category: one(expenseCategories, { fields: [expenses.categoryId], references: [expenseCategories.id] }),
  project: one(projects, { fields: [expenses.projectId], references: [projects.id] }),
  recordedBy: one(users, { fields: [expenses.recordedById], references: [users.id] }),
}));

// 10. Service Relations
export const serviceTicketsRelations = relations(serviceTickets, ({ one, many }) => ({
  customer: one(customers, { fields: [serviceTickets.customerId], references: [customers.id] }),
  project: one(projects, { fields: [serviceTickets.projectId], references: [projects.id] }),
  assignedTechnician: one(users, { fields: [serviceTickets.assignedTechnicianId], references: [users.id], relationName: "technicianTickets" }),
  visits: many(serviceVisits),
}));

export const serviceVisitsRelations = relations(serviceVisits, ({ one }) => ({
  ticket: one(serviceTickets, { fields: [serviceVisits.ticketId], references: [serviceTickets.id] }),
  technician: one(users, { fields: [serviceVisits.technicianId], references: [users.id] }),
}));

export const warrantiesRelations = relations(warranties, ({ one, many }) => ({
  customer: one(customers, { fields: [warranties.customerId], references: [customers.id] }),
  project: one(projects, { fields: [warranties.projectId], references: [projects.id] }),
  claims: many(warrantyClaims),
}));

export const amcContractsRelations = relations(amcContracts, ({ one, many }) => ({
  customer: one(customers, { fields: [amcContracts.customerId], references: [customers.id] }),
  project: one(projects, { fields: [amcContracts.projectId], references: [projects.id] }),
  schedules: many(maintenanceSchedules),
}));

// 11. System Relations
export const employeesRelations = relations(employees, ({ one }) => ({
  company: one(companies, { fields: [employees.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [employees.branchId], references: [branches.id] }),
  user: one(users, { fields: [employees.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));
