"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export function AccessDeniedCard({
  requiredPermission,
}: {
  requiredPermission?: string;
}) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200/60 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Access Restricted
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your current assigned role does not hold the authorization credentials required to access this resource.
          </p>
        </div>

        {requiredPermission && (
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700">
            Required Permission: <span className="font-semibold text-emerald-800">{requiredPermission}</span>
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-2">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
