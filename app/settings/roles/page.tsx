"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Plus,
  Users,
  Key,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface RoleItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  isSystemRole: boolean;
  isActive: boolean;
  userCount: number;
  permissionCount: string | number;
}

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/roles")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setRoles(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Access Control & Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Roles & Permissions Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Configure system roles, granular module permissions, and access privileges across AP Enerfy Solar.
          </p>
        </div>

        <Link
          href="/settings/roles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Role</span>
        </Link>
      </div>

      {/* Role Listing */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-sm font-medium">Loading system role definitions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{role.name}</h3>
                    <code className="text-[11px] font-mono text-slate-500">{role.slug}</code>
                  </div>
                  {role.isSystem ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                      <Lock className="w-2.5 h-2.5 text-slate-500" />
                      System
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                      Custom
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {role.description || "No description provided."}
                </p>

                {/* Stats badge */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 mb-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Assigned</p>
                      <p className="font-extrabold text-slate-800">{role.userCount} Users</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Permissions</p>
                      <p className="font-extrabold text-slate-800">{role.permissionCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100">
                <Link
                  href={`/settings/roles/${role.id}`}
                  className="w-full inline-flex items-center justify-between py-2 px-3 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all group"
                >
                  <span>Configure Permission Matrix</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
