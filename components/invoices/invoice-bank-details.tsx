import React from "react";
import { BankDetailsViewModel } from "@/lib/invoices/types";
import { Landmark } from "lucide-react";

interface InvoiceBankDetailsProps {
  bankDetails?: BankDetailsViewModel;
}

export function InvoiceBankDetails({ bankDetails }: InvoiceBankDetailsProps) {
  if (!bankDetails) return null;

  return (
    <div className="border border-[#D5E0D5] rounded-md p-2 bg-[#F9FAFB]/90 text-[9px] flex-1">
      <div className="flex items-center gap-1.5 pb-1 mb-1 border-b border-[#D5E0D5] text-[#145C32] font-bold uppercase tracking-wider text-[9.5px]">
        <Landmark className="w-3.5 h-3.5 text-[#559C32]" />
        <span>Bank Details & Direct Transfer</span>
      </div>

      <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[#172B2A]">
        <div>
          <span className="text-[#6B7280] block text-[8px] uppercase">Bank Name</span>
          <span className="font-bold text-[#145C32]">{bankDetails.bankName}</span>
        </div>
        <div>
          <span className="text-[#6B7280] block text-[8px] uppercase">Account Name</span>
          <span className="font-semibold truncate block">{bankDetails.accountName}</span>
        </div>
        <div>
          <span className="text-[#6B7280] block text-[8px] uppercase">Account Number</span>
          <span className="font-mono font-bold text-[#172B2A] text-[9.5px]">{bankDetails.accountNumber}</span>
        </div>
        <div>
          <span className="text-[#6B7280] block text-[8px] uppercase">IFSC Code</span>
          <span className="font-mono font-bold text-[#145C32]">{bankDetails.ifscCode}</span>
        </div>
        {bankDetails.branchName && (
          <div>
            <span className="text-[#6B7280] block text-[8px] uppercase">Branch</span>
            <span className="text-[#374151] truncate block">{bankDetails.branchName}</span>
          </div>
        )}
        {bankDetails.upiId && (
          <div>
            <span className="text-[#6B7280] block text-[8px] uppercase">Official UPI ID</span>
            <span className="font-mono font-semibold text-[#16A34A]">{bankDetails.upiId}</span>
          </div>
        )}
      </div>

      {bankDetails.acceptedModes && (
        <p className="mt-1 pt-1 border-t border-[#E5E7EB] text-[8px] text-[#6B7280]">
          Accepted: {bankDetails.acceptedModes}
        </p>
      )}
    </div>
  );
}
