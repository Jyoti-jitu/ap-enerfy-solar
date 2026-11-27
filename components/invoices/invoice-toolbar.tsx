"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Edit3,
  CreditCard,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InvoiceToolbarProps {
  invoiceId: string;
  invoiceNumber: string;
  status: string;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onFitWidth: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function InvoiceToolbar({
  invoiceId,
  invoiceNumber,
  status,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitWidth,
  isFullscreen,
  onToggleFullscreen,
}: InvoiceToolbarProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const res = await fetch(`/api/invoices/${invoiceId}/pdf`);
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("PDF download error:", err);
      // Fallback to direct navigation or window.open
      window.open(`/api/invoices/${invoiceId}/pdf`, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const getStatusBadge = () => {
    const s = (status || "").toLowerCase();
    if (s === "paid") {
      return (
        <Badge className="bg-[#145C32] hover:bg-[#145C32]/90 text-white flex items-center gap-1 font-semibold text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Paid
        </Badge>
      );
    }
    if (s === "overdue") {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 font-semibold text-xs">
          <AlertTriangle className="w-3.5 h-3.5" />
          Overdue
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 font-semibold text-xs">
        <Clock className="w-3.5 h-3.5" />
        {status || "Pending"}
      </Badge>
    );
  };

  return (
    <div className="invoice-toolbar-root bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 gap-1.5 border-slate-300 dark:border-slate-700 hover:bg-slate-100"
          >
            <Link href="/invoices">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Invoices</span>
            </Link>
          </Button>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#145C32]" />
            <span className="font-extrabold text-slate-900 dark:text-slate-100 font-mono text-sm">
              {invoiceNumber}
            </span>
            {getStatusBadge()}
          </div>
        </div>

        {/* Center: Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomOut}
            title="Zoom Out"
            className="h-7 w-7 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>

          <button
            onClick={onZoomReset}
            title="Reset Zoom"
            className="text-xs font-mono font-medium px-2 py-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
          >
            {Math.round(zoom * 100)}%
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomIn}
            title="Zoom In"
            className="h-7 w-7 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-600 mx-0.5" />

          <Button
            variant="ghost"
            size="sm"
            onClick={onFitWidth}
            className="h-7 px-2 text-xs text-slate-600 dark:text-slate-300"
          >
            Fit Width
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
            className="h-7 w-7 text-slate-600 dark:text-slate-300"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>

        {/* Right: Print / Download / Share / Actions */}
        <div className="flex items-center gap-2">
          {status !== "Paid" && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 gap-1.5 border-slate-300 dark:border-slate-700 text-slate-700 hover:bg-slate-100"
            >
              <Link href={`/invoices/${invoiceId}/edit`}>
                <Edit3 className="w-3.5 h-3.5 text-[#559C32]" />
                <span className="hidden md:inline">Edit</span>
              </Link>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8 gap-1.5 border-slate-300 dark:border-slate-700 text-slate-700 hover:bg-slate-100"
          >
            <Share2 className="w-3.5 h-3.5 text-[#559C32]" />
            <span className="hidden md:inline">{copied ? "Link Copied!" : "Share"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-8 gap-1.5 border-slate-300 dark:border-slate-700 text-slate-700 hover:bg-slate-100"
          >
            <Printer className="w-3.5 h-3.5 text-[#145C32]" />
            <span className="hidden sm:inline">Print</span>
          </Button>

          <Button
            size="sm"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="h-8 gap-1.5 bg-[#145C32] hover:bg-[#145C32]/90 text-white font-medium shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? "Generating..." : "Download PDF"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
