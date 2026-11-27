import React from "react";
import { CustomerViewModel, ShippingAddressViewModel } from "@/lib/invoices/types";

interface InvoiceCustomerDetailsProps {
  customer: CustomerViewModel;
  shippingAddress?: ShippingAddressViewModel;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  salesOrderNumber?: string;
  quotationRef?: string;
  projectRef?: string;
  placeOfSupply: string;
  stateCode: string;
  reverseCharge?: string;
}

export function InvoiceCustomerDetails({
  customer,
  shippingAddress,
  invoiceNumber,
  invoiceDate,
  dueDate,
  salesOrderNumber,
  quotationRef,
  projectRef,
  placeOfSupply,
  stateCode,
  reverseCharge = "No",
}: InvoiceCustomerDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-3 text-[10px]">
      {/* Left Column: Billed To / Shipped To */}
      <div className="border border-[#D5E0D5] rounded-md p-2.5 bg-[#F9FAFB]/70 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[#D5E0D5] pb-1 mb-1.5">
            <span className="font-extrabold uppercase tracking-wider text-[#145C32] text-[10px]">
              Bill To (Customer Details)
            </span>
            <span className="text-[9px] text-[#559C32] font-semibold bg-[#E8F3E5] px-1.5 py-0.5 rounded">
              ID: {customer.id}
            </span>
          </div>

          <p className="font-bold text-[#172B2A] text-[11px]">{customer.name}</p>
          {customer.companyName && (
            <p className="font-medium text-[#4B5563] text-[10px]">{customer.companyName}</p>
          )}

          <p className="text-[#374151] mt-0.5 leading-relaxed">{customer.address}</p>
          <p className="text-[#374151]">
            {customer.city}, {customer.state}
            {customer.pincode ? ` - ${customer.pincode}` : ""}
          </p>

          <div className="mt-1.5 pt-1.5 border-t border-[#E5E7EB] grid grid-cols-2 gap-1 text-[9.5px]">
            <div>
              <span className="text-[#6B7280]">Mobile:</span>{" "}
              <span className="font-semibold text-[#172B2A]">{customer.phone}</span>
            </div>
            {customer.email && (
              <div>
                <span className="text-[#6B7280]">Email:</span>{" "}
                <span className="font-medium text-[#172B2A]">{customer.email}</span>
              </div>
            )}
            {customer.gstin ? (
              <div className="col-span-2">
                <span className="text-[#6B7280]">GSTIN:</span>{" "}
                <span className="font-mono font-bold text-[#145C32]">{customer.gstin}</span>
              </div>
            ) : (
              <div>
                <span className="text-[#6B7280]">GSTIN:</span>{" "}
                <span className="text-[#9CA3AF] italic">Unregistered</span>
              </div>
            )}
            {customer.pan && (
              <div>
                <span className="text-[#6B7280]">PAN:</span>{" "}
                <span className="font-mono font-bold text-[#172B2A]">{customer.pan}</span>
              </div>
            )}
          </div>
        </div>

        {shippingAddress && (
          <div className="mt-2 pt-1.5 border-t border-dashed border-[#D5E0D5]">
            <p className="font-bold text-[#145C32] text-[9.5px] uppercase tracking-wider mb-0.5">
              Ship / Installation Site Address:
            </p>
            <p className="text-[#4B5563] text-[9.5px] leading-snug">
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
            </p>
          </div>
        )}
      </div>

      {/* Right Column: Invoice Metadata */}
      <div className="border border-[#D5E0D5] rounded-md p-2.5 bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[#D5E0D5] pb-1 mb-1.5">
            <span className="font-extrabold uppercase tracking-wider text-[#145C32] text-[10px]">
              Invoice Details
            </span>
            <span className="font-mono font-bold text-[#145C32] text-[11px] bg-[#E8F3E5] px-2 py-0.5 rounded">
              {invoiceNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px]">
            <div>
              <p className="text-[#6B7280] text-[9px] uppercase tracking-wider">Invoice Date</p>
              <p className="font-bold text-[#172B2A]">{invoiceDate}</p>
            </div>
            <div>
              <p className="text-[#6B7280] text-[9px] uppercase tracking-wider">Due Date</p>
              <p className="font-bold text-[#172B2A]">{dueDate}</p>
            </div>

            <div>
              <p className="text-[#6B7280] text-[9px] uppercase tracking-wider">Place of Supply</p>
              <p className="font-medium text-[#172B2A]">{placeOfSupply}</p>
            </div>
            <div>
              <p className="text-[#6B7280] text-[9px] uppercase tracking-wider">State Code</p>
              <p className="font-mono font-bold text-[#172B2A]">{stateCode}</p>
            </div>

            {quotationRef && (
              <div>
                <p className="text-[#6B7280] text-[9px] uppercase tracking-wider">Quotation Ref</p>
                <p className="font-medium text-[#172B2A] font-mono">{quotationRef}</p>
              </div>
            )}
            {salesOrderNumber && (
              <div>
                <p className="text-[#6B7280] text-[9px] uppercase tracking-wider">Sales Order #</p>
                <p className="font-medium text-[#172B2A] font-mono">{salesOrderNumber}</p>
              </div>
            )}
            {projectRef && (
              <div>
                <p className="text-[#6B7280] text-[9px] uppercase tracking-wider">Project Ref</p>
                <p className="font-medium text-[#172B2A] font-mono">{projectRef}</p>
              </div>
            )}
            <div>
              <p className="text-[#6B7280] text-[9px] uppercase tracking-wider">Reverse Charge</p>
              <p className="font-medium text-[#172B2A]">{reverseCharge}</p>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-1.5 border-t border-[#E5E7EB] flex items-center justify-between text-[9px] text-[#6B7280]">
          <span>Payment Term: Immediate / Due on Receipt</span>
          <span>Currency: INR (₹)</span>
        </div>
      </div>
    </div>
  );
}
