import React from "react";
import { getCustomers } from "@/services/customer.service";
import { CustomersClient } from "./customers-client";

export const dynamic = "force-dynamic";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const customerType = typeof params.customerType === "string" ? params.customerType : undefined;
  const projectStatus = typeof params.projectStatus === "string" ? params.projectStatus : undefined;
  const city = typeof params.city === "string" ? params.city : undefined;

  const data = await getCustomers({ search, customerType, projectStatus, city });

  return <CustomersClient initialData={data} />;
}
