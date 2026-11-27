"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Sun,
  FileText,
  Calculator,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/components/invoices/invoice-constants";
import { calculateInvoice, LineItemInput } from "@/lib/invoices/calculate-invoice";
import { amountInWords } from "@/lib/invoices/amount-in-words";

interface CustomerOption {
  id: string;
  name: string;
  city: string;
  state: string;
  solarCapacity?: string | null;
}

interface CreateInvoiceClientProps {
  customers: CustomerOption[];
}

export function CreateInvoiceClient({ customers }: CreateInvoiceClientProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerId, setCustomerId] = useState(customers[0]?.id || "");
  const [invoiceType, setInvoiceType] = useState("Tax Invoice");
  const [systemType, setSystemType] = useState("On-Grid");
  const [capacity, setCapacity] = useState("3.00");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(
    "1. Warranty covers solar modules for 25 years performance. 2. Inverter warranty 5 years. 3. Net metering subject to DISCOM inspection approval."
  );

  const [items, setItems] = useState<LineItemInput[]>([
    {
      description: "Mono PERC Half-Cut 550W High-Efficiency Solar PV Modules",
      hsnCode: "85414011",
      quantity: 6,
      unit: "Nos",
      unitPrice: 14285,
      discount: 0,
      gstRate: 5,
    },
    {
      description: "On-Grid Solar String Inverter 3.3kW Single Phase with WiFi Monitoring & BOS Kit",
      hsnCode: "85044090",
      quantity: 1,
      unit: "Set",
      unitPrice: 28571,
      discount: 0,
      gstRate: 12,
    },
  ]);

  const selectedCustomer = customers.find((c) => c.id === customerId);
  const isInterState =
    selectedCustomer &&
    selectedCustomer.state.trim().toLowerCase() !== "odisha" &&
    selectedCustomer.state.trim().toLowerCase() !== "";

  const calculations = calculateInvoice({
    items,
    isInterState: Boolean(isInterState),
  });

  const words = amountInWords(calculations.grandTotal);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        description: "",
        hsnCode: "85414011",
        quantity: 1,
        unit: "Nos",
        unitPrice: 0,
        discount: 0,
        gstRate: 5,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: keyof LineItemInput, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      setError("Please select a customer");
      return;
    }
    if (items.length === 0) {
      setError("Please add at least one line item");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        customerId,
        invoiceType,
        systemType,
        capacity: parseFloat(capacity) || 3.0,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        taxableAmount: calculations.taxableAmount,
        notes,
        terms,
        items: items.map((it) => ({
          description: it.description || "Solar Equipment",
          hsnCode: it.hsnCode || "85414011",
          quantity: Number(it.quantity) || 1,
          unit: it.unit || "Nos",
          unitPrice: Number(it.unitPrice) || 0,
          discount: Number(it.discount) || 0,
          taxRate: Number(it.gstRate) || 5,
        })),
      };

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to create invoice");
      }

      const created = await res.json();
      router.push(`/invoices/${created.id}/preview`);
    } catch (err: any) {
      console.error("Create invoice error:", err);
      setError(err.message || "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href="/invoices">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Invoices</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Create New Invoice</h1>
            <p className="text-xs text-slate-500">
              Generates a GST-compliant tax invoice with automatic calculations
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="bg-[#145C32] hover:bg-[#145C32]/90 text-white font-semibold gap-1.5 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? "Saving & Generating..." : "Save & Open A4 Preview"}</span>
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Invoice Details Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#145C32]" />
          Invoice & Customer Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Customer *</Label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#145C32]"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city}, {c.state})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Document Type</Label>
            <select
              value={invoiceType}
              onChange={(e) => setInvoiceType(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#145C32]"
            >
              <option value="Tax Invoice">Tax Invoice</option>
              <option value="Proforma">Proforma Invoice</option>
              <option value="Advance Invoice">Advance Invoice</option>
              <option value="Delivery Challan">Delivery Challan</option>
            </select>
          </div>

          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Invoice Date</Label>
            <Input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="h-9 text-xs"
              suppressHydrationWarning
              required
            />
          </div>

          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-9 text-xs"
              suppressHydrationWarning
              required
            />
          </div>
        </div>

        {/* Solar System Specs */}
        <div className="p-3 bg-[#E8F3E5]/60 border border-[#559C32]/40 rounded-lg">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#145C32] mb-3">
            <Sun className="w-4 h-4 text-[#FFC107] fill-current" />
            <span>Solar Plant Specifications (Optional)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-[11px] text-slate-600 mb-1 block">Capacity (kW)</Label>
              <Input
                type="number"
                step="0.1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="h-8 text-xs bg-white"
                placeholder="e.g. 3.0"
              />
            </div>
            <div>
              <Label className="text-[11px] text-slate-600 mb-1 block">System Type</Label>
              <select
                value={systemType}
                onChange={(e) => setSystemType(e.target.value)}
                className="w-full h-8 px-2 rounded-md border border-slate-300 bg-white text-xs text-slate-900"
              >
                <option value="On-Grid">On-Grid Grid-Tied</option>
                <option value="Hybrid">Hybrid with Battery</option>
                <option value="Off-Grid">Off-Grid Standalone</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Table Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#145C32]" />
            Itemized Goods & Services
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            className="gap-1 h-8 text-xs border-[#145C32] text-[#145C32] hover:bg-[#E8F3E5]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </Button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#145C32] text-white font-semibold">
              <tr>
                <th className="py-2 px-3 w-8">#</th>
                <th className="py-2 px-3 min-w-[200px]">Description</th>
                <th className="py-2 px-2 w-24">HSN/SAC</th>
                <th className="py-2 px-2 w-16">Qty</th>
                <th className="py-2 px-2 w-16">Unit</th>
                <th className="py-2 px-2 w-24 text-right">Rate (₹)</th>
                <th className="py-2 px-2 w-20 text-center">GST %</th>
                <th className="py-2 px-3 w-28 text-right">Taxable</th>
                <th className="py-2 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {items.map((it, idx) => {
                const itemTaxable = Math.max(0, (it.quantity || 1) * (it.unitPrice || 0) - (it.discount || 0));
                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-500 font-medium">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <Input
                        value={it.description}
                        onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                        className="h-8 text-xs"
                        placeholder="Item name / specs"
                        required
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        value={it.hsnCode}
                        onChange={(e) => handleItemChange(idx, "hsnCode", e.target.value)}
                        className="h-8 text-xs font-mono"
                        placeholder="85414011"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", parseFloat(e.target.value) || 1)}
                        className="h-8 text-xs text-center"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        value={it.unit}
                        onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                        className="h-8 text-xs text-center"
                        placeholder="Nos"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={it.unitPrice}
                        onChange={(e) => handleItemChange(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs text-right font-mono"
                        required
                      />
                    </td>
                    <td className="py-2 px-2">
                      <select
                        value={it.gstRate}
                        onChange={(e) => handleItemChange(idx, "gstRate", parseFloat(e.target.value) || 0)}
                        className="w-full h-8 px-1 rounded-md border border-slate-300 text-xs text-center font-semibold text-[#145C32]"
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                      {formatINR(itemTaxable)}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Live Calculation Summary */}
        <div className="flex flex-col md:flex-row justify-between gap-6 pt-3 border-t border-slate-200">
          <div className="space-y-3 flex-1 text-xs">
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Terms & Conditions</Label>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={3}
                className="w-full p-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#145C32]"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Special Notes</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-8 text-xs"
                placeholder="e.g. Advance 50% paid via Cheque #10245"
              />
            </div>
            <div className="p-2.5 bg-[#F9FAFB] border border-[#D5E0D5] rounded text-slate-700 italic">
              <strong className="text-[#145C32] not-italic">Amount in Words: </strong>
              {words}
            </div>
          </div>

          <div className="w-full md:w-72 bg-[#F9FAFB] p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Taxable Value:</span>
              <span className="font-mono text-slate-900">{formatINR(calculations.taxableAmount)}</span>
            </div>

            {!isInterState ? (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>CGST:</span>
                  <span className="font-mono text-slate-900">{formatINR(calculations.cgstAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST:</span>
                  <span className="font-mono text-slate-900">{formatINR(calculations.sgstAmount)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-slate-600">
                <span>IGST:</span>
                <span className="font-mono text-slate-900">{formatINR(calculations.igstAmount)}</span>
              </div>
            )}

            {calculations.roundOff !== 0 && (
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Round-off:</span>
                <span className="font-mono">
                  {calculations.roundOff > 0 ? `+${calculations.roundOff.toFixed(2)}` : calculations.roundOff.toFixed(2)}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-[#145C32] bg-[#E8F3E5] p-2 rounded">
              <span>Grand Total:</span>
              <span className="font-mono text-base">{formatINR(calculations.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
