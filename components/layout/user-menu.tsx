"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  KeyRound,
  Building,
  UserCog,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { usePermissions } from "@/components/shared/PermissionGuard";
import { getInitials } from "@/lib/formatting";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function UserMenu() {
  const router = useRouter();
  const { user, isSuperAdmin } = usePermissions();

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("ap_auth_user");
      }
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
    router.refresh();
  };

  const userName = user?.name || "Admin User";
  const userEmail = user?.email || "admin@apenerfy.com";
  const userRole = user?.role ? user.role.replace(/_/g, " ").toUpperCase() : "SUPER ADMIN";
  const initials = getInitials(userName);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="User Account Menu"
          className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {/* Circular Green User Avatar matching reference screenshots */}
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-sm border border-emerald-600/30">
            {initials}
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">
              {userName.split(" ")[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl p-1.5 space-y-1 animate-in fade-in-50 zoom-in-95 duration-100"
        >
          {/* User Info Header */}
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-slate-50 rounded-xl border border-emerald-100/60 mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase bg-emerald-700 text-white shadow-xs">
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <DropdownMenu.Item asChild>
            <Link
              href="/profile"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer outline-none transition-colors"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>My Profile</span>
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/profile/security"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer outline-none transition-colors"
            >
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Security & Sessions</span>
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/change-password"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer outline-none transition-colors"
            >
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Change Password</span>
            </Link>
          </DropdownMenu.Item>

          {isSuperAdmin && (
            <>
              <DropdownMenu.Item asChild>
                <Link
                  href="/employees"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer outline-none transition-colors"
                >
                  <UserCog className="w-4 h-4 text-emerald-600" />
                  <span>Employees & Access</span>
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link
                  href="/settings"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer outline-none transition-colors"
                >
                  <Building className="w-4 h-4 text-purple-600" />
                  <span>Company Settings</span>
                </Link>
              </DropdownMenu.Item>
            </>
          )}

          <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />

          {/* Sign Out */}
          <DropdownMenu.Item
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer outline-none transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sign Out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
