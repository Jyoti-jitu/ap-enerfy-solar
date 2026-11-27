"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Receipt, X, Loader2 } from "lucide-react";
import { SYSTEM_TYPES, INVOICE_TYPES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import {
  CustomerSelectCombobox,
  CustomerOption,
  NewCustomerFormState,
} from "@/components/invoices/customer-select-combobox";

export function CreateInvoiceModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState<NewCustomerFormState>({
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "",
    gstin: "",
    customerType: "residential",
  });

  const [formData, setFormData] = useState({
    customerId: "",
    invoiceType: "Tax Invoice",
    systemType: "On-Grid",
    capacity: 3,
    taxableAmount: 114286,
    taxRate: 5,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
    notes: "Payment due within 15 days of invoice date.",
  });

  useEffect(() => {
    if (isOpen) {
      fetch("/api/customers")
        .then((res) => res.json())
        .then((data) => {
          if (data?.customers && data.customers.length > 0) {
            setCustomers(data.customers);
            if (!selectedCustomer && !isNewCustomer) {
              setSelectedCustomer(data.customers[0]);
              setFormData((prev) => ({ ...prev, customerId: data.customers[0].id }));
            }
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const taxable = Number(formData.taxableAmount || 0);
  const tax = (taxable * Number(formData.taxRate || 5)) / 100;
  const total = taxable + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = { ...formData };
      if (isNewCustomer) {
        if (!newCustomerData.name.trim()) {
          throw new Error("Customer name is required");
        }
        if (!newCustomerData.mobile.trim()) {
          throw new Error("Customer mobile is required");
        }
        payload.customerId = "new";
        payload.newCustomer = {
          ...newCustomerData,
          solarCapacity: Number(formData.capacity || 3),
        };
      } else if (selectedCustomer) {
        payload.customerId = selectedCustomer.id;
      }

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create invoice");
      }

      router.refresh();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950">Create GST Invoice</h3>
              <p className="text-xs text-slate-700 font-medium">
                Tax Invoice, Proforma or Delivery Challan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Customer Typeahead & Quick Create */}
          <div>
            <CustomerSelectCombobox
              customers={customers}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={(c) => {
                setSelectedCustomer(c);
                if (c) setFormData((prev) => ({ ...prev, customerId: c.id }));
              }}
              isNewCustomer={isNewCustomer}
              onToggleNewCustomer={setIsNewCustomer}
              newCustomerData={newCustomerData}
              onChangeNewCustomer={(patch) =>
                setNewCustomerData((prev) => ({ ...prev, ...patch }))
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Invoice Type
              </label>
              <select
                value={formData.invoiceType}
                onChange={(e) => setFormData({ ...formData, invoiceType: e.target.value })}
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none bg-white"
              >
                {INVOICE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Solar System Type
              </label>
              <select
                value={formData.systemType}
                onChange={(e) => setFormData({ ...formData, systemType: e.target.value })}
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none bg-white"
              >
                {SYSTEM_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Capacity (kW)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: parseFloat(e.target.value) || 1 })
                }
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Taxable Amount (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.taxableAmount}
                onChange={(e) =>
                  setFormData({ ...formData, taxableAmount: parseFloat(e.target.value) || 0 })
                }
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                GST Tax Rate (%)
              </label>
              <select
                value={formData.taxRate}
                onChange={(e) =>
                  setFormData({ ...formData, taxRate: parseFloat(e.target.value) })
                }
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none bg-white"
              >
                <option value={5}>5% (Solar Plant / Standard)</option>
                <option value={12}>12% (Solar Devices)</option>
                <option value={18}>18% (Commercial / Services)</option>
              </select>
            </div>
          </div>

          {/* Tax Summary calculation banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-800 font-semibold">Taxable: </span>
              <span className="font-bold text-slate-950">{formatCurrency(taxable)}</span>
              <span className="text-slate-800 font-semibold ml-3">GST: </span>
              <span className="font-bold text-slate-950">{formatCurrency(tax)}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-900 font-bold">Total Invoice Value: </span>
              <span className="text-sm font-black text-emerald-900">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                required
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium shadow-sm disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Generate Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
