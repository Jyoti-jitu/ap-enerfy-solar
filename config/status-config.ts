/**
 * Semantic status badge mappings and theme configurations
 * Maps ERP statuses to consistent background colors, text colors, borders, and icons.
 */

export interface StatusConfig {
  label: string;
  className: string;
  dotColor?: string;
}

export const STATUS_MAP: Record<string, StatusConfig> = {
  // Invoices & Billing
  paid: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
  },
  overdue: {
    label: "Overdue",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
  },
  draft: {
    label: "Draft",
    className: "bg-slate-100 text-slate-700 border-slate-200",
    dotColor: "bg-slate-400",
  },
  finalized: {
    label: "Finalized",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-500 border-slate-200",
    dotColor: "bg-slate-400",
  },

  // Quotations & Proposals
  accepted: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  sent: {
    label: "Sent",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  revision: {
    label: "Revision",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    dotColor: "bg-purple-500",
  },
  lost: {
    label: "Lost",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
  },
  declined: {
    label: "Declined",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
  },

  // Projects & Solar Installations
  "in progress": {
    label: "In Progress",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
  },
  installation: {
    label: "Installation",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  upcoming: {
    label: "Upcoming",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotColor: "bg-indigo-500",
  },
  "material dispatch": {
    label: "Material Dispatch",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotColor: "bg-indigo-500",
  },
  "survey done": {
    label: "Survey Done",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    dotColor: "bg-purple-500",
  },
  "quotation sent": {
    label: "Quotation Sent",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
  },
  delayed: {
    label: "Delayed",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
  },
  "on hold": {
    label: "On Hold",
    className: "bg-slate-100 text-slate-600 border-slate-200",
    dotColor: "bg-slate-400",
  },

  // Inventory & Stock
  "in stock": {
    label: "In Stock",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  "low stock": {
    label: "Low Stock",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
  },
  "out of stock": {
    label: "Out of Stock",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
  },

  // Payments
  received: {
    label: "Received",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  cleared: {
    label: "Cleared",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  advance: {
    label: "Advance",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  installment: {
    label: "Installment",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  "full payment": {
    label: "Full Payment",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    dotColor: "bg-purple-500",
  },

  // Employees & Users
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  inactive: {
    label: "Inactive",
    className: "bg-slate-100 text-slate-600 border-slate-200",
    dotColor: "bg-slate-400",
  },
  suspended: {
    label: "Suspended",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
  },

  // Solar System Types
  "on-grid": {
    label: "On-Grid",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  hybrid: {
    label: "Hybrid",
    className: "bg-blue-50 text-blue-800 border-blue-200",
    dotColor: "bg-blue-500",
  },
  "off-grid": {
    label: "Off-Grid",
    className: "bg-purple-50 text-purple-800 border-purple-200",
    dotColor: "bg-purple-500",
  },

  // Customer Types
  residential: {
    label: "Residential",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  commercial: {
    label: "Commercial",
    className: "bg-purple-50 text-purple-800 border-purple-200",
    dotColor: "bg-purple-500",
  },
  agricultural: {
    label: "Agricultural",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  industrial: {
    label: "Industrial",
    className: "bg-blue-50 text-blue-800 border-blue-200",
    dotColor: "bg-blue-500",
  },
};

export function getStatusConfig(status: string | null | undefined): StatusConfig {
  if (!status) {
    return {
      label: "Unknown",
      className: "bg-slate-100 text-slate-600 border-slate-200",
      dotColor: "bg-slate-400",
    };
  }

  const key = status.trim().toLowerCase();
  return (
    STATUS_MAP[key] || {
      label: status,
      className: "bg-slate-100 text-slate-700 border-slate-200",
      dotColor: "bg-slate-400",
    }
  );
}
