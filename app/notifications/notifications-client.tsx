"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { KPICard } from "@/components/shared/kpi-card";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  HardHat,
  Package,
  Compass,
  ArrowRight,
  Check,
  Trash2,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string | Date;
}

export function NotificationsClient({ initialData }: { initialData: NotificationItem[] }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialData);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "PROJECT" | "PAYMENT" | "INVENTORY">("ALL");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    if (filter === "PROJECT") return n.type === "PROJECT";
    if (filter === "PAYMENT") return n.type === "PAYMENT";
    if (filter === "INVENTORY") return n.type === "INVENTORY";
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "PAYMENT":
        return <Receipt className="h-4 w-4 text-emerald-600" />;
      case "PROJECT":
        return <HardHat className="h-4 w-4 text-blue-600" />;
      case "INVENTORY":
        return <Package className="h-4 w-4 text-amber-600" />;
      case "LEAD":
        return <Compass className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Notifications"
          value={notifications.length}
          theme="green"
          iconName="bell"
          subtext="Alerts & dispatches"
        />
        <KPICard
          title="Unread Alerts"
          value={unreadCount}
          theme={unreadCount > 0 ? "rose" : "emerald"}
          iconName="clock"
          subtext={unreadCount > 0 ? "Requires attention" : "All caught up"}
        />
        <KPICard
          title="Subsidy & Projects"
          value={notifications.filter((n) => n.type === "PROJECT").length}
          theme="blue"
          iconName="hard-hat"
          subtext="Discom & net metering"
        />
        <KPICard
          title="Financial Alerts"
          value={notifications.filter((n) => n.type === "PAYMENT").length}
          theme="yellow"
          iconName="rupee"
          subtext="Payments & collections"
        />
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Filter Bar & Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("UNREAD")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === "UNREAD"
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("PROJECT")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === "PROJECT"
                  ? "bg-blue-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setFilter("PAYMENT")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === "PAYMENT"
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setFilter("INVENTORY")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === "INVENTORY"
                  ? "bg-amber-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Inventory
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No notifications matching this filter.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex items-start gap-4 hover:bg-slate-50/70 transition-colors ${
                  !item.isRead ? "bg-emerald-50/20" : ""
                }`}
              >
                <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4
                      className={`text-sm ${
                        !item.isRead ? "font-bold text-slate-950" : "font-semibold text-slate-800"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    {item.link && (
                      <Link
                        href={item.link}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}

                    {!item.isRead && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
