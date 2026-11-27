"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sun,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  Building,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Please enter your registered email or username"),
  password: z.string().min(1, "Please enter your password"),
  rememberMe: z.boolean().default(false),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Form states - Empty by default, no exposed or demo credentials
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side validation with Zod
    const validation = loginSchema.safeParse({ identifier, password, rememberMe });
    if (!validation.success) {
      const errors: { identifier?: string; password?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0] === "identifier") errors.identifier = err.message;
        if (err.path[0] === "password") errors.password = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid email/username or password.");
        setLoading(false);
        return;
      }

      // Save user to localStorage for instant client hydration
      if (data.user) {
        try {
          localStorage.setItem("ap_auth_user", JSON.stringify(data.user));
        } catch {}
      }

      // First-login password change enforcement
      if (data.user?.mustChangePassword) {
        router.push(`/change-password?firstLogin=true&userId=${data.user.id}`);
        return;
      }

      // Redirect to target or authorized dashboard path
      const targetPath = callbackUrl !== "/login" && callbackUrl.startsWith("/") ? callbackUrl : (data.defaultPath || "/dashboard");
      router.push(targetPath);
      router.refresh();
    } catch (err: any) {
      setError("A connection error occurred. Please verify your network connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#081e14] text-white">
      {/* ------------------------------------------------------------- */}
      {/* LEFT SECTION — AP ENERFY BRANDING & VISUAL PRESENTATION     */}
      {/* ------------------------------------------------------------- */}
      <div className="lg:w-1/2 xl:w-7/12 relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-[#071f16] via-[#0b2b1e] to-[#04150e]">
        {/* Subtle Solar Mesh Background Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/30">
            <Sun className="w-7 h-7 text-[#071f16] fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white">AP ENERFY</span>
              <span className="text-2xl font-black tracking-tight text-amber-400">SOLAR</span>
            </div>
            <p className="text-xs uppercase tracking-widest text-emerald-400/90 font-semibold">
              Enterprise Solar ERP & Billing System
            </p>
          </div>
        </div>

        {/* Central Visual / Value Proposition */}
        <div className="relative z-10 my-12 lg:my-0 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-6 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Clean Energy. Smart Business.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Powering Sustainable Operations Across India.
          </h1>

          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed mb-8">
            Complete rooftop solar lifecycle management — from site surveys, shadow simulation, and GST tax billing to procurement logistics, warehouse inventory, and smart AMC service execution.
          </p>

          {/* Key Value Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-emerald-800/40">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Solar EPC Projects</p>
                <p className="text-[11px] text-emerald-300/80">Turnkey Rooftop Execution</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
              <Building className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Inventory & Logistics</p>
                <p className="text-[11px] text-emerald-300/80">Multi-Warehouse Tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
              <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">GST Invoicing</p>
                <p className="text-[11px] text-emerald-300/80">100% Tax Compliant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-emerald-400/60 hidden sm:flex items-center justify-between">
          <span>Headquarters: Bhubaneswar, Odisha</span>
          <span>ISO 9001:2015 Certified System</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT SECTION — ENTERPRISE LOGIN FORM                        */}
      {/* ------------------------------------------------------------- */}
      <div className="lg:w-1/2 xl:w-5/12 bg-white text-slate-900 flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md mx-auto my-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-medium">
              Sign in to your AP Enerfy Solar management console
            </p>
          </div>

          {/* Authentication Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in duration-200" role="alert">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">Sign in failed</p>
                <p className="mt-0.5 text-xs text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {/* Email or Username */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (fieldErrors.identifier) setFieldErrors({ ...fieldErrors, identifier: undefined });
                  }}
                  placeholder="name@apenerfy.com or username"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.identifier
                      ? "border-red-500 focus:ring-red-200 bg-red-50/30"
                      : "border-slate-300 focus:border-emerald-600 focus:ring-emerald-100"
                  }`}
                />
              </div>
              {fieldErrors.identifier && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.identifier}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-2.5 bg-slate-50 border rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password
                      ? "border-red-500 focus:ring-red-200 bg-red-50/30"
                      : "border-slate-300 focus:border-emerald-600 focus:ring-emerald-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                />
                <span className="text-xs font-medium text-slate-600">
                  Remember this device for 30 days
                </span>
              </label>
            </div>

            {/* Sign In Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm shadow-md hover:shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Protected by 256-bit SSL encryption & Role-Based Access Control</span>
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="w-full max-w-md mx-auto pt-6 text-center text-xs text-slate-500">
          <p>© 2025 AP Enerfy Solar Pvt Ltd. All rights reserved.</p>
          <p className="mt-1 text-[11px] text-slate-400">
            Unauthorized access or attempted credential manipulation is strictly prohibited and subject to legal prosecution.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </React.Suspense>
  );
}
