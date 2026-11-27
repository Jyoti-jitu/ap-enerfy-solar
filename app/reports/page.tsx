import React from "react";
import { getReportsData } from "@/services/report.service";
import { ReportsClient } from "./reports-client";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const data = await getReportsData();

  return <ReportsClient data={data} />;
}
