import { CalculatedLineItem, InvoiceCalculationResult } from "./calculate-invoice";

export interface CompanyViewModel {
  name: string;
  legalName: string;
  tagline: string;
  logoUrl?: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  gstin: string;
  pan: string;
  cin?: string;
}

export interface CustomerViewModel {
  id: string;
  name: string;
  companyName?: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pincode?: string;
  gstin?: string;
  pan?: string;
}

export interface ShippingAddressViewModel {
  address: string;
  city: string;
  state: string;
  pincode?: string;
}

export interface SolarSystemDetailsViewModel {
  capacity: string;
  systemType: string;
  panelCount?: number | string;
  panelWattage?: string;
  inverterCapacity?: string;
  batteryCapacity?: string;
  location?: string;
  estimatedGeneration?: string;
  projectReference?: string;
}

export interface BankDetailsViewModel {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  branchName?: string;
  upiId?: string;
  acceptedModes?: string;
}

export interface InvoiceViewModel {
  id: string;
  invoiceNumber: string;
  invoiceType: string;
  documentTitle: string;
  status: "Paid" | "Pending" | "Partially Paid" | "Overdue" | "Draft" | "Cancelled";
  invoiceDate: string;
  dueDate: string;
  salesOrderNumber?: string;
  quotationRef?: string;
  projectRef?: string;
  placeOfSupply: string;
  stateCode: string;
  reverseCharge: string;
  
  company: CompanyViewModel;
  customer: CustomerViewModel;
  shippingAddress?: ShippingAddressViewModel;
  
  systemDetails?: SolarSystemDetailsViewModel;
  
  items: CalculatedLineItem[];
  calculations: InvoiceCalculationResult & { amountInWords: string };
  
  bankDetails?: BankDetailsViewModel;
  paymentQrCodeUrl?: string;
  termsAndConditions: string[];
  notes?: string;
  
  authorizedSignatory: {
    companyName: string;
    designation: string;
    signatoryName?: string;
  };
}
