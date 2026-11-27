import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { amountInWords } from "./amount-in-words";
import { calculateInvoice, LineItemInput } from "./calculate-invoice";
import { generatePaymentQrCode } from "./generate-payment-qr";
import {
  BankDetailsViewModel,
  CompanyViewModel,
  CustomerViewModel,
  InvoiceViewModel,
  SolarSystemDetailsViewModel,
} from "./types";

function formatDate(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return "—";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, "0");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function formatInvoiceData(invoice: any): Promise<InvoiceViewModel> {
  // 1. Fetch Company Settings
  let companyRecord = await db.query.companies.findFirst();
  if (!companyRecord) {
    companyRecord = {
      name: "AP Enerfy Solar Pvt Ltd",
      legalName: "AP Enerfy Solar Private Limited",
      code: "APES",
      gstin: "21AAACA1234A1Z5",
      pan: "AAACA1234A",
      cin: "U40106OR2023PTC042890",
      state: "Odisha",
      stateCode: "21",
      email: "contact@apenerfy.com",
      phone: "+91 674 2548900",
      website: "https://apenerfysolar.com",
      address: "Plot No. 104, Infocity Avenue, Patia, Bhubaneswar, Odisha 751024",
      logoUrl: null,
      currency: "INR",
      isActive: true,
    } as any;
  }

  const company: CompanyViewModel = {
    name: companyRecord.name || "AP Enerfy Solar Pvt Ltd",
    legalName: companyRecord.legalName || "AP Enerfy Solar Private Limited",
    tagline: "Clean Energy. Smart Business.",
    logoUrl: companyRecord.logoUrl || undefined,
    address: companyRecord.address || "Plot No. 104, Infocity Avenue, Patia",
    city: "Bhubaneswar",
    state: companyRecord.state || "Odisha",
    stateCode: companyRecord.stateCode || "21",
    pincode: "751024",
    phone: companyRecord.phone || "+91 674 2548900",
    email: companyRecord.email || "billing@apenerfysolar.com",
    website: companyRecord.website || "www.apenerfysolar.com",
    gstin: companyRecord.gstin || "21AAACA1234A1Z5",
    pan: companyRecord.pan || "AAACA1234A",
    cin: companyRecord.cin || "U40106OR2023PTC042890",
  };

  // 2. Fetch Primary Bank Account
  let bankRecord = await db.query.bankAccounts.findFirst({
    where: eq(schema.bankAccounts.isPrimary, true),
  });
  if (!bankRecord) {
    bankRecord = await db.query.bankAccounts.findFirst();
  }

  const bankDetails: BankDetailsViewModel = {
    bankName: bankRecord?.bankName || "State Bank of India",
    accountName: bankRecord?.accountName || company.legalName,
    accountNumber: bankRecord?.accountNumber || "41238901234",
    ifscCode: bankRecord?.ifscCode || "SBIN0010258",
    branchName: bankRecord?.branchName || "Infocity Branch, Bhubaneswar",
    upiId: "apenerfysolar@sbi",
    acceptedModes: "NEFT / RTGS / IMPS / UPI / Cheque",
  };

  // 3. Customer Info
  const cust = invoice.customer || {};
  const customer: CustomerViewModel = {
    id: cust.id || cust.customerId || "CUST-0000",
    name: cust.name || "Valued Solar Client",
    companyName: cust.companyName || undefined,
    phone: cust.mobile || cust.phone || "—",
    email: cust.email || undefined,
    address: cust.address || "Bhubaneswar, Odisha",
    city: cust.city || "Bhubaneswar",
    state: cust.state || "Odisha",
    stateCode: cust.state === "Odisha" || !cust.state ? "21" : "99",
    pincode: cust.pincode || undefined,
    gstin: cust.gstin || undefined,
    pan: cust.pan || undefined,
  };

  // 4. Determine Intra-state vs Inter-state
  const isInterState =
    customer.state.trim().toLowerCase() !== "" &&
    customer.state.trim().toLowerCase() !== company.state.trim().toLowerCase() &&
    customer.state.trim().toLowerCase() !== "odisha";

  // 5. Line items
  let inputItems: LineItemInput[] = [];
  if (invoice.items && Array.isArray(invoice.items) && invoice.items.length > 0) {
    inputItems = invoice.items.map((it: any) => ({
      description: it.description || "Solar Equipment & Installation Services",
      hsnCode: it.hsnCode || "85414011",
      quantity: Number(it.quantity) || 1,
      unit: it.unit || "Nos",
      unitPrice: Number(it.unitPrice) || Number(it.taxableAmount) || 0,
      discount: Number(it.discount || 0),
      gstRate: Number(it.gstRate || it.taxRate || 5),
    }));
  } else {
    // Generate realistic solar installation line items from invoice totals
    const cap = Number(invoice.capacity || 3);
    const taxableTotal = Number(invoice.taxableAmount || 114286);
    const moduleCost = Math.round(taxableTotal * 0.7 * 100) / 100;
    const inverterCost = Math.round(taxableTotal * 0.3 * 100) / 100;
    const moduleQty = Math.max(1, Math.round((cap * 1000) / 550));

    inputItems = [
      {
        description: `Mono PERC Half-Cut 550W High Efficiency Solar PV Modules (${cap} kW Array)`,
        hsnCode: "85414011",
        quantity: moduleQty,
        unit: "Nos",
        unitPrice: Math.round((moduleCost / moduleQty) * 100) / 100,
        discount: 0,
        gstRate: 5,
      },
      {
        description: `On-Grid Solar String Inverter ${cap} kW Single Phase with WiFi Data Logger & BOS Installation Kit`,
        hsnCode: "85044090",
        quantity: 1,
        unit: "Set",
        unitPrice: inverterCost,
        discount: 0,
        gstRate: 12,
      },
    ];
  }

  // 6. Calculate invoice finances
  const existingPaid = Number(invoice.paidAmount || 0);
  const calcResult = calculateInvoice({
    items: inputItems,
    isInterState,
    advancePaid: existingPaid,
  });

  const words = amountInWords(calcResult.grandTotal);

  // 7. UPI QR Code
  let qrCodeDataUrl = "";
  if (calcResult.balanceAmount > 0 && bankDetails.upiId) {
    qrCodeDataUrl = await generatePaymentQrCode({
      upiId: bankDetails.upiId,
      payeeName: company.legalName,
      amount: calcResult.balanceAmount,
      invoiceNumber: invoice.invoiceNumber,
    });
  }

  // 8. Document Title Mapping
  let docTitle = "GST TAX INVOICE";
  const typeStr = (invoice.invoiceType || "").toLowerCase();
  if (typeStr.includes("proforma")) docTitle = "PROFORMA INVOICE";
  else if (typeStr.includes("quotation")) docTitle = "SOLAR QUOTATION";
  else if (typeStr.includes("credit note")) docTitle = "CREDIT NOTE";
  else if (typeStr.includes("debit note")) docTitle = "DEBIT NOTE";
  else if (typeStr.includes("challan")) docTitle = "DELIVERY CHALLAN";
  else if (typeStr.includes("advance")) docTitle = "ADVANCE TAX INVOICE";

  // 9. Solar System Details
  let systemDetails: SolarSystemDetailsViewModel | undefined = undefined;
  const capacityNum = Number(invoice.capacity || cust.solarCapacity || 0);
  if (capacityNum > 0 || invoice.systemType || invoice.project) {
    const sysType = invoice.systemType || invoice.project?.systemType || "On-Grid";
    const panelCount = Math.max(1, Math.round((capacityNum * 1000) / 550));
    systemDetails = {
      capacity: `${capacityNum.toFixed(2)} kW`,
      systemType: sysType,
      panelCount: `${panelCount} Modules`,
      panelWattage: "550W Mono PERC",
      inverterCapacity: `${capacityNum.toFixed(1)} kW String Inverter`,
      batteryCapacity: sysType === "Hybrid" || sysType === "Off-Grid" ? "10 kWh LiFePO4" : "N/A (Grid-Tied)",
      location: invoice.project?.location || cust.city || "Bhubaneswar, Odisha",
      estimatedGeneration: `${(capacityNum * 4.2).toFixed(1)} Units / Day (Est.)`,
      projectReference: invoice.project?.projectId || undefined,
    };
  }

  // 10. Terms & Conditions
  const termsAndConditions = [
    "1. Goods once sold will not be returned or exchanged unless covered under valid manufacturer warranty.",
    "2. Solar PV modules carry 25 years linear performance warranty; Inverter carries 5 years manufacturer warranty.",
    "3. Bi-directional Net Metering and Discom grid synchronization are governed by state regulatory guidelines.",
    "4. Payments must be cleared by the due date. Overdue amounts are subject to 18% p.a. interest.",
    "5. Disputes, if any, shall be subject exclusively to Bhubaneswar, Odisha jurisdiction.",
  ];

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber || "INV-2025-0000",
    invoiceType: invoice.invoiceType || "Tax Invoice",
    documentTitle: docTitle,
    status: (invoice.status || "Pending") as any,
    invoiceDate: formatDate(invoice.invoiceDate),
    dueDate: formatDate(invoice.dueDate),
    salesOrderNumber: invoice.salesOrderId || invoice.salesOrderNumber || undefined,
    quotationRef: invoice.quotationRef || invoice.quotationId || undefined,
    projectRef: invoice.projectId || invoice.project?.projectId || undefined,
    placeOfSupply: `${customer.state} (${customer.stateCode})`,
    stateCode: customer.stateCode,
    reverseCharge: "No",
    company,
    customer,
    shippingAddress: cust.installationAddress
      ? {
          address: cust.installationAddress,
          city: cust.installationCity || cust.city || "Bhubaneswar",
          state: cust.installationState || cust.state || "Odisha",
          pincode: cust.installationPincode || cust.pincode,
        }
      : undefined,
    systemDetails,
    items: calcResult.items,
    calculations: {
      ...calcResult,
      amountInWords: words,
    },
    bankDetails,
    paymentQrCodeUrl: qrCodeDataUrl || undefined,
    termsAndConditions: invoice.terms ? [invoice.terms] : termsAndConditions,
    notes: invoice.notes || undefined,
    authorizedSignatory: {
      companyName: company.legalName,
      designation: "Authorized Signatory",
      signatoryName: `For ${company.name}`,
    },
  };
}
