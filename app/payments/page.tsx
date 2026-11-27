import React from "react";
import { getPayments } from "@/services/payment.service";
import { PaymentsClient } from "./payments-client";

export const dynamic = "force-dynamic";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const paymentType = typeof params.paymentType === "string" ? params.paymentType : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const paymentMode = typeof params.paymentMode === "string" ? params.paymentMode : undefined;

  const data = await getPayments({ search, paymentType, status, paymentMode });

  return <PaymentsClient initialData={data} />;
}
