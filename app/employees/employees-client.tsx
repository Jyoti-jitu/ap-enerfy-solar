"use client";

import React, { useState } from "react";
import { KPICard } from "@/components/shared/kpi-card";
import {
  UserCog,
  Phone,
  Mail,
  Building,
  Plus,
  Lock,
  Unlock,
  Ban,
  CheckCircle2,
  Clock,
  RefreshCw,
  KeyRound,
  User,
  Search,
  Filter,
  AlertCircle,
  Loader2,
  Edit2,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  ShieldAlert,
  Calendar,
  Briefcase,
  BadgeAlert,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  username: string | null;
  role: string;
  phone: string | null;
  department: string;
  designation: string;
  employeeCode: string;
  joiningDate: string;
  salary: number | null;
  status: "Active" | "Inactive" | "Suspended" | "Terminated";
  isActive: boolean;
  mustChangePassword: boolean;
  failedLoginAttempts: number | null;
  lockedUntil: string | null;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  branchId: string | null;
  branch: { id: string; name: string; city?: string } | null;
}

const AVAILABLE_ROLES = [
  { slug: "super_admin", label: "Super Admin", desc: "Full administrative permissions" },
  { slug: "accountant", label: "Accountant", desc: "Billing, Invoices, Payments & Expenses" },
  { slug: "sales_executive", label: "Sales Executive", desc: "Leads, Customers, Quotations & Solar Packages" },
  { slug: "storekeeper", label: "Storekeeper", desc: "Products, Warehouses & Stock Adjustments" },
  { slug: "installation_engineer", label: "Installation Engineer", desc: "Rooftop Projects & Technical Execution" },
  { slug: "service_technician", label: "Service Technician", desc: "Maintenance Tickets & Solar AMC" },
  { slug: "branch_manager", label: "Branch Manager", desc: "Branch Team & Commercial Operations" },
];

const DEPARTMENTS = [
  "Engineering & Rooftop",
  "Sales & Marketing",
  "Accounts & Billing",
  "Warehouse & Inventory",
  "Service & Maintenance",
  "Management",
];

