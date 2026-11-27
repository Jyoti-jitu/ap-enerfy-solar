/**
 * Decimal-safe financial calculation utilities for Indian GST Invoices.
 * Handles item taxable amounts, intra-state (CGST/SGST) vs inter-state (IGST),
 * HSN tax breakdown summaries, round-off, and payment balance.
 */

export interface LineItemInput {
  description: string;
  hsnCode?: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  discount?: number; // Discount amount or percentage
  gstRate: number; // e.g. 5, 12, 18, 28
}

export interface CalculatedLineItem {
  slNo: number;
  description: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  taxableAmount: number;
  gstRate: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  totalAmount: number;
}

export interface HsnSummaryRow {
  hsnCode: string;
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
}

export interface InvoiceCalculationResult {
  items: CalculatedLineItem[];
  hsnSummary: HsnSummaryRow[];
  grossAmount: number;
  totalDiscount: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  additionalCharges: number;
  roundOff: number;
  grandTotal: number;
  paidAmount: number;
  balanceAmount: number;
  isInterState: boolean;
}

export function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function calculateInvoice(params: {
  items: LineItemInput[];
  isInterState?: boolean;
  additionalCharges?: number;
  advancePaid?: number;
  existingPaidAmount?: number;
}): InvoiceCalculationResult {
  const {
    items: inputItems,
    isInterState = false,
    additionalCharges = 0,
    advancePaid = 0,
    existingPaidAmount = 0,
  } = params;

  let grossSum = 0;
  let discountSum = 0;
  let taxableSum = 0;
  let cgstSum = 0;
  let sgstSum = 0;
  let igstSum = 0;
  let totalTaxSum = 0;

  const hsnMap: Record<string, HsnSummaryRow> = {};

  const items: CalculatedLineItem[] = inputItems.map((item, index) => {
    const qty = Number(item.quantity) || 1;
    const rate = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;
    const gstRate = Number(item.gstRate) || 0;
    const hsn = item.hsnCode || "85414011";

    const itemGross = roundToTwo(qty * rate);
    const taxable = roundToTwo(Math.max(0, itemGross - discount));

    let cgstRate = 0;
    let cgstAmount = 0;
    let sgstRate = 0;
    let sgstAmount = 0;
    let igstRate = 0;
    let igstAmount = 0;

    if (isInterState) {
      igstRate = gstRate;
      igstAmount = roundToTwo((taxable * igstRate) / 100);
    } else {
      cgstRate = roundToTwo(gstRate / 2);
      sgstRate = roundToTwo(gstRate / 2);
      cgstAmount = roundToTwo((taxable * cgstRate) / 100);
      sgstAmount = roundToTwo((taxable * sgstRate) / 100);
    }

    const itemTotalTax = roundToTwo(cgstAmount + sgstAmount + igstAmount);
    const itemTotal = roundToTwo(taxable + itemTotalTax);

    grossSum += itemGross;
    discountSum += discount;
    taxableSum += taxable;
    cgstSum += cgstAmount;
    sgstSum += sgstAmount;
    igstSum += igstAmount;
    totalTaxSum += itemTotalTax;

    // HSN aggregation
    const key = `${hsn}-${gstRate}`;
    if (!hsnMap[key]) {
      hsnMap[key] = {
        hsnCode: hsn,
        taxableAmount: 0,
        cgstRate,
        cgstAmount: 0,
        sgstRate,
        sgstAmount: 0,
        igstRate,
        igstAmount: 0,
        totalTax: 0,
      };
    }
    hsnMap[key].taxableAmount = roundToTwo(hsnMap[key].taxableAmount + taxable);
    hsnMap[key].cgstAmount = roundToTwo(hsnMap[key].cgstAmount + cgstAmount);
    hsnMap[key].sgstAmount = roundToTwo(hsnMap[key].sgstAmount + sgstAmount);
    hsnMap[key].igstAmount = roundToTwo(hsnMap[key].igstAmount + igstAmount);
    hsnMap[key].totalTax = roundToTwo(hsnMap[key].totalTax + itemTotalTax);

    return {
      slNo: index + 1,
      description: item.description,
      hsnCode: hsn,
      quantity: qty,
      unit: item.unit || "Nos",
      unitPrice: rate,
      discount,
      taxableAmount: taxable,
      gstRate,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      totalTax: itemTotalTax,
      totalAmount: itemTotal,
    };
  });

  const rawTotal = roundToTwo(taxableSum + totalTaxSum + additionalCharges);
  const roundedGrandTotal = Math.round(rawTotal);
  const roundOff = roundToTwo(roundedGrandTotal - rawTotal);

  const totalPaid = roundToTwo(Math.max(0, advancePaid + existingPaidAmount));
  const balance = roundToTwo(Math.max(0, roundedGrandTotal - totalPaid));

  return {
    items,
    hsnSummary: Object.values(hsnMap),
    grossAmount: roundToTwo(grossSum),
    totalDiscount: roundToTwo(discountSum),
    taxableAmount: roundToTwo(taxableSum),
    cgstAmount: roundToTwo(cgstSum),
    sgstAmount: roundToTwo(sgstSum),
    igstAmount: roundToTwo(igstSum),
    totalTax: roundToTwo(totalTaxSum),
    additionalCharges: roundToTwo(additionalCharges),
    roundOff,
    grandTotal: roundedGrandTotal,
    paidAmount: totalPaid,
    balanceAmount: balance,
    isInterState,
  };
}
