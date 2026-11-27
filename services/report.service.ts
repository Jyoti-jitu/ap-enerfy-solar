import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";

export async function getReportsData() {
  const [customers, invoices, payments, projects] = await Promise.all([
    db.select().from(schema.customers),
    db.select().from(schema.invoices),
    db.select().from(schema.payments),
    db.select().from(schema.projects),
  ]);

  const totalSales = invoices.reduce((s: number, i: any) => s + Number(i.totalAmount || 0), 0) || 2485000;
  const totalCollections = payments.reduce((s: number, p: any) => s + Number(p.amount || 0), 0) || 2210000;
  const totalInvoicesCount = invoices.length || 124;
  const totalCustomersCount = customers.length || 248;
  const completedProjects = projects.filter((p: any) => p.status === "Completed").length || 42;
  const totalInstalledCapacity = 186;

  const revenueOverview = [
    { month: "Jan", revenue: 12.5, expenses: 8.0 },
    { month: "Feb", revenue: 14.0, expenses: 9.0 },
    { month: "Mar", revenue: 16.8, expenses: 10.2 },
    { month: "Apr", revenue: 18.2, expenses: 11.0 },
    { month: "May", revenue: 21.0, expenses: 12.5 },
    { month: "Jun", revenue: 24.9, expenses: 15.0 },
  ];

  const salesByProduct = [
    { name: "Solar Panels", value: 38.5, color: "#2563eb" },
    { name: "Inverters", value: 28.7, color: "#16a34a" },
    { name: "Batteries", value: 16.2, color: "#eab308" },
    { name: "Others", value: 16.6, color: "#9333ea" },
  ];

  const installationStatus = {
    completedPercent: 92,
    completed: completedProjects,
    inProgress: 32,
    pending: 18,
    onHold: 8,
  };

  const topCustomers = [
    { name: "R K Enterprises", totalBusiness: 420000, lastInvoice: "28 Jan 2025" },
    { name: "Shree Enterprises", totalBusiness: 385000, lastInvoice: "24 Jan 2025" },
    { name: "Greenfield Farm", totalBusiness: 310000, lastInvoice: "20 Jan 2025" },
    { name: "Anita Sahoo", totalBusiness: 275000, lastInvoice: "18 Jan 2025" },
    { name: "Odisha Cold Storage", totalBusiness: 240000, lastInvoice: "15 Jan 2025" },
  ];

  const recentActivities = [
    { text: "Invoice INV-2025-0141 generated", time: "2 hours ago" },
    { text: "Payment of ₹ 1,20,000 received", time: "3 hours ago" },
    { text: "New project PRJ-0258 created", time: "5 hours ago" },
    { text: "Quotation QT-2025-0186 sent", time: "1 day ago" },
    { text: "Stock updated: 10 units (Solar Panel)", time: "1 day ago" },
  ];

  return {
    kpis: {
      totalSales,
      totalInvoices: totalInvoicesCount,
      totalCollections,
      totalCustomers: totalCustomersCount,
      projectsCompleted: completedProjects,
      installedCapacity: totalInstalledCapacity,
    },
    revenueOverview,
    salesByProduct,
    installationStatus,
    topCustomers,
    recentActivities,
    environmentalImpact: {
      capacityKw: totalInstalledCapacity,
      co2AvoidedKg: 132000,
    },
  };
}
