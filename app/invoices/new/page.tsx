import React from "react";
import { db, schema } from "@/db";
import { asc } from "drizzle-orm";
import { CreateInvoiceClient } from "./create-invoice-client";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const customerRecords = await db.query.customers.findMany({
    orderBy: [asc(schema.customers.name)],
  });

  return <CreateInvoiceClient customers={customerRecords} />;
}
