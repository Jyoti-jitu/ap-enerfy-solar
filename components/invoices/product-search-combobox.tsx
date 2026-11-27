"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Package,
  Check,
  ChevronDown,
  X,
  Sparkles,
  ArrowRight,
  Layers,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "./invoice-constants";

export interface ProductOption {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  model?: string | null;
  wattage?: string | number | null;
  capacityKw?: string | number | null;
  hsnCode?: string | null;
  unit?: string | null;
  sellingPrice?: string | number | null;
  availableStock?: number | null;
  currentStock?: number | null;
  description?: string | null;
}

interface ProductSearchComboboxProps {
  products: ProductOption[];
  onSelectProduct: (item: {
    productId?: string;
    description: string;
    hsnCode: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    discount: number;
    gstRate: number;
  }) => void;
  onClose?: () => void;
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
}

export function getRecommendedGstRate(category?: string, hsnCode?: string): number {
  const cat = (category || "").toLowerCase();
  const hsn = (hsnCode || "").trim();

  if (cat.includes("panel") || cat.includes("module") || hsn.startsWith("8541")) {
    return 5;
  }
  if (cat.includes("inverter") || hsn.startsWith("8504")) {
    return 12;
  }
  if (cat.includes("battery") || hsn.startsWith("8507")) {
    return 18;
  }
  return 18;
}

export function getSmartDefaultPrice(p: ProductOption): number {
  const sp = Number(p.sellingPrice || 0);
  if (sp > 0) return sp;

  const sku = (p.sku || "").toUpperCase();
  const name = (p.name || "").toLowerCase();

  if (sku.includes("PNL") || name.includes("panel")) return 14285;
  if (sku.includes("INV") || name.includes("inverter")) return 48500;
  if (sku.includes("BAT") || name.includes("battery")) return 65000;
  if (sku.includes("MNT") || name.includes("structure")) return 4500;
  if (sku.includes("CAB") || name.includes("cable")) return 3800;
  if (sku.includes("ACDB")) return 4200;
  if (sku.includes("DCDB")) return 3900;
  if (sku.includes("MC4") || name.includes("connector")) return 250;
  return 1000;
}

