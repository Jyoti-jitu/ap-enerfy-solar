"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sun, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstLogin = searchParams.get("firstLogin") === "true";
  const userId = searchParams.get("userId") || "";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password rules validation
  const rules = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^a-zA-Z0-9]/.test(newPassword),
  };
  const isStrong = rules.length && rules.upper && rules.lower && rules.number && rules.special;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isStrong) {
      setError("Please ensure your new password satisfies all security requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);

    try {
      // If userId wasn't in query params, fetch current user ID from session
      let targetUserId = userId;
      if (!targetUserId) {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        targetUserId = sessionData?.user?.id;
      }

      if (!targetUserId) {
        setError("Unable to identify current session user. Please sign in again.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetUserId,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Unable to update password.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch (err) {
      setError("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#071f16] via-[#0b2b1e] to-[#04150e] p-4 sm:p-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-emerald-900/20 text-slate-900">
        {/* Brand header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-600 flex items-center justify-center shadow-md">
            <Sun className="w-6 h-6 text-[#071f16] fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-black text-slate-900">AP ENERFY</span>
              <span className="text-xl font-black text-amber-500">SOLAR</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              {isFirstLogin ? "First-Login Setup" : "Account Security"}
            </p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Updated Successfully!</h2>
            <p className="text-sm text-slate-600 mb-6">
              Your new password is now active. Redirecting you to your management dashboard...
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all"
            >
              <span>Go to Dashboard Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isFirstLogin ? "Mandatory Password Change" : "Update Password"}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {isFirstLogin ? "Set Your Permanent Password" : "Change Account Password"}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {isFirstLogin
                  ? "For security, you must update your temporary initial password before accessing the system."
                  : "Ensure your account remains protected with a strong, distinct password."}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isFirstLogin && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong password"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password strength checklist */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <p className="font-semibold text-slate-700 mb-1">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span className={rules.length ? "text-emerald-600 font-semibold" : "text-slate-500"}>
                    {rules.length ? "✓" : "○"} At least 8 characters
                  </span>
                  <span className={rules.upper ? "text-emerald-600 font-semibold" : "text-slate-500"}>
                    {rules.upper ? "✓" : "○"} One uppercase letter
                  </span>
                  <span className={rules.lower ? "text-emerald-600 font-semibold" : "text-slate-500"}>
                    {rules.lower ? "✓" : "○"} One lowercase letter
                  </span>
                  <span className={rules.number ? "text-emerald-600 font-semibold" : "text-slate-500"}>
                    {rules.number ? "✓" : "○"} One numeric digit
                  </span>
                  <span className={rules.special ? "text-emerald-600 font-semibold" : "text-slate-500"}>
                    {rules.special ? "✓" : "○"} One special character
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isStrong}
                className="w-full py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving new password...</span>
                  </>
                ) : (
                  <>
                    <span>Save Password & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
      <ChangePasswordForm />
    </React.Suspense>
  );
}
