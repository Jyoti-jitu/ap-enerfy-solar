"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  CreditCard,
  HardHat,
  FileCheck2,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  category: "payment" | "project" | "quotation" | "inventory";
  unread: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New Payment Received",
    desc: "₹ 60,000 received for INV-2025-0145 (Rajesh Patil) via UPI",
    time: "10 mins ago",
    category: "payment",
    unread: true,
    link: "/payments",
  },
  {
    id: "notif-2",
    title: "Project Milestone Completed",
    desc: "PRJ-0258 (3 kW On-Grid) installation completed at Bhubaneswar",
    time: "45 mins ago",
    category: "project",
    unread: true,
    link: "/projects",
  },
  {
    id: "notif-3",
    title: "Solar Quotation Accepted",
    desc: "QT-2025-0186 accepted by Mehta Residence (5 kW Hybrid)",
    time: "2 hours ago",
    category: "quotation",
    unread: true,
    link: "/quotations",
  },
  {
    id: "notif-4",
    title: "Low Inventory Alert",
    desc: "Solar Panel 550W Mono PERC stock dropped below minimum (12 left)",
    time: "Yesterday",
    category: "inventory",
    unread: false,
    link: "/products",
  },
];

export function NotificationMenu() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getCategoryIcon = (category: NotificationItem["category"]) => {
    switch (category) {
      case "payment":
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case "project":
        return <HardHat className="w-4 h-4 text-blue-600" />;
      case "quotation":
        return <FileCheck2 className="w-4 h-4 text-amber-600" />;
      case "inventory":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    }
  };

  const getCategoryBg = (category: NotificationItem["category"]) => {
    switch (category) {
      case "payment":
        return "bg-emerald-50 border-emerald-200";
      case "project":
        return "bg-blue-50 border-blue-200";
      case "quotation":
        return "bg-amber-50 border-amber-200";
      case "inventory":
        return "bg-rose-50 border-rose-200";
    }
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="View notifications"
          className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-white shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 focus:outline-none"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "#"}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-start gap-3 p-3.5 hover:bg-slate-50 transition-colors text-left",
                    n.unread ? "bg-emerald-50/20" : ""
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 mt-0.5",
                      getCategoryBg(n.category)
                    )}
                  >
                    {getCategoryIcon(n.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {n.title}
                      </p>
                      {n.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                      {n.desc}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {n.time}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer Action */}
          <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 py-1.5 px-3 rounded-lg hover:bg-emerald-50 inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View All Notifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
