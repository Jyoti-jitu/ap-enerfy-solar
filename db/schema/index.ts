/**
 * AP Enerfy Solar ERP & Billing Management Software
 * Central Schema Index & Domain Model Exports
 */

// 1. Company & Administration
export * from "./company";

// 2. Authentication & RBAC
export * from "./auth";

// 3. Customer Management
export * from "./customers";

// 4. Products & Inventory
export * from "./inventory";

// 5. Solar Packages, Quotations & Sales Orders
export * from "./solar";

// 6. Billing, Invoices & Payments
export * from "./billing";

// 7. Purchase & Suppliers
export * from "./purchases";

// 8. Solar Installation Projects
export * from "./projects";

// 9. Subsidy & Net Metering
export * from "./subsidy";

// 10. Accounting & Ledger
export * from "./accounting";

// 11. Service & Maintenance
export * from "./services";

// 12. System, Notifications, Audit & Storage
export * from "./system";

// 13. Drizzle ORM Entity Relationships
export * from "./relations";

// Backward-compatibility aliases for legacy code
import { companies } from "./company";
import { companiesRelations } from "./relations";
import { solarPackages } from "./solar";

export const organizations = companies;
export const organizationsRelations = companiesRelations;
export const solarPlans = solarPackages;
