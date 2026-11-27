"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sun, X, Loader2 } from "lucide-react";
import { SYSTEM_TYPES, LOCATIONS } from "@/lib/constants";

export function CreateProjectModal({
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

  const [formData, setFormData] = useState({
    customerId: "",
    location: "Bhubaneswar",
    systemType: "On-Grid",
    capacity: 3,
    startDate: new Date().toISOString().split("T")[0],
    targetEndDate: new Date(Date.now() + 20 * 86400000).toISOString().split("T")[0],
    status: "In Progress",
    assignedTeam: "Team Alpha (Solar Techs)",
    discomApplicationNumber: "TPC-APP-9021",
  });

  useEffect(() => {
    if (isOpen) {
      fetch("/api/customers")
        .then((res) => res.json())
        .then((data) => {
          if (data?.customers) {
            setCustomers(data.customers);
            if (data.customers.length > 0 && !formData.customerId) {
              setFormData((prev) => ({ ...prev, customerId: data.customers[0].id }));
            }
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create project");
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
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950">New Solar Project</h3>
              <p className="text-xs text-slate-700 font-medium">
                Track installation from survey to grid synchronization
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
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Select Customer *
            </label>
            <select
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.customerId}) - {c.city}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                System Type
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
                Site Location / City
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none bg-white"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Assigned Team
              </label>
              <input
                type="text"
                value={formData.assignedTeam}
                onChange={(e) => setFormData({ ...formData, assignedTeam: e.target.value })}
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Target Commissioning Date
              </label>
              <input
                type="date"
                required
                value={formData.targetEndDate}
                onChange={(e) => setFormData({ ...formData, targetEndDate: e.target.value })}
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Discom Net Metering App No.
            </label>
            <input
              type="text"
              value={formData.discomApplicationNumber}
              onChange={(e) => setFormData({ ...formData, discomApplicationNumber: e.target.value })}
              className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-emerald-600 focus:outline-none"
            />
          </div>

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
              <span>Launch Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
