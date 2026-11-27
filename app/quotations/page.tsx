import React from "react";
import { getQuotations } from "@/services/quotation.service";
import { db, schema } from "@/db";
import { QuotationsClient } from "./quotations-client";

export const dynamic = "force-dynamic";

export default async function QuotationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const systemType = typeof params.systemType === "string" ? params.systemType : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;

  const data = await getQuotations({ search, systemType, status });
  const solarPlans = await db.select().from(schema.solarPlans);

  return <QuotationsClient initialData={data} solarPlans={solarPlans} />;
}
