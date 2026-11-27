import React from "react";

interface InvoiceSignatureProps {
  companyName: string;
  designation?: string;
  signatoryName?: string;
}

export function InvoiceSignature({
  companyName,
  designation = "Authorized Signatory",
  signatoryName,
}: InvoiceSignatureProps) {
  return (
    <div className="border border-[#D5E0D5] rounded-md p-2 bg-white text-[9px] w-48 flex flex-col justify-between text-right">
      <div>
        <p className="text-[8px] text-[#6B7280] uppercase tracking-wider">For and on behalf of</p>
        <p className="font-extrabold text-[#145C32] text-[9.5px] leading-tight">{companyName}</p>
      </div>

      <div className="pt-8 text-center flex flex-col items-center">
        <div className="w-32 border-b border-dashed border-[#172B2A]/40 mb-1" />
        <p className="text-[8.5px] font-bold text-[#172B2A]">{designation}</p>
        <p className="text-[7.5px] text-[#6B7280] italic">
          (Digital / Physical Signature & Seal)
        </p>
      </div>
    </div>
  );
}
