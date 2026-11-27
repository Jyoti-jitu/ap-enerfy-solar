"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  ArrowLeft,
  Check,
  Save,
  Loader2,
  Lock,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

interface PermissionItem {
  code: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  assigned: boolean;
}

export default function RolePermissionMatrixPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params?.id as string;

  const [role, setRole] = useState<{ id: string; name: string; slug: string; isSystem: boolean; description: string } | null>(null);
  const [modules, setModules] = useState<Record<string, PermissionItem[]>>({});
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!roleId) return;
    fetch(`/api/roles/${roleId}/permissions`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setRole(data.role);
          setModules(data.modules);
          // Pre-populate checked permissions
          const initial = new Set<string>();
          Object.values(data.modules as Record<string, PermissionItem[]>).forEach((perms) => {
            perms.forEach((p) => {
              if (p.assigned) initial.add(p.code);
            });
          });
          setSelectedCodes(initial);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [roleId]);

  const togglePermission = (code: string) => {
    if (role?.slug === "super_admin") return; // Super admin permissions are immutable
    const next = new Set(selectedCodes);
    if (next.has(code)) {
      next.delete(code);
    } else {
      next.add(code);
    }
    setSelectedCodes(next);
  };

  const toggleModuleAll = (moduleName: string, enable: boolean) => {
    if (role?.slug === "super_admin") return;
    const modulePerms = modules[moduleName] || [];
    const next = new Set(selectedCodes);
    modulePerms.forEach((p) => {
      if (enable) {
        next.add(p.code);
      } else {
        next.delete(p.code);
      }
    });
    setSelectedCodes(next);
  };

  const handleSave = async () => {
    if (role?.slug === "super_admin") return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/roles/${roleId}/permissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissionCodes: Array.from(selectedCodes) }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Failed to update permissions." });
      } else {
        setMessage({ type: "success", text: data.message || "Permissions updated successfully!" });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network connection error while saving permissions." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
        <p className="text-sm font-medium">Loading permission matrix...</p>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="p-12 text-center text-slate-700">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold">Role Not Found</h2>
        <Link href="/settings/roles" className="text-xs text-emerald-700 font-bold mt-2 inline-block">
          ← Return to Role Directory
        </Link>
      </div>
    );
  }

  const isSuperAdmin = role.slug === "super_admin";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/settings/roles"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Roles</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {role.name}
            </h1>
            <code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono border">
              {role.slug}
            </code>
            {role.isSystem && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border">
                <Lock className="w-3 h-3" /> System Role
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">{role.description}</p>
        </div>

        {/* Action Button */}
        {!isSuperAdmin && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Permission Matrix</span>
          </button>
        )}
      </div>

      {/* Notice Alert */}
      {isSuperAdmin && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-bold">Super Admin Role Protection</p>
            <p className="text-amber-800 mt-0.5">
              The root Super Admin role holds unrestricted wildcard access (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">*</code>) across all system resources and cannot be restricted.
            </p>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {/* Permission Matrix Grids */}
      <div className="space-y-6">
        {Object.entries(modules).map(([moduleName, perms]) => {
          const allChecked = perms.every((p) => selectedCodes.has(p.code));
          const someChecked = perms.some((p) => selectedCodes.has(p.code));

          return (
            <div key={moduleName} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Module Header */}
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">{moduleName}</h3>
                  <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                    {perms.filter((p) => selectedCodes.has(p.code)).length} / {perms.length}
                  </span>
                </div>

                {!isSuperAdmin && (
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleModuleAll(moduleName, true)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => toggleModuleAll(moduleName, false)}
                      className="text-slate-500 hover:text-slate-700 font-bold hover:underline"
                    >
                      Deselect All
                    </button>
                  </div>
                )}
              </div>

              {/* Permissions Checklist */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {perms.map((p) => {
                  const checked = isSuperAdmin || selectedCodes.has(p.code);

                  return (
                    <label
                      key={p.code}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                        checked
                          ? "bg-emerald-50/50 border-emerald-300 text-slate-900"
                          : "bg-slate-50/50 border-slate-200 text-slate-600 hover:border-slate-300"
                      } ${isSuperAdmin ? "cursor-not-allowed opacity-80" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isSuperAdmin}
                        onChange={() => togglePermission(p.code)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 leading-tight">{p.name}</p>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-mono bg-slate-200/60 text-slate-700 font-semibold">
                            {p.action}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
                        <code className="text-[10px] text-emerald-800 font-mono mt-1 block">{p.code}</code>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
