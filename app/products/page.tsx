import React from "react";
import { getProducts } from "@/services/product.service";
import { ProductsClient } from "./products-client";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const brand = typeof params.brand === "string" ? params.brand : undefined;
  const stockStatus = typeof params.stockStatus === "string" ? params.stockStatus : undefined;

  const data = await getProducts({ search, category, brand, stockStatus });

  return <ProductsClient initialData={data} />;
}
