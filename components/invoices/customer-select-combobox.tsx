"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  UserPlus,
  Check,
  ChevronDown,
  X,
  Building,
  Phone,
  MapPin,
  FileCheck2,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface CustomerOption {
  id: string;
  name: string;
  customerId?: string | null;
  mobile?: string | null;
  email?: string | null;
  address?: string | null;
  city: string;
  state: string;
  pincode?: string | null;
  gstin?: string | null;
  solarCapacity?: string | null;
  customerType?: string | null;
}

export interface NewCustomerFormState {
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  customerType: string;
}

interface CustomerSelectComboboxProps {
  customers: CustomerOption[];
  selectedCustomer: CustomerOption | null;
  onSelectCustomer: (customer: CustomerOption | null) => void;
  isNewCustomer: boolean;
  onToggleNewCustomer: (isNew: boolean) => void;
  newCustomerData: NewCustomerFormState;
  onChangeNewCustomer: (data: Partial<NewCustomerFormState>) => void;
}

const INDIAN_STATES = [
  "Odisha",
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export function CustomerSelectCombobox({
  customers,
  selectedCustomer,
  onSelectCustomer,
  isNewCustomer,
  onToggleNewCustomer,
  newCustomerData,
  onChangeNewCustomer,
}: CustomerSelectComboboxProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter customers based on search term letters
  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return customers.slice(0, 15);
    return customers.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(q);
      const codeMatch = c.customerId?.toLowerCase().includes(q);
      const mobileMatch = c.mobile?.toLowerCase().includes(q);
      const cityMatch = c.city?.toLowerCase().includes(q);
      const gstinMatch = c.gstin?.toLowerCase().includes(q);
      return nameMatch || codeMatch || mobileMatch || cityMatch || gstinMatch;
    });
  }, [customers, searchTerm]);

  const handleSelect = (customer: CustomerOption) => {
    onToggleNewCustomer(false);
    onSelectCustomer(customer);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleStartCreateNew = (initialName?: string) => {
    const nameToUse = (initialName || searchTerm).trim();
    onSelectCustomer(null);
    onToggleNewCustomer(true);
    onChangeNewCustomer({
      name: nameToUse,
      city: newCustomerData.city || "Bhubaneswar",
      state: newCustomerData.state || "Odisha",
    });
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onSelectCustomer(null);
    onToggleNewCustomer(false);
    setSearchTerm("");
    setTimeout(() => {
      inputRef.current?.focus();
      setIsOpen(true);
    }, 50);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    const totalOptions = filteredCustomers.length + (searchTerm.trim() ? 1 : 0);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < totalOptions ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalOptions - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredCustomers.length) {
        handleSelect(filteredCustomers[highlightedIndex]);
      } else if (searchTerm.trim()) {
        handleStartCreateNew(searchTerm);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full space-y-3" ref={containerRef}>
      {/* CASE 1: New Customer Creation Mode */}
      {isNewCustomer ? (
        <div className="rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50/90 via-emerald-50/50 to-white p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  New Customer Registration
                  <Badge variant="outline" className="bg-emerald-100/80 text-emerald-800 border-emerald-300 text-[10px] font-semibold py-0">
                    Auto-created on invoice save
                  </Badge>
                </h4>
                <p className="text-[11px] text-slate-500">
                  This customer will be automatically saved to your customer directory and linked to this invoice.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
              className="text-xs text-slate-600 hover:text-slate-900 gap-1 self-start sm:self-auto h-7 px-2.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Select Existing Customer Instead</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <Label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                Customer / Company Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g. Ramesh Patel or Skyview Enterprises"
                value={newCustomerData.name}
                onChange={(e) => onChangeNewCustomer({ name: e.target.value })}
                className="h-8 text-xs bg-white border-slate-300 focus:ring-1 focus:ring-[#145C32]"
                required
              />
            </div>

            <div>
              <Label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                Mobile Number <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="tel"
                placeholder="e.g. 98765 43210"
                value={newCustomerData.mobile}
                onChange={(e) => onChangeNewCustomer({ mobile: e.target.value })}
                className="h-8 text-xs bg-white border-slate-300 focus:ring-1 focus:ring-[#145C32]"
                required
              />
            </div>

            <div>
              <Label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="e.g. ramesh@example.com"
                value={newCustomerData.email}
                onChange={(e) => onChangeNewCustomer({ email: e.target.value })}
                className="h-8 text-xs bg-white border-slate-300"
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                Billing & Site Address <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g. Plot 42, Infocity Road, Patia"
                value={newCustomerData.address}
                onChange={(e) => onChangeNewCustomer({ address: e.target.value })}
                className="h-8 text-xs bg-white border-slate-300 focus:ring-1 focus:ring-[#145C32]"
                required
              />
            </div>

            <div>
              <Label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                City <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g. Bhubaneswar"
                value={newCustomerData.city}
                onChange={(e) => onChangeNewCustomer({ city: e.target.value })}
                className="h-8 text-xs bg-white border-slate-300"
                required
              />
            </div>

            <div>
              <Label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                State <span className="text-rose-500">*</span>
              </Label>
              <select
                value={newCustomerData.state}
                onChange={(e) => onChangeNewCustomer({ state: e.target.value })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#145C32]"
                required
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                PIN Code
              </Label>
              <Input
                type="text"
                placeholder="e.g. 751024"
                value={newCustomerData.pincode}
                onChange={(e) => onChangeNewCustomer({ pincode: e.target.value })}
                className="h-8 text-xs bg-white border-slate-300"
              />
            </div>

            <div>
              <Label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                GSTIN (Optional)
              </Label>
              <Input
                type="text"
                placeholder="e.g. 21AAAAA0000A1Z5"
                value={newCustomerData.gstin}
                onChange={(e) => onChangeNewCustomer({ gstin: e.target.value.toUpperCase() })}
                className="h-8 text-xs bg-white border-slate-300 uppercase font-mono"
              />
            </div>

            <div>
              <Label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                Customer Type
              </Label>
              <select
                value={newCustomerData.customerType}
                onChange={(e) => onChangeNewCustomer({ customerType: e.target.value })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#145C32]"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="agricultural">Agricultural</option>
              </select>
            </div>
          </div>
        </div>
      ) : selectedCustomer ? (
        /* CASE 2: Customer Selected Card */
        <div className="rounded-xl border border-emerald-300 bg-emerald-50/40 p-3.5 shadow-2xs transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-sm">
                  {selectedCustomer.name}
                </span>
                {selectedCustomer.customerId && (
                  <Badge variant="outline" className="bg-emerald-100 text-[#145C32] border-emerald-300 text-[10px] font-mono font-semibold">
                    {selectedCustomer.customerId}
                  </Badge>
                )}
                <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 text-[10px] capitalize">
                  {selectedCustomer.customerType || "Residential"}
                </Badge>
                {selectedCustomer.state.trim().toLowerCase() === "odisha" ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                    Intra-State (CGST + SGST)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]">
                    Inter-State (IGST)
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                {selectedCustomer.mobile && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{selectedCustomer.mobile}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>
                    {selectedCustomer.address
                      ? `${selectedCustomer.address}, ${selectedCustomer.city}, ${selectedCustomer.state}`
                      : `${selectedCustomer.city}, ${selectedCustomer.state}`}
                  </span>
                </span>
                {selectedCustomer.gstin && (
                  <span className="flex items-center gap-1 font-mono text-[11px] text-slate-700">
                    <FileCheck2 className="w-3 h-3 text-emerald-600" />
                    <span>GSTIN: {selectedCustomer.gstin}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearSelection}
                className="text-xs h-8 gap-1.5 border-slate-300 hover:bg-white text-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Change Customer</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* CASE 3: Searchable Combobox Input */
        <div className="relative">
          <Label className="text-xs text-slate-700 font-semibold mb-1 block">
            Customer / Bill To <span className="text-rose-500">*</span>
          </Label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
                setHighlightedIndex(-1);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Type letter to search customer by name, mobile, code, or city..."
              className="w-full h-9 pl-9 pr-9 rounded-md border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#145C32] focus:border-[#145C32] transition-colors"
              autoComplete="off"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-xl z-50 max-h-72 overflow-y-auto overflow-x-hidden divide-y divide-slate-100">
              {/* Option to create a new customer directly with typed text */}
              {searchTerm.trim().length > 0 && (
                <div
                  onClick={() => handleStartCreateNew(searchTerm)}
                  className="p-2.5 bg-emerald-50/70 hover:bg-emerald-100/80 cursor-pointer flex items-center justify-between text-xs text-[#145C32] font-semibold transition-colors border-b border-emerald-200/60"
                >
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-emerald-600" />
                    <span>
                      + Create new customer: <strong className="text-emerald-950 font-bold underline">&quot;{searchTerm.trim()}&quot;</strong>
                    </span>
                  </div>
                  <span className="text-[11px] font-normal text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                    Auto-create on save
                  </span>
                </div>
              )}

              {/* List of matching existing customers */}
              {filteredCustomers.length > 0 ? (
                <div className="p-1">
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Existing Customers ({filteredCustomers.length})
                  </div>
                  {filteredCustomers.map((customer, idx) => {
                    const isHighlighted = highlightedIndex === idx;
                    return (
                      <div
                        key={customer.id}
                        onClick={() => handleSelect(customer)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`p-2.5 rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs ${
                          isHighlighted ? "bg-slate-100 text-slate-900" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {customer.name}
                            </span>
                            {customer.customerId && (
                              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200 rounded">
                                {customer.customerId}
                              </span>
                            )}
                            {customer.gstin && (
                              <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1 py-0.2 border border-blue-200 rounded">
                                GST
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            {customer.mobile && <span>📱 {customer.mobile}</span>}
                            <span>📍 {customer.city}, {customer.state}</span>
                            {customer.solarCapacity && (
                              <span>☀️ {customer.solarCapacity} kW</span>
                            )}
                          </div>
                        </div>

                        <span className="text-[11px] text-[#145C32] font-semibold flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                          Select <ArrowRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                !searchTerm.trim() && (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Type a letter to search customers...
                  </div>
                )
              )}

              {/* No match banner */}
              {searchTerm.trim().length > 0 && filteredCustomers.length === 0 && (
                <div className="p-4 text-center space-y-2">
                  <p className="text-xs text-slate-500">
                    No existing customer found matching &quot;{searchTerm}&quot;.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleStartCreateNew(searchTerm)}
                    className="bg-[#145C32] hover:bg-[#145C32]/90 text-white text-xs gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create &quot;{searchTerm}&quot; as New Customer</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
