"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  User,
  Lock,
  KeyRound,
  Laptop,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogOut,
  RefreshCw,
  Smartphone,
} from "lucide-react";

interface SessionItem {
  id: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export default function SecurityProfilePage() {
  const router = useRouter();

  // Change password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Active sessions states
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);
  const [sessionMessage, setSessionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/profile/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    setPasswordLoading(true);

    try {
      // Get current user id
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const userId = sessionData?.user?.id;

      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setPasswordMessage({ type: "error", text: data.error || "Failed to update password." });
      } else {
        setPasswordMessage({ type: "success", text: "Password changed successfully! Other sessions were invalidated." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        fetchSessions();
      }
    } catch (e) {
      setPasswordMessage({ type: "error", text: "Connection error occurred." });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Revoke All Other Sessions
  const handleRevokeOtherSessions = async () => {
    setRevoking(true);
    setSessionMessage(null);

    try {
      const res = await fetch("/api/profile/sessions", { method: "DELETE" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setSessionMessage({ type: "error", text: data.error || "Failed to revoke sessions." });
      } else {
        setSessionMessage({ type: "success", text: "All other active sessions have been invalidated." });
        fetchSessions();
      }
    } catch (e) {
      setSessionMessage({ type: "error", text: "Connection error occurred." });
    } finally {
      setRevoking(false);
    }
  };

  // Sign out handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      router.push("/login");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Security & Sessions</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Manage your credentials, review active device sessions, and revoke unauthorized access.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <Link
          href="/profile"
          className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center gap-2 px-1 transition-colors"
        >
          <User className="w-4 h-4" />
          <span>General Information</span>
        </Link>
        <Link
          href="/profile/security"
          className="pb-3 border-b-2 border-emerald-600 text-emerald-700 flex items-center gap-2 px-3"
        >
          <Shield className="w-4 h-4" />
          <span>Security & Active Sessions</span>
        </Link>
      </div>

      {/* Password Change Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-2">
          <KeyRound className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Updating your password will automatically invalidate all other active browser sessions for your protection.
        </p>

        {passwordMessage && (
          <div
            className={`p-3.5 rounded-lg border text-xs mb-5 flex items-center gap-2 ${
              passwordMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {passwordMessage.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{passwordMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 8 characters"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-70 mt-2"
          >
            {passwordLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
            <span>Update Password</span>
          </button>
        </form>
      </div>

      {/* Active Sessions Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Laptop className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Active Device Sessions</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Devices currently signed in to your AP Enerfy Solar account.
            </p>
          </div>

          <button
            onClick={handleRevokeOtherSessions}
            disabled={revoking || sessions.length <= 1}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            {revoking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>Revoke Other Sessions</span>
          </button>
        </div>

        {sessionMessage && (
          <div
            className={`p-3 rounded-lg border text-xs mb-4 flex items-center gap-2 ${
              sessionMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {sessionMessage.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{sessionMessage.text}</span>
          </div>
        )}

        {sessionsLoading ? (
          <div className="p-8 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
            <p className="text-xs">Loading sessions...</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sessions.map((s) => (
              <div key={s.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">{s.ipAddress}</p>
                      {s.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Current Device
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-sm">{s.userAgent}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Signed in {new Date(s.createdAt).toLocaleDateString()} at {new Date(s.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Sign Out</h3>
          <p className="text-xs text-slate-500 mt-0.5">End your current session on this device.</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
