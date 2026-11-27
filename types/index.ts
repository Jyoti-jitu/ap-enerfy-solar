export type UserRole =
  | "admin"
  | "project_manager"
  | "accountant"
  | "sales_executive"
  | "field_engineer";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string;
  branchName?: string;
}

export type CustomerType = "residential" | "commercial" | "agricultural" | "industrial";

export type ProjectStatus =
  | "survey_done"
  | "quotation_sent"
  | "material_dispatch"
  | "installation"
  | "in_progress"
  | "completed"
  | "on_hold";

export type SystemType = "On-Grid" | "Hybrid" | "Off-Grid";

export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Partially Paid" | "Cancelled";

export type PaymentStatus = "Received" | "Cleared" | "Pending" | "Bounced" | "Refunded";

export type QuotationStatus = "Draft" | "Sent" | "Accepted" | "Pending" | "Revision" | "Lost";

export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface KPICardData {
  title: string;
  value: string;
  subtext?: string;
  subtextColor?: "emerald" | "blue" | "amber" | "rose" | "neutral";
  change?: string;
  isPositive?: boolean;
  theme: "green" | "blue" | "yellow" | "purple" | "rose";
  iconName: string;
}
