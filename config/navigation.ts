import {
  LayoutDashboard,
  Users,
  HardHat,
  FileText,
  Receipt,
  Package,
  Calculator,
  BarChart3,
  Wrench,
  UserCog,
  Settings,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  badge?: string | number;
  exactMatch?: boolean;
  children?: NavItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * Global centralized navigation configuration for AP Enerfy Solar ERP.
 * Sequence:
 * 1. Dashboard
 * 2. Customers
 * 3. Projects / Installations
 * 4. Quotations & Plans
 * 5. Invoices & Billing
 * 6. Products & Inventory
 * 7. Solar Calculator
 * 8. Reports & Analytics
 * 9. Service & Maintenance
 * 10. Settings
 */
export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    label: "MAIN",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard.view",
        exactMatch: true,
      },
      {
        title: "Customers",
        href: "/customers",
        icon: Users,
        permission: "customers.view",
      },
      {
        title: "Projects / Installations",
        href: "/projects",
        icon: HardHat,
        permission: "projects.view",
      },
      {
        title: "Quotations & Plans",
        href: "/quotations",
        icon: FileText,
        permission: "quotations.view",
      },
      {
        title: "Invoices & Billing",
        href: "/invoices",
        icon: Receipt,
        permission: "invoices.view",
      },
      {
        title: "Products & Inventory",
        href: "/products",
        icon: Package,
        permission: "inventory.view",
      },
      {
        title: "Solar Calculator",
        href: "/solar-calculator",
        icon: Calculator,
        permission: "quotations.view",
      },
      {
        title: "Reports & Analytics",
        href: "/reports",
        icon: BarChart3,
        permission: "reports.view",
      },
      {
        title: "Service & Maintenance",
        href: "/services",
        icon: Wrench,
        permission: "services.view",
      },
      {
        title: "Employees",
        href: "/employees",
        icon: UserCog,
        permission: "employees.view",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        permission: "settings.view",
      },
    ],
  },
];
