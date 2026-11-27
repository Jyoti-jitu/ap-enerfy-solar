import React from "react";
import Image from "next/image";
import { QrCode } from "lucide-react";
import { formatINR } from "./invoice-constants";

interface InvoicePaymentQrProps {
  qrCodeUrl?: string;
  upiId?: string;
  balanceAmount?: number;
  invoiceNumber?: string;
}

export function InvoicePaymentQr({
  qrCodeUrl,
  upiId,
  balanceAmount = 0,
  invoiceNumber,
}: InvoicePaymentQrProps) {
  if (!qrCodeUrl || balanceAmount <= 0) {
    return (
      <div className="border border-[#D5E0D5] rounded-md p-2 bg-[#F9FAFB] flex flex-col items-center justify-center text-center w-28">
        <div className="w-8 h-8 rounded-full bg-[#E8F3E5] flex items-center justify-center text-[#145C32] mb-1">
          ✓
        </div>
        <p className="font-bold text-[#145C32] text-[9px] uppercase tracking-wider">Fully Paid</p>
        <p className="text-[8px] text-[#6B7280] mt-0.5">Zero Balance Due</p>
      </div>
    );
  }

  return (
    <div className="border border-[#559C32] rounded-md p-2 bg-[#E8F3E5]/50 flex flex-col items-center justify-between text-center w-28">
      <div className="flex items-center gap-1 text-[#145C32] font-extrabold text-[8.5px] uppercase tracking-wider mb-1">
        <QrCode className="w-3 h-3 text-[#145C32]" />
        <span>Scan & Pay</span>
      </div>

      <div className="w-20 h-20 bg-white p-1 rounded border border-[#D5E0D5] shadow-sm flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrCodeUrl}
          alt={`UPI QR for ${invoiceNumber || "Invoice"}`}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="mt-1 text-[8px] leading-tight text-[#172B2A]">
        <span className="font-bold text-[#145C32] block font-mono">
          {formatINR(balanceAmount)}
        </span>
        <span className="text-[7.5px] text-[#6B7280] block mt-0.5">
          UPI / GPay / PhonePe
        </span>
      </div>
    </div>
  );
}
