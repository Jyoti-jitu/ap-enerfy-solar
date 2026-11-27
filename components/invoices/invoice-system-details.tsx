import React from "react";
import { SolarSystemDetailsViewModel } from "@/lib/invoices/types";
import { SunMedium, Zap, BatteryCharging, Gauge, MapPin } from "lucide-react";

interface InvoiceSystemDetailsProps {
  details?: SolarSystemDetailsViewModel;
}

export function InvoiceSystemDetails({ details }: InvoiceSystemDetailsProps) {
  if (!details || !details.capacity) return null;

  return (
    <div className="mb-3 rounded-md border border-[#559C32] bg-[#E8F3E5]/60 p-2.5 text-[9.5px]">
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#559C32]/30">
        <div className="flex items-center gap-1.5 text-[#145C32] font-bold uppercase tracking-wider text-[10px]">
          <SunMedium className="w-3.5 h-3.5 text-[#FFC107] fill-current" />
          <span>Solar System Specifications & Technical Details</span>
        </div>
        <span className="bg-[#145C32] text-white font-semibold text-[9px] px-2 py-0.5 rounded">
          {details.systemType} System
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-[#172B2A]">
        <div>
          <span className="text-[#4B5563] text-[8.5px] uppercase block">Plant Capacity</span>
          <span className="font-bold text-[#145C32] text-[10.5px]">{details.capacity}</span>
        </div>
        <div>
          <span className="text-[#4B5563] text-[8.5px] uppercase block">Solar PV Modules</span>
          <span className="font-semibold text-[#172B2A]">
            {details.panelCount ? `${details.panelCount} (${details.panelWattage || "550W"})` : "Mono PERC"}
          </span>
        </div>
        <div>
          <span className="text-[#4B5563] text-[8.5px] uppercase block">Inverter Details</span>
          <span className="font-semibold text-[#172B2A]">{details.inverterCapacity || "Grid-Tied String"}</span>
        </div>
        <div>
          <span className="text-[#4B5563] text-[8.5px] uppercase block">Est. Daily Generation</span>
          <span className="font-semibold text-[#559C32]">
            {details.estimatedGeneration || "~4.2 Units/kW/Day (Est.)"}
          </span>
        </div>
      </div>

      {(details.location || details.projectReference) && (
        <div className="mt-1.5 pt-1.5 border-t border-[#559C32]/20 flex items-center justify-between text-[9px] text-[#4B5563]">
          {details.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#559C32]" />
              <span>Installation Site: <strong className="text-[#172B2A]">{details.location}</strong></span>
            </div>
          )}
          {details.projectReference && (
            <div>
              <span>Project ID: <strong className="font-mono text-[#145C32]">{details.projectReference}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
