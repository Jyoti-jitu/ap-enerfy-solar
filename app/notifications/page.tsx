import React from "react";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { NotificationsClient } from "./notifications-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notifications & System Alerts - AP Enerfy Solar",
  description: "Project updates, subsidy sanctions, payments received, and inventory alerts.",
};

export default async function NotificationsPage() {
  const notifs = await db.query.notifications.findMany({
    orderBy: [desc(schema.notifications.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Notifications & Alerts
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Real-time system dispatches, subsidy clearances, financial alerts and inventory warnings
        </p>
      </div>

      <NotificationsClient initialData={notifs} />
    </div>
  );
}
