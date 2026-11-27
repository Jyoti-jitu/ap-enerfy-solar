"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Command,
  FileText,
  Users,
  HardHat,
  Receipt,
  Package,
  ArrowRight,
  Sparkles,
  Compass,
  CreditCard,
  Settings,
  HelpCircle,
  X,
} from "lucide-react";
import { usePermissions } from "@/components/shared/PermissionGuard";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";

interface SearchEntry {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Customers" | "Invoices" | "Projects" | "Products" | "Actions";
  href: string;
  icon: any;
  permission?: string;
}

const STATIC_ENTRIES: SearchEntry[] = [
  // Navigation
  { id: "p-dash", title: "Dashboard Overview", subtitle: "KPIs and daily operations", category: "Navigation", href: "/dashboard", icon: Compass, permission: "dashboard.view" },
  { id: "p-cust", title: "Customers Directory", subtitle: "Rooftop and ground-mount consumers", category: "Navigation", href: "/customers", icon: Users, permission: "customers.view" },
  { id: "p-leads", title: "Leads & Enquiries", subtitle: "Sales pipeline & solar surveys", category: "Navigation", href: "/leads", icon: Compass, permission: "leads.view" },
  { id: "p-quot", title: "Quotations & Plans", subtitle: "System sizing & subsidy proposals", category: "Navigation", href: "/quotations", icon: FileText, permission: "quotations.view" },
  { id: "p-inv", title: "Invoices & Billing", subtitle: "GST tax invoices & delivery challans", category: "Navigation", href: "/invoices", icon: Receipt, permission: "invoices.view" },
  { id: "p-pay", title: "Payments & Collections", subtitle: "Installments, UPI receipts & advances", category: "Navigation", href: "/payments", icon: CreditCard, permission: "payments.view" },
  { id: "p-prod", title: "Products & Inventory", subtitle: "Panels, inverters, cables & stock", category: "Navigation", href: "/products", icon: Package, permission: "inventory.view" },
  { id: "p-proj", title: "Projects / Installations", subtitle: "Site milestones & net metering", category: "Navigation", href: "/projects", icon: HardHat, permission: "projects.view" },
  { id: "p-rep", title: "Reports & Analytics", subtitle: "Revenue trends & P&L statements", category: "Navigation", href: "/reports", icon: Sparkles, permission: "reports.view" },
  { id: "p-set", title: "Company Settings", subtitle: "Organization & branch config", category: "Navigation", href: "/settings", icon: Settings, permission: "settings.view" },

  // Customers (From Reference Screenshots)
  { id: "c-1", title: "Rajesh Patil", subtitle: "CUST-0258 · 3 kW On-Grid · Bhubaneswar", category: "Customers", href: "/customers", icon: Users, permission: "customers.view" },
  { id: "c-2", title: "Shree Enterprises", subtitle: "CUST-0257 · 10 kW Hybrid · Cuttack", category: "Customers", href: "/customers", icon: Users, permission: "customers.view" },
  { id: "c-3", title: "Mehta Residence", subtitle: "CUST-0256 · 5 kW On-Grid · Puri", category: "Customers", href: "/customers", icon: Users, permission: "customers.view" },
  { id: "c-4", title: "Greenfield Farm", subtitle: "CUST-0255 · 15 kW Off-Grid · Khordha", category: "Customers", href: "/customers", icon: Users, permission: "customers.view" },
  { id: "c-5", title: "Patel Industries", subtitle: "CUST-0254 · 25 kW On-Grid · Bhubaneswar", category: "Customers", href: "/customers", icon: Users, permission: "customers.view" },

  // Invoices (From Reference Screenshots)
  { id: "i-1", title: "INV-2025-0145", subtitle: "Rajesh Patil · ₹ 1,20,000 · Paid", category: "Invoices", href: "/invoices", icon: Receipt, permission: "invoices.view" },
  { id: "i-2", title: "INV-2025-0144", subtitle: "Shree Enterprises · ₹ 3,50,000 · Pending", category: "Invoices", href: "/invoices", icon: Receipt, permission: "invoices.view" },
  { id: "i-3", title: "INV-2025-0143", subtitle: "Mehta Residence · ₹ 2,75,000 · Paid", category: "Invoices", href: "/invoices", icon: Receipt, permission: "invoices.view" },
  { id: "i-4", title: "INV-2025-0142", subtitle: "Greenfield Farm · ₹ 4,20,000 · Overdue", category: "Invoices", href: "/invoices", icon: Receipt, permission: "invoices.view" },

  // Projects (From Reference Screenshots)
  { id: "pr-1", title: "PRJ-0258", subtitle: "Rajesh Patil · 3 kW On-Grid · Completed (100%)", category: "Projects", href: "/projects", icon: HardHat, permission: "projects.view" },
  { id: "pr-2", title: "PRJ-0257", subtitle: "Shree Enterprises · 10 kW Hybrid · In Progress (65%)", category: "Projects", href: "/projects", icon: HardHat, permission: "projects.view" },

  // Products (From Reference Screenshots)
  { id: "pd-1", title: "SOL-PNL-550", subtitle: "Solar Panel 550W Mono PERC · Waaree · ₹ 8,500", category: "Products", href: "/products", icon: Package, permission: "inventory.view" },
  { id: "pd-2", title: "SOL-INV-5K", subtitle: "Hybrid Inverter 5 kW · Growatt · ₹ 78,000", category: "Products", href: "/products", icon: Package, permission: "inventory.view" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { hasPermission, isSuperAdmin } = usePermissions();

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  // Filter entries based on RBAC and query
  const filtered = STATIC_ENTRIES.filter((entry) => {
    if (entry.permission && !isSuperAdmin && !hasPermission(entry.permission)) {
      return false;
    }
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.subtitle?.toLowerCase().includes(q) ||
      entry.category.toLowerCase().includes(q)
    );
  });

  // Group filtered results
  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchEntry[]>);

  return (
    <>
      {/* Header Search Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full max-w-sm lg:max-w-md h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-500 hover:text-slate-800 text-xs flex items-center justify-between transition-all shadow-xs group focus:outline-none focus:ring-1 focus:ring-emerald-500"
      >
        <div className="flex items-center gap-2 truncate">
          <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          <span className="truncate">Search customers, invoices, projects...</span>
        </div>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Accessible Command Palette Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in" />
          <Dialog.Content className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-slate-200">
              <Search className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search customers, invoices, projects, products..."
                autoFocus
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100">
              {Object.keys(grouped).length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No matching records found for "{query}".
                </div>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="py-2 first:pt-0 last:pb-0">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {category}
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelect(item.href)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs hover:bg-emerald-50 hover:text-emerald-900 transition-colors group focus:outline-none"
                          >
                            <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-800 group-hover:text-emerald-900 truncate">
                                {item.title}
                              </p>
                              {item.subtitle && (
                                <p className="text-[11px] text-slate-400 truncate">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Navigation Tip */}
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px] text-slate-400">
              <span>Press <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded">ESC</kbd> to close</span>
              <span>AP Enerfy Solar Global Index</span>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