export function EmployeesClient({
  initialEmployees,
  branches,
}: {
  initialEmployees: Employee[];
  branches: { id: string; name: string }[];
}) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Add Employee Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newDepartment, setNewDepartment] = useState(DEPARTMENTS[0]);
  const [newDesignation, setNewDesignation] = useState("Site Installation Engineer");
  const [newEmployeeCode, setNewEmployeeCode] = useState("");
  const [newRole, setNewRole] = useState("installation_engineer");
  const [newBranchId, setNewBranchId] = useState(branches[0]?.id || "");
  const [newPassword, setNewPassword] = useState("Solar@2025!");
  const [mustChange, setMustChange] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Employee Form State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editDesignation, setEditDesignation] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editBranchId, setEditBranchId] = useState("");
  const [editStatus, setEditStatus] = useState<"Active" | "Inactive" | "Suspended" | "Terminated">("Active");

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setEditName(emp.name);
    setEditEmail(emp.email);
    setEditPhone(emp.phone || "");
    setEditDepartment(emp.department);
    setEditDesignation(emp.designation);
    setEditRole(emp.role);
    setEditBranchId(emp.branchId || branches[0]?.id || "");
    setEditStatus(emp.status);
  };

  // Revoke Sessions Handler
  const handleRevokeSessions = async (emp: Employee) => {
    setActionLoadingId(emp.id);
    setFeedback(null);

    try {
      const res = await fetch(`/api/employees/${emp.id}/revoke-sessions`, {
        method: "POST",
      });
      const data = await res.json();
      setActionLoadingId(null);

      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Failed to revoke sessions." });
        return;
      }

      setFeedback({ type: "success", message: `All active sessions for ${emp.name} were revoked immediately.` });
    } catch (e) {
      setActionLoadingId(null);
      setFeedback({ type: "error", message: "Failed to communicate with server." });
    }
  };

  // Toggle Employee Status (Active / Inactive)
  const handleToggleStatus = async (emp: Employee) => {
    const nextStatus = emp.status === "Active" ? "Inactive" : "Active";
    setActionLoadingId(emp.id);
    setFeedback(null);

    try {
      const res = await fetch(`/api/employees/${emp.id}/toggle-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      setActionLoadingId(null);

      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Failed to update status." });
        return;
      }

      setEmployees((prev) =>
        prev.map((e) =>
          e.id === emp.id
            ? { ...e, status: nextStatus, isActive: nextStatus === "Active" }
            : e
        )
      );
      setFeedback({
        type: "success",
        message: `${emp.name} has been ${nextStatus === "Active" ? "activated" : "deactivated"}.`,
      });
    } catch (err) {
      setActionLoadingId(null);
      setFeedback({ type: "error", message: "Failed to update employee status." });
    }
  };

  // Unlock Rate-Locked Account
  const handleUnlock = async (emp: Employee) => {
    setActionLoadingId(emp.id);
    setFeedback(null);

    try {
      const res = await fetch(`/api/employees/${emp.id}/unlock`, {
        method: "POST",
      });
      const data = await res.json();
      setActionLoadingId(null);

      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Failed to unlock." });
        return;
      }

      setEmployees((prev) =>
        prev.map((e) =>
          e.id === emp.id
            ? { ...e, lockedUntil: null, failedLoginAttempts: 0 }
            : e
        )
      );
      setFeedback({
        type: "success",
        message: `Account for ${emp.name} has been unlocked successfully.`,
      });
    } catch (err) {
      setActionLoadingId(null);
      setFeedback({ type: "error", message: "Failed to unlock account." });
    }
  };

  // 1. CREATE Employee
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          username: newUsername || undefined,
          phone: newPhone || undefined,
          roleSlug: newRole,
          branchId: newBranchId || undefined,
          department: newDepartment,
          designation: newDesignation,
          employeeCode: newEmployeeCode || `EMP-${Date.now().toString().slice(-4)}`,
          passwordPlain: newPassword,
          mustChangePassword: mustChange,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Failed to provision employee." });
        return;
      }

      const branchObj = branches.find((b) => b.id === newBranchId) || null;

      const newEmp: Employee = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        username: data.user.username,
        role: data.user.role,
        phone: data.user.phone,
        department: newDepartment,
        designation: newDesignation,
        employeeCode: newEmployeeCode || `EMP-${data.user.id.slice(0, 4).toUpperCase()}`,
        joiningDate: new Date().toISOString(),
        salary: null,
        status: "Active",
        isActive: true,
        mustChangePassword: data.user.mustChangePassword,
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: null,
        lastLoginIp: null,
        branchId: newBranchId,
        branch: branchObj ? { id: branchObj.id, name: branchObj.name } : null,
      };

      setEmployees((prev) => [newEmp, ...prev]);
      setShowAddModal(false);
      setFeedback({
        type: "success",
        message: `New employee ${newName} provisioned with role ${newRole}. Temporary password: ${newPassword}`,
      });

      // Reset form
      setNewName("");
      setNewEmail("");
      setNewUsername("");
      setNewPhone("");
      setNewEmployeeCode("");
    } catch (err) {
      setIsSubmitting(false);
      setFeedback({ type: "error", message: "Failed to provision employee." });
    }
  };

  // 2. UPDATE Employee
  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/employees/${editingEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: editPhone,
          department: editDepartment,
          designation: editDesignation,
          role: editRole,
          branchId: editBranchId,
          status: editStatus,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Failed to update employee." });
        return;
      }

      const branchObj = branches.find((b) => b.id === editBranchId) || null;

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id
            ? {
                ...emp,
                name: editName,
                email: editEmail,
                phone: editPhone,
                department: editDepartment,
                designation: editDesignation,
                role: editRole,
                branchId: editBranchId,
                branch: branchObj ? { id: branchObj.id, name: branchObj.name } : null,
                status: editStatus,
                isActive: editStatus === "Active",
              }
            : emp
        )
      );

      setEditingEmployee(null);
      setFeedback({
        type: "success",
        message: `Employee ${editName} updated successfully.`,
      });
    } catch (err) {
      setIsSubmitting(false);
      setFeedback({ type: "error", message: "Failed to update employee." });
    }
  };

  // 3. DELETE Employee
  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return;

    setActionLoadingId(deletingEmployee.id);
    setFeedback(null);

    try {
      const res = await fetch(`/api/employees/${deletingEmployee.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      setActionLoadingId(null);

      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Failed to delete employee." });
        return;
      }

      setEmployees((prev) => prev.filter((e) => e.id !== deletingEmployee.id));
      const deletedName = deletingEmployee.name;
      setDeletingEmployee(null);

      setFeedback({
        type: "success",
        message: data.message || `Employee ${deletedName} deleted successfully.`,
      });
    } catch (err) {
      setActionLoadingId(null);
      setFeedback({ type: "error", message: "Failed to delete employee." });
    }
  };

  // Filtered employees list
  const filtered = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.username && e.username.toLowerCase().includes(search.toLowerCase())) ||
      (e.department && e.department.toLowerCase().includes(search.toLowerCase())) ||
      (e.employeeCode && e.employeeCode.toLowerCase().includes(search.toLowerCase())) ||
      (e.phone && e.phone.includes(search));

    const matchesRole = roleFilter === "all" || e.role === roleFilter;
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = employees.filter((e) => e.status === "Active").length;
  const inactiveCount = employees.filter((e) => e.status !== "Active").length;
  const lockedCount = employees.filter(
    (e) => e.lockedUntil && new Date(e.lockedUntil) > new Date()
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Employees Management</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Super Admin Controls
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Directory of solar engineering, technical, sales, logistics and administrative team members
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold"
              : "bg-rose-50 border-rose-200 text-rose-800 font-semibold"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100 px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Employees" value={employees.length} theme="green" iconName="users" subtext="Registered workforce" />
        <KPICard title="Active Staff" value={activeCount} theme="blue" iconName="checkcircle" subtext="Operational accounts" />
        <KPICard title="Deactivated / Leave" value={inactiveCount} theme="rose" iconName="clock" subtext="Access suspended" />
        <KPICard title="Security Locked" value={lockedCount} theme="yellow" iconName="alert" subtext="Rate-limit locks" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, code or dept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 pl-8 pr-3 text-xs focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold text-xs shrink-0">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 px-2.5 text-xs bg-white text-slate-800 focus:border-emerald-600 focus:outline-none font-medium"
            >
              <option value="all">All Roles</option>
              {AVAILABLE_ROLES.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold text-xs shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 px-2.5 text-xs bg-white text-slate-800 focus:border-emerald-600 focus:outline-none font-medium"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode("table")}
              title="Table View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "table" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: Table View (Enterprise Dense)
      ========================================================================= */}
      {viewMode === "table" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Role & Dept</th>
                  <th className="py-3.5 px-4">Branch</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">CRUD Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => {
                  const isLocked = u.lockedUntil && new Date(u.lockedUntil) > new Date();
                  const roleObj = AVAILABLE_ROLES.find((r) => r.slug === u.role);

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600 text-[11px]">
                        {u.employeeCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white font-bold text-xs">
                            {u.name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-950 text-sm">{u.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">@{u.username || "emp"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-emerald-800">{roleObj?.label || u.role}</div>
                        <div className="text-[11px] text-slate-500">{u.department}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {u.branch?.name || "Bhubaneswar HQ"}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-semibold">{u.email}</div>
                        <div className="text-[11px] text-slate-500">{u.phone || "-"}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isLocked
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : u.status === "Active"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {isLocked ? "Locked" : u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Read */}
                          <button
                            onClick={() => setViewingEmployee(u)}
                            title="View Employee Profile"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Update */}
                          <button
                            onClick={() => openEditModal(u)}
                            title="Edit Employee"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 text-emerald-700 hover:border-emerald-300 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {/* Quick Toggle Status */}
                          <button
                            disabled={actionLoadingId === u.id}
                            onClick={() => handleToggleStatus(u)}
                            title={u.status === "Active" ? "Deactivate Account" : "Activate Account"}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              u.status === "Active"
                                ? "border-slate-200 hover:bg-amber-50 text-amber-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {actionLoadingId === u.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Ban className="h-3.5 w-3.5" />
                            )}
                          </button>

                          {/* Unlock if locked */}
                          {isLocked && (
                            <button
                              disabled={actionLoadingId === u.id}
                              onClick={() => handleUnlock(u)}
                              title="Unlock Account"
                              className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold"
                            >
                              <Unlock className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingEmployee(u)}
                            title="Delete Employee"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600 hover:border-rose-300 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: Grid View (Cards)
      ========================================================================= */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((u) => {
            const isLocked = u.lockedUntil && new Date(u.lockedUntil) > new Date();
            const roleObj = AVAILABLE_ROLES.find((r) => r.slug === u.role);

            return (
              <div
                key={u.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition-all flex flex-col justify-between ${
                  u.status !== "Active"
                    ? "border-rose-200 bg-rose-50/20 opacity-80"
                    : isLocked
                    ? "border-amber-300 bg-amber-50/20"
                    : "border-slate-200 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isLocked
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : u.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {isLocked ? "Locked" : u.status}
                    </span>

                    <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                      {u.employeeCode}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 text-white font-bold text-sm shadow-sm">
                      {u.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-sm text-slate-900 truncate" title={u.name}>
                        {u.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-emerald-700">
                        {roleObj?.label || u.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{u.phone || "+91 94370 00000"}</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-500">
                      <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{u.branch?.name || "Bhubaneswar HQ"}</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-500">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{u.department}</span>
                    </p>
                  </div>
                </div>

                {/* CRUD Controls */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => setViewingEmployee(u)}
                    className="flex-1 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => openEditModal(u)}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] flex items-center justify-center gap-1"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeletingEmployee(u)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600 hover:border-rose-300"
                    title="Delete Employee"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: Create New Employee (C)
      ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">Provision New Employee</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Mohanty"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Corporate Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh@apenerfy.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Username (Login ID)</label>
                  <input
                    type="text"
                    placeholder="e.g. ramesh"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94370 12345"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none font-medium bg-white"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Designation Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Solar Engineer"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Assigned User Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none font-medium bg-white"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.label} — ({r.desc})
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Operating Branch</label>
                <select
                  value={newBranchId}
                  onChange={(e) => setNewBranchId(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none font-medium bg-white"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Initial Password</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs font-mono focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Must Change Password Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mustChange}
                    onChange={(e) => setMustChange(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Require password change upon first login
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  <span>Create Employee</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: View Employee Details (R)
      ========================================================================= */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white font-bold text-sm">
                  {viewingEmployee.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{viewingEmployee.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{viewingEmployee.employeeCode} · @{viewingEmployee.username || "emp"}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingEmployee(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Role</span>
                <span className="font-bold text-emerald-800 text-sm">
                  {AVAILABLE_ROLES.find((r) => r.slug === viewingEmployee.role)?.label || viewingEmployee.role}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Account Status</span>
                <span className="font-bold text-slate-900 text-sm">{viewingEmployee.status}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Department</span>
                <span className="font-bold text-slate-900">{viewingEmployee.department}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Designation</span>
                <span className="font-bold text-slate-900">{viewingEmployee.designation}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Corporate Email</span>
                <span className="font-bold text-slate-900 truncate block">{viewingEmployee.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Phone Contact</span>
                <span className="font-bold text-slate-900">{viewingEmployee.phone || "N/A"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Operating Branch</span>
                <span className="font-bold text-slate-900">{viewingEmployee.branch?.name || "Bhubaneswar HQ"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Last Active</span>
                <span className="font-bold text-slate-900">
                  {viewingEmployee.lastLoginAt ? new Date(viewingEmployee.lastLoginAt).toLocaleDateString() : "Never"}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 gap-2">
              <button
                onClick={() => {
                  const emp = viewingEmployee;
                  setViewingEmployee(null);
                  openEditModal(emp);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Edit Details
              </button>
              <button
                onClick={() => setViewingEmployee(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: Edit Employee (U)
      ========================================================================= */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">Edit Employee: {editingEmployee.name}</h3>
              </div>
              <button
                onClick={() => setEditingEmployee(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateEmployee} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Operating Branch</label>
                  <select
                    value={editBranchId}
                    onChange={(e) => setEditBranchId(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none font-medium bg-white"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Department</label>
                  <select
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none font-medium bg-white"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Designation</label>
                  <input
                    type="text"
                    value={editDesignation}
                    onChange={(e) => setEditDesignation(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Assigned Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none font-medium bg-white"
                  >
                    {AVAILABLE_ROLES.map((r) => (
                      <option key={r.slug} value={r.slug}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-600 focus:outline-none font-medium bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: Delete Confirmation Dialog (D)
      ========================================================================= */}
      {deletingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Delete Employee Account?</h3>
                <p className="text-xs text-slate-500">This action will remove or archive this employee account.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <p className="font-bold text-slate-950">{deletingEmployee.name}</p>
              <p className="text-slate-600">{deletingEmployee.email} · Role: {deletingEmployee.role}</p>
              <p className="text-[11px] text-slate-500 font-mono">Code: {deletingEmployee.employeeCode}</p>
            </div>

            {deletingEmployee.role === "super_admin" && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
                <span>Notice: System protects the last active Super Admin account from deletion.</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingEmployee(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoadingId === deletingEmployee.id}
                onClick={handleDeleteEmployee}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                {actionLoadingId === deletingEmployee.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
