"use client";

import React, { useState } from "react";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import { CUSTOMER_TYPES, PROJECT_STATUSES, LOCATIONS } from "@/lib/constants";
import {
  Plus,
  FileSpreadsheet,
  Search,
  RotateCcw,
  Phone,
  Eye,
  Pencil,
  MoreHorizontal,
  Home,
  Building,
  Sprout,
  Factory,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
} from "lucide-react";
import { CreateCustomerModal } from "@/components/shared/modals/create-customer-modal";

export function CustomersClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = data.customers.filter((c: any) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.customerId.toLowerCase().includes(search.toLowerCase()) && !c.mobile.includes(search)) {
      return false;
    }
    if (selectedType !== "All Types" && c.customerType.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }
    if (selectedStatus !== "All Status" && c.projectStatus.toLowerCase() !== selectedStatus.toLowerCase().replace(/\s+/g, "_")) {
      return false;
    }
    if (selectedCity !== "All Locations" && c.city !== selectedCity) {
      return false;
    }
    return true;
  });

  const handleReset = () => {
    setSearch("");
    setSelectedType("All Types");
    setSelectedStatus("All Status");
    setSelectedCity("All Locations");
  };

  const renderTypeBadge = (type: string) => {
    const t = type.toLowerCase();
    if (t === "residential") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 border border-emerald-200">
          <Home className="h-3 w-3 text-emerald-600" />
          Residential
        </span>
      );
    }
    if (t === "commercial") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-800 border border-purple-200">
          <Building className="h-3 w-3 text-purple-600" />
          Commercial
        </span>
      );
    }
    if (t === "agricultural") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-800 border border-green-200">
          <Sprout className="h-3 w-3 text-green-600" />
          Agricultural
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 border border-slate-200">
        <Factory className="h-3 w-3 text-slate-600" />
        Industrial
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Customers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage customer details, installation history and payments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </button>

          <a
            href="/api/export/customers"
            download
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export Excel</span>
          </a>
        </div>
      </div>

      {/* Pastel KPI Cards Grid (Matches image1.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KPICard
          title="Total Customers"
          value={data.kpis.totalCustomers}
          change="+24 this month"
          isPositive={true}
          theme="green"
          iconName="users"
        />
        <KPICard
          title="New Customers"
          value={data.kpis.newCustomers}
          change="↑ +18.8%"
          isPositive={true}
          theme="blue"
          iconName="user"
        />
        <KPICard
          title="Installed Capacity"
          value={`${data.kpis.installedCapacity} kW`}
          subtext="(Total Completed)"
          subtextColor="neutral"
          theme="yellow"
          iconName="sun"
        />
        <KPICard
          title="Active Projects"
          value={data.kpis.activeProjects}
          subtext="(In Progress)"
          subtextColor="neutral"
          theme="purple"
          iconName="wrench"
        />
      </div>

      {/* Filter Bar (Matches image1.png) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, mobile or customer ID..."
              className="w-full h-9 rounded-lg border border-slate-200 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Customer Type Dropdown */}
          <div className="lg:col-span-3">
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
              Customer Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="All Types">All Types</option>
              {CUSTOMER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Project Status Dropdown */}
          <div className="lg:col-span-2">
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
              Project Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="All Status">All Status</option>
              {PROJECT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* City / Location Dropdown */}
          <div className="lg:col-span-2">
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
              City / Location
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="All Locations">All Locations</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="lg:col-span-1 flex items-end">
            <button
              onClick={handleReset}
              className="w-full mt-3.5 h-8 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-600 font-medium transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Customers Data Table (Matches image1.png) */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-3 w-10 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                </th>
                <th className="py-3 px-3">Customer ID</th>
                <th className="py-3 px-3">Customer Name</th>
                <th className="py-3 px-3">Mobile</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Solar Capacity</th>
                <th className="py-3 px-3">Project Status</th>
                <th className="py-3 px-3 text-right">Outstanding</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust: any) => (
                <tr
                  key={cust.id}
                  className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                  onClick={() => setSelectedCustomer(cust)}
                >
                  <td
                    className="py-3 px-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {cust.customerId}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900">
                    {cust.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-emerald-600" />
                      {cust.mobile}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {renderTypeBadge(cust.customerType)}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {cust.solarCapacity} kW
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={cust.projectStatus.replace("_", " ")} />
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {formatCurrency(cust.outstandingAmount)}
                  </td>
                  <td
                    className="py-3 px-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-1.5 text-slate-500">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        title="View Customer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Edit Customer"
                      >
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

        {/* Pagination Bar (Matches image1.png) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing 1-{Math.min(filteredCustomers.length, 8)} of {data.totalCount} customers
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`h-7 w-7 rounded-lg text-xs font-semibold ${
                  currentPage === pageNum
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setCurrentPage(31)}
              className="h-7 w-7 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              31
            </button>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(31)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Quick View Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  {selectedCustomer.customerId}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedCustomer.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-700 font-bold block text-[10px]">Mobile</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCustomer.mobile}
                  </span>
                </div>
                <div>
                  <span className="text-slate-700 font-bold block text-[10px]">City</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCustomer.city}, Odisha
                  </span>
                </div>
                <div>
                  <span className="text-slate-700 font-bold block text-[10px]">Solar Capacity</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCustomer.solarCapacity} kW
                  </span>
                </div>
                <div>
                  <span className="text-slate-700 font-bold block text-[10px]">Project Status</span>
                  <StatusBadge status={selectedCustomer.projectStatus.replace("_", " ")} />
                </div>
                <div>
                  <span className="text-slate-700 font-bold block text-[10px]">Outstanding Balance</span>
                  <span className="font-bold text-rose-700">
                    {formatCurrency(selectedCustomer.outstandingAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-700 font-bold block text-[10px]">Discom Consumer #</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCustomer.consumerNumber || "TPC-884102"}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700">Installation Address:</span>
                <p className="mt-0.5 text-slate-600">{selectedCustomer.address || "Bhubaneswar, Odisha"}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-lg border text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      <CreateCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetch("/api/customers")
            .then((res) => res.json())
            .then((d) => setData(d));
        }}
      />
    </div>
  );
}
