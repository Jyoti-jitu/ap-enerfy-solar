import React from "react";
import { CompanyViewModel } from "@/lib/invoices/types";
import { Sun, Zap } from "lucide-react";

interface InvoiceHeaderProps {
  company: CompanyViewModel;
}

export function InvoiceHeader({ company }: InvoiceHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-start pb-4 border-b border-[#D5E0D5]">
      {/* Left Column: Brand Logo & Tagline */}
      <div className="flex items-start gap-3.5 max-w-[55%]">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#145C32] to-[#559C32] p-2 flex items-center justify-center shadow-sm relative flex-shrink-0">
          <Sun className="w-8 h-8 text-[#FFC107] animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FFC107] flex items-center justify-center">
            <Zap className="w-3 h-3 text-[#145C32] fill-current" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-extrabold tracking-tight text-[#145C32]">
              {company.name}
            </h1>
          </div>
          <p className="text-[11px] font-semibold text-[#559C32] uppercase tracking-wider mt-0.5">
            {company.tagline || "Clean Energy. Smart Business."}
          </p>
          <p className="text-[10px] text-[#4B5563] mt-1 font-medium">
            {company.legalName}
          </p>
        </div>
      </div>

      {/* Right Column: Registered Office & Tax IDs */}
      <div className="text-right text-[10px] text-[#172B2A] leading-relaxed max-w-[45%]">
        <p className="font-semibold text-[#145C32] text-[11px] mb-0.5">
          Registered Office
        </p>
        <p className="text-[#374151]">{company.address}</p>
        <p className="text-[#374151]">
          {company.city}, {company.state} - {company.pincode}
        </p>
        <p className="text-[#374151] mt-0.5">
          <span className="font-medium">Phone:</span> {company.phone} &bull;{" "}
          <span className="font-medium">Email:</span> {company.email}
        </p>
        <div className="mt-1 pt-1 border-t border-[#E5E7EB] flex flex-wrap justify-end gap-x-2 text-[9.5px]">
          <span className="font-semibold text-[#145C32]">
            GSTIN: <span className="font-mono text-[#172B2A] font-bold">{company.gstin}</span>
          </span>
          <span className="text-[#9CA3AF]">|</span>
          <span className="font-semibold text-[#145C32]">
            PAN: <span className="font-mono text-[#172B2A] font-bold">{company.pan}</span>
          </span>
          {company.cin && (
            <>
              <span className="text-[#9CA3AF]">|</span>
              <span className="text-[#6B7280]">CIN: {company.cin}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