export function ProductSearchCombobox({
  products,
  onSelectProduct,
  onClose,
  isOpen,
  onToggleOpen,
}: ProductSearchComboboxProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [addedItemMessage, setAddedItemMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input automatically when searchbar opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // Real-time filter based on user-typed letters
  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return products.slice(0, 8);

    return products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const skuMatch = p.sku?.toLowerCase().includes(q);
      const catMatch = p.category?.toLowerCase().includes(q);
      const brandMatch = p.brand?.toLowerCase().includes(q);
      const modelMatch = p.model?.toLowerCase().includes(q);
      const hsnMatch = p.hsnCode?.toLowerCase().includes(q);
      return nameMatch || skuMatch || catMatch || brandMatch || modelMatch || hsnMatch;
    });
  }, [products, searchTerm]);

  const handleChooseProduct = (p: ProductOption) => {
    const rate = getSmartDefaultPrice(p);
    const gst = getRecommendedGstRate(p.category, p.hsnCode || undefined);
    const desc = `${p.name} - ${p.brand}${p.model ? ` (${p.model})` : ""}`;

    onSelectProduct({
      productId: p.id,
      description: desc,
      hsnCode: p.hsnCode || "85414011",
      quantity: 1,
      unit: p.unit || "Nos",
      unitPrice: rate,
      discount: 0,
      gstRate: gst,
    });

    setAddedItemMessage(`Added "${p.name}" to line items!`);
    setTimeout(() => {
      setAddedItemMessage(null);
    }, 2500);

    setSearchTerm("");
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleAddCustom = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    onSelectProduct({
      description: trimmed,
      hsnCode: "85414011",
      quantity: 1,
      unit: "Nos",
      unitPrice: 0,
      discount: 0,
      gstRate: 18,
    });

    setAddedItemMessage(`Added custom item "${trimmed}"!`);
    setTimeout(() => {
      setAddedItemMessage(null);
    }, 2500);

    setSearchTerm("");
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalOptions = filteredProducts.length + (searchTerm.trim() ? 1 : 0);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < totalOptions ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalOptions - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredProducts.length) {
        handleChooseProduct(filteredProducts[highlightedIndex]);
      } else if (searchTerm.trim()) {
        handleAddCustom(searchTerm);
      }
    } else if (e.key === "Escape") {
      onToggleOpen(false);
      onClose?.();
    }
  };

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onToggleOpen(true)}
        className="gap-1.5 h-8 text-xs font-semibold border-[#145C32] text-[#145C32] hover:bg-[#E8F3E5] shadow-2xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Item from Inventory</span>
      </Button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full bg-gradient-to-r from-emerald-50/80 via-emerald-50/40 to-white border border-[#145C32]/40 rounded-xl p-3 shadow-md space-y-2.5 transition-all"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-emerald-200/70 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#145C32] text-white">
            <Package className="w-3.5 h-3.5" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              Select Product from Inventory
              <span className="text-[10px] font-normal text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Type letters to recommend
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {addedItemMessage && (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-md animate-fade-in flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" />
              {addedItemMessage}
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              onToggleOpen(false);
              onClose?.();
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Close Searchbar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#145C32]" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type letter to search product by name, brand, SKU or model (e.g. 'waa', 'inv', '550', 'cable')..."
          className="w-full h-9 pl-9 pr-9 rounded-lg border border-emerald-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#145C32]/30 focus:border-[#145C32] shadow-inner transition-colors"
          autoComplete="off"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Recommended Products Dropdown / Grid */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm max-h-72 overflow-y-auto divide-y divide-slate-100">
        {/* Custom item creation if user typed letters */}
        {searchTerm.trim().length > 0 && (
          <div
            onClick={() => handleAddCustom(searchTerm)}
            className="p-2.5 bg-emerald-50/60 hover:bg-emerald-100/70 cursor-pointer flex items-center justify-between text-xs text-[#145C32] font-semibold transition-colors border-b border-emerald-200/60"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                + Add Custom Item: <strong className="text-emerald-950 font-bold underline">&quot;{searchTerm.trim()}&quot;</strong>
              </span>
            </div>
            <span className="text-[11px] font-normal text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-md">
              Add to invoice
            </span>
          </div>
        )}

        {/* Matching products from inventory */}
        {filteredProducts.length > 0 ? (
          <div className="p-1 space-y-0.5">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Inventory Recommendations ({filteredProducts.length})</span>
              <span>Click or Press Enter to Add</span>
            </div>

            {filteredProducts.map((p, idx) => {
              const isHighlighted = highlightedIndex === idx;
              const rate = getSmartDefaultPrice(p);
              const gst = getRecommendedGstRate(p.category, p.hsnCode || undefined);
              const stock = p.availableStock ?? p.currentStock ?? 0;

              return (
                <div
                  key={p.id}
                  onClick={() => handleChooseProduct(p)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs gap-3 ${
                    isHighlighted ? "bg-emerald-50/80 text-slate-900 border border-emerald-200" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 truncate">
                        {p.name}
                      </span>
                      <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 text-[10px] font-mono py-0">
                        {p.sku}
                      </Badge>
                      <Badge variant="outline" className="bg-emerald-50 text-[#145C32] border-emerald-200 text-[10px] py-0">
                        {p.category}
                      </Badge>
                      {p.brand && (
                        <span className="text-[10px] font-medium text-slate-500">
                          by {p.brand}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                      <span>HSN: <strong className="font-mono text-slate-700">{p.hsnCode || "85414011"}</strong></span>
                      <span>Unit: <strong className="text-slate-700">{p.unit || "Nos"}</strong></span>
                      <span className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${stock > 0 ? "bg-emerald-500" : "bg-amber-500"}`} />
                        <span>{stock > 0 ? `${stock} in stock` : "Available in Catalog"}</span>
                      </span>
                      <span className="text-[#145C32] font-semibold">
                        GST: {gst}%
                      </span>
                    </div>
                  </div>

                  {/* Right side: Rate & Add CTA */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {formatINR(rate)}
                      </div>
                      <div className="text-[10px] text-slate-400">per {p.unit || "unit"}</div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      className="h-7 px-2.5 bg-[#145C32] hover:bg-[#145C32]/90 text-white text-[11px] gap-1 font-semibold shadow-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChooseProduct(p);
                      }}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !searchTerm.trim() && (
            <div className="p-4 text-center text-xs text-slate-500">
              Type letters into the search bar above to recommend products from inventory.
            </div>
          )
        )}

        {/* No results */}
        {searchTerm.trim().length > 0 && filteredProducts.length === 0 && (
          <div className="p-4 text-center space-y-2">
            <p className="text-xs text-slate-500">
              No inventory products found matching &quot;{searchTerm}&quot;.
            </p>
            <Button
              type="button"
              size="sm"
              onClick={() => handleAddCustom(searchTerm)}
              className="bg-[#145C32] hover:bg-[#145C32]/90 text-white text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add &quot;{searchTerm}&quot; as Custom Item</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
