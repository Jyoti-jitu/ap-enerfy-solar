"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/components/invoices/invoice-constants";

interface EditInvoiceClientProps {
  invoice: any;
}

export function EditInvoiceClient({ invoice }: EditInvoiceClientProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState(invoice.status || "Pending");
  const [dueDate, setDueDate] = useState(
    invoice.dueDate ? new Date(invoice.dueDate).toISOString().split("T")[0] : ""
  );
  const [paidAmount, setPaidAmount] = useState(String(invoice.paidAmount || "0"));
  const [notes, setNotes] = useState(invoice.notes || "");
  const [terms, setTerms] = useState(invoice.terms || "");

  const totalAmt = Number(invoice.totalAmount || 0);
  const paidAmt = Number(paidAmount || 0);
  const balanceAmt = Math.max(0, totalAmt - paidAmt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          dueDate: new Date(dueDate),
          paidAmount: String(paidAmt),
          balanceAmount: String(balanceAmt),
          notes,
          terms,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to update invoice");
      }

      router.push(`/invoices/${invoice.id}/preview`);
    } catch (err: any) {
      console.error("Update invoice error:", err);
      setError(err.message || "Failed to update invoice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href={`/invoices/${invoice.id}`}>
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold font-mono text-slate-900">
              Edit {invoice.invoiceNumber}
            </h1>
            <p className="text-xs text-slate-500">
              Update payment progress, due dates, terms or invoice status
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="bg-[#145C32] hover:bg-[#145C32]/90 text-white font-semibold gap-1.5 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? "Updating..." : "Save Changes"}</span>
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Edit Form Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#145C32]" />
          Invoice Status & Payment Progress
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Invoice Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-xs font-semibold text-slate-900"
            >
              <option value="Pending">Pending Payment</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid">Paid in Full</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Payment Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Amount Paid (₹)</Label>
            <Input
              type="number"
              step="0.01"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="h-9 text-xs font-mono"
            />
          </div>

          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Remaining Balance</Label>
            <div className="h-9 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center font-mono font-bold text-[#145C32]">
              {formatINR(balanceAmt)}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-3">
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
            <Label className="text-xs text-slate-600 mb-1 block">Notes / Payment Reference</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-9 text-xs"
              placeholder="e.g. UTR / IMPS Reference #9821389"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
