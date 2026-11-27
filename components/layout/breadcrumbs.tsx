"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

// Human-readable route segment mappings
const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  customers: "Customers",
  leads: "Leads & Enquiries",
  quotations: "Quotations & Plans",
  "solar-packages": "Solar Packages",
  "sales-orders": "Sales Orders",
  invoices: "Invoices & Billing",
  payments: "Payments & Collections",
  expenses: "Expenses",
  products: "Products & Inventory",
  warehouses: "Warehouses",
  purchases: "Purchase Orders",
  suppliers: "Suppliers",
  projects: "Projects / Installations",
  "solar-calculator": "Solar Calculator",
  services: "Service & Maintenance",
  warranties: "Warranty & AMC",
  reports: "Reports & Analytics",
  employees: "Employees",
  settings: "Settings",
  roles: "Roles & Permissions",
  "audit-logs": "Activity Logs",
  profile: "My Profile",
  security: "Security Settings",
  new: "Create New",
  edit: "Edit",
};

export function Breadcrumbs({
  customLabels,
}: {
  customLabels?: Record<string, string>;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0 || pathname === "/dashboard") {
    return (
      <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
        <Home className="w-3.5 h-3.5 text-emerald-600" />
        <span className="font-semibold text-slate-800">Dashboard</span>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
      <Link
        href="/dashboard"
        className="hover:text-emerald-700 transition-colors flex items-center gap-1"
        title="Dashboard"
      >
        <Home className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600" />
      </Link>

      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const label =
          customLabels?.[segment] ||
          ROUTE_LABELS[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-800 truncate max-w-[200px]" aria-current="page">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-emerald-700 transition-colors truncate max-w-[150px]"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
