export type DepositType = "none" | "percent" | "fixed";
export type ScopeMode = "lines" | "bullets";

export interface EstimateLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
}

export interface EstimateAgreement {
  documentNumber: string;
  issueDate: string;
  validUntil: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  jobAddress: string;
  jobCityStateZip: string;
  scopeMode: ScopeMode;
  lineItems: EstimateLineItem[];
  /** Plain-language scope bullets (one idea per entry). */
  scopeBullets: string[];
  timeline: string;
  /** When > 0 and scopeMode is bullets (or no priced lines), used as the estimate total. */
  totalOverride: number;
  depositType: DepositType;
  depositValue: number;
  notes: string;
  currency: string;
}

export interface EstimateTotals {
  subtotal: number;
  depositAmount: number;
  balanceDue: number;
}

/** Payload written for invoice builder handoff. */
export interface EstimateInvoiceHandoff {
  source: "estimate-agreement";
  createdAt: string;
  formatId: "classic-service" | "contractor-job";
  notes: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientCityStateZip: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    unit?: string;
  }>;
}
