import React from "react";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { EmployeesClient } from "./employees-client";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const users = await db.query.users.findMany({
    with: {
      branch: true,
    },
    orderBy: [desc(schema.users.createdAt)],
  });

  const branches = await db.select({ id: schema.branches.id, name: schema.branches.name }).from(schema.branches);
  const employeeProfiles = await db.select().from(schema.employees);

  const profileMap = new Map<string, any>();
  for (const p of employeeProfiles) {
    if (p.userId) profileMap.set(p.userId, p);
    if (p.email) profileMap.set(p.email.toLowerCase(), p);
  }

  const roleToDepartment: Record<string, string> = {
    super_admin: "Management",
    accountant: "Accounts & Billing",
    sales_executive: "Sales & Marketing",
    storekeeper: "Warehouse & Inventory",
    installation_engineer: "Engineering & Rooftop",
    service_technician: "Service & Maintenance",
    branch_manager: "Branch Management",
  };

  const formattedUsers: any[] = users.map((u: any) => {
    const profile = profileMap.get(u.id) || (u.email ? profileMap.get(u.email.toLowerCase()) : null);

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      username: u.username,
      role: u.role,
      phone: u.phone,
      department: profile?.department || roleToDepartment[u.role] || "Engineering",
      designation: profile?.designation || u.role.split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      employeeCode: profile?.employeeCode || `EMP-${u.id.slice(0, 4).toUpperCase()}`,
      joiningDate: profile?.joiningDate ? profile.joiningDate.toISOString() : u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
      salary: profile?.salary ? Number(profile.salary) : null,
      status: (u.status as any) || "Active",
      isActive: u.isActive ?? true,
      mustChangePassword: !!u.mustChangePassword,
      failedLoginAttempts: u.failedLoginAttempts || 0,
      lockedUntil: u.lockedUntil ? u.lockedUntil.toISOString() : null,
      lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
      lastLoginIp: u.lastLoginIp,
      branchId: u.branchId,
      branch: u.branch ? { id: u.branch.id, name: u.branch.name, city: u.branch.city } : null,
    };
  });

  return <EmployeesClient initialEmployees={formattedUsers} branches={branches} />;
}
