import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, Sun } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 sm:p-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-200 text-center">
        {/* Brand header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-amber-300">
            <Sun className="w-5 h-5 fill-amber-300" />
          </div>
          <span className="font-extrabold text-slate-900 text-lg">AP ENERFY SOLAR</span>
        </div>

        {/* Shield Icon */}
        <div className="w-20 h-20 rounded-full bg-red-100 border-4 border-red-50 flex items-center justify-center mx-auto mb-6 text-red-600">
          <ShieldAlert className="w-10 h-10" />
        </div>

        {/* 403 Message */}
        <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
          HTTP 403 Forbidden
        </span>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Access Restricted
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          You do not have the required permissions or role privileges to view or perform operations on this resource. If you believe this is an error, please request authorization from your Super Admin.
        </p>

        {/* Return to Dashboard */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch Account</span>
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          Enterprise Security Policy: Attempted unauthorized accesses are recorded in security audit logs.
        </p>
      </div>
    </div>
  );
}
