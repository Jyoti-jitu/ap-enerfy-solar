"use client";

import React, { useState } from "react";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import { PRODUCT_CATEGORIES, PRODUCT_BRANDS } from "@/lib/constants";
import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Upload,
  Download,
  Search,
  RotateCcw,
  Eye,
  Pencil,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
  SlidersHorizontal,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";

export function ProductsClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedStockStatus, setSelectedStockStatus] = useState("All Status");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isStockAdjustmentOpen, setIsStockAdjustmentOpen] = useState(false);
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState<any | null>(null);
  const [adjustQty, setAdjustQty] = useState(10);
  const [adjustReason, setAdjustReason] = useState("PO Received");
  const [adjustLoading, setAdjustLoading] = useState(false);

  const filtered = data.products.filter((p: any) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== "All Categories" && p.category !== selectedCategory) {
      return false;
    }
    if (selectedBrand !== "All Brands" && p.brand !== selectedBrand) {
      return false;
    }
    if (selectedStockStatus !== "All Status" && p.status !== selectedStockStatus) {
      return false;
    }
    return true;
  });

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForAdjust) return;
    setAdjustLoading(true);

    try {
      const res = await fetch("/api/products/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductForAdjust.id,
          quantityDelta: adjustQty,
          reason: adjustReason,
        }),
      });

      if (res.ok) {
        const refreshed = await fetch("/api/products").then((r) => r.json());
        setData(refreshed);
        setIsStockAdjustmentOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdjustLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Products & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage solar products, stock, warehouses and inventory movements
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => {
              if (data.products.length > 0) {
                setSelectedProductForAdjust(data.products[0]);
                setAdjustQty(20);
                setIsStockAdjustmentOpen(true);
              }
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" />
            <span>Stock In</span>
          </button>

          <button
            onClick={() => {
              if (data.products.length > 0) {
                setSelectedProductForAdjust(data.products[0]);
                setAdjustQty(-5);
                setIsStockAdjustmentOpen(true);
              }
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowUpRight className="h-3.5 w-3.5 text-amber-600" />
            <span>Stock Out</span>
          </button>

          <a
            href="/api/export/products"
            download
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </a>
        </div>
      </div>

      {/* Pastel KPI Cards Grid (Matches image copy 4.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <KPICard
          title="Total Products"
          value={data.kpis.totalProducts}
          change="+12 this month"
          isPositive={true}
          theme="green"
          iconName="package"
        />
        <KPICard
          title="Total Stock Value"
          value={formatCurrency(data.kpis.totalStockValue)}
          theme="blue"
          iconName="invoice"
        />
        <KPICard
          title="Low Stock Items"
          value={data.kpis.lowStockItems}
          subtext="(Need Reorder)"
          subtextColor="amber"
          theme="yellow"
          iconName="checkcircle"
        />
        <KPICard
          title="Out of Stock"
          value={data.kpis.outOfStock}
          theme="rose"
          iconName="clock"
        />
        <KPICard
          title="Warehouses"
          value={data.kpis.warehouses}
          theme="purple"
          iconName="warehouse"
        />
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search product by name, SKU or model..."
                  className="w-full h-9 rounded-lg border border-slate-200 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="All Categories">All Categories</option>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="All Brands">All Brands</option>
                  {PRODUCT_BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-1">
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
                  Stock Status
                </label>
                <select
                  value={selectedStockStatus}
                  onChange={(e) => setSelectedStockStatus(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="All Status">All Status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="lg:col-span-1 flex items-end">
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All Categories");
                    setSelectedBrand("All Brands");
                    setSelectedStockStatus("All Status");
                  }}
                  className="w-full mt-3.5 h-8 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-600 font-medium"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table (Matches image copy 4.png) */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                    <th className="py-3 px-3 w-10 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                    </th>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3">Product Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Brand</th>
                    <th className="py-3 px-3 text-right">Unit Price (₹)</th>
                    <th className="py-3 px-3 text-center">Stock</th>
                    <th className="py-3 px-3 text-center">Min. Stock</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((prod: any) => (
                    <tr
                      key={prod.id}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 px-3 text-center">
                        <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {prod.sku}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                            <Package className="h-4 w-4" />
                          </div>
                          <span>{prod.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 border border-slate-200">
                          {prod.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {prod.brand}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        {Number(prod.unitPrice).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">
                        {prod.stockQuantity}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-500">
                        {prod.minStockThreshold}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={prod.status} />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-slate-500">
                          <button
                            onClick={() => {
                              setSelectedProductForAdjust(prod);
                              setAdjustQty(10);
                              setIsStockAdjustmentOpen(true);
                            }}
                            className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Adjust Stock"
                          >
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                          </button>
                          <button className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded" title="Edit">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 text-xs text-slate-500">
              <div>
                Showing 1-{Math.min(filtered.length, 8)} of {data.totalCount} products
              </div>

              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button className="h-7 w-7 rounded-lg bg-emerald-700 text-white font-semibold shadow-sm">
                  1
                </button>
                <button className="h-7 w-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
                  2
                </button>
                <button className="h-7 w-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
                  3
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button className="h-7 w-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
                  21
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <ChevronsRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

      {/* Stock Adjustment Modal */}
      {isStockAdjustmentOpen && selectedProductForAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  {selectedProductForAdjust.sku}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Adjust Inventory
                </h3>
              </div>
              <button
                onClick={() => setIsStockAdjustmentOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border">
                <p className="font-semibold text-slate-800">{selectedProductForAdjust.name}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Current Stock: <strong className="text-slate-900">{selectedProductForAdjust.stockQuantity}</strong> units
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Quantity Delta (+ to add, - to deduct)
                </label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                  className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 font-bold text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Reason for Adjustment
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="PO Received, Installation dispatch, etc."
                  className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsStockAdjustmentOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustLoading}
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {adjustLoading ? "Saving..." : "Save Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
