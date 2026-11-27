import React from "react";

interface InvoiceTitleProps {
  title: string;
}

export function InvoiceTitle({ title }: InvoiceTitleProps) {
  return (
    <div className="my-3 relative">
      <div className="bg-[#145C32] text-white py-1.5 px-4 rounded-sm flex items-center justify-between shadow-sm">
        <div className="w-12 h-1 bg-[#FFC107] rounded-full hidden sm:block" />
        <h2 className="text-sm font-extrabold tracking-widest uppercase text-center flex-1">
          {title || "GST TAX INVOICE"}
        </h2>
        <div className="w-12 h-1 bg-[#FFC107] rounded-full hidden sm:block" />
      </div>
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#FFC107] to-transparent mt-0.5 opacity-60" />
    </div>
  );
}
