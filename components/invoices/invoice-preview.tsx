"use client";

import React, { useState, useRef, useEffect } from "react";
import { InvoiceViewModel } from "@/lib/invoices/types";
import { InvoiceToolbar } from "./invoice-toolbar";
import { InvoiceDocument } from "./invoice-document";

interface InvoicePreviewProps {
  model: InvoiceViewModel;
}

export function InvoicePreview({ model }: InvoicePreviewProps) {
  const [zoom, setZoom] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(2.0, Math.round((prev + 0.1) * 10) / 10));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.4, Math.round((prev - 0.1) * 10) / 10));
  const handleZoomReset = () => setZoom(1.0);

  const handleFitWidth = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 48; // padding
    // 210mm in pixels at 96 DPI is approximately 794px
    const a4WidthPx = 794;
    const calculatedZoom = Math.min(1.5, Math.max(0.5, containerWidth / a4WidthPx));
    setZoom(Math.round(calculatedZoom * 100) / 100);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 ${
        isFullscreen ? "fixed inset-0 z-50 overflow-auto" : ""
      }`}
    >
      {/* Top Controls Toolbar */}
      <InvoiceToolbar
        invoiceId={model.id}
        invoiceNumber={model.invoiceNumber}
        status={model.status}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onFitWidth={handleFitWidth}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Workspace Preview Canvas */}
      <div className="invoice-workspace-bg flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center">
        <div
          ref={sheetRef}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="shadow-2xl border border-slate-300 dark:border-slate-800 rounded-sm bg-white print:border-none print:shadow-none"
        >
          <InvoiceDocument model={model} />
        </div>
      </div>
    </div>
  );
}
