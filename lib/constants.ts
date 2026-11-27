export const SYSTEM_TYPES = ["On-Grid", "Hybrid", "Off-Grid"] as const;

export const CUSTOMER_TYPES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "agricultural", label: "Agricultural" },
  { value: "industrial", label: "Industrial" },
] as const;

export const PROJECT_STATUSES = [
  { value: "survey_done", label: "Survey Done", color: "purple" },
  { value: "quotation_sent", label: "Quotation Sent", color: "amber" },
  { value: "material_dispatch", label: "Material Dispatch", color: "blue" },
  { value: "installation", label: "Installation", color: "amber" },
  { value: "in_progress", label: "In Progress", color: "sky" },
  { value: "completed", label: "Completed", color: "emerald" },
  { value: "on_hold", label: "On Hold", color: "rose" },
] as const;

export const PRODUCT_CATEGORIES = [
  "Solar Panel",
  "Inverter",
  "Battery",
  "Structure",
  "Cable & Accessories",
  "Protection (ACDB)",
  "Protection (DCDB)",
  "Accessories",
] as const;

export const PRODUCT_BRANDS = [
  "Waaree",
  "Growatt",
  "Livguard",
  "AP Enerfy",
  "Polycab",
  "Havells",
  "Stäubli",
  "Luminous",
  "Tata Solar",
  "Microtek",
] as const;

export const PAYMENT_MODES = [
  "UPI",
  "Bank Transfer",
  "NEFT",
  "RTGS",
  "Cheque",
  "Cash",
] as const;

export const PAYMENT_TYPES = [
  "Advance",
  "Installment",
  "Full Payment",
  "Subsidy Settlement",
] as const;

export const INVOICE_TYPES = [
  "Tax Invoice",
  "Proforma Invoice",
  "Delivery Challan",
  "Credit Note",
  "Debit Note",
] as const;

export const LOCATIONS = [
  "Bhubaneswar",
  "Cuttack",
  "Puri",
  "Khordha",
  "Jajpur",
  "Rourkela",
  "Sambalpur",
  "Balasore",
] as const;
