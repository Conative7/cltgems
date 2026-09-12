export type FormatId =
  | "classic-service"
  | "modern-minimal"
  | "contractor-job"
  | "retail-product"
  | "consulting-tm"
  | "creative-agency"
  | "nonprofit"
  | "bilingual-en-es";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
}

export interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  website?: string;
  taxId?: string;
}

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  company?: string;
}

export interface InvoiceData {
  formatId: FormatId;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  business: BusinessInfo;
  client: ClientInfo;
  lineItems: LineItem[];
  taxRate: number;
  discountType: "none" | "percent" | "fixed";
  discountValue: number;
  notes: string;
  paymentTerms: string;
  currency: string;
  bilingual?: boolean;
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}

export interface InvoiceFormat {
  id: FormatId;
  name: string;
  tagline: string;
  useCase: string;
  description: string;
  accent: string;
  icon: string;
  badges: ("Word" | "PDF")[];
  features: string[];
}

export interface DraftRecord {
  id: string;
  savedAt: string;
  label: string;
  invoice: InvoiceData;
}

export interface ExportRecord {
  id: string;
  exportedAt: string;
  formatId: FormatId;
  invoiceNumber: string;
  clientName: string;
  total: number;
  type: "pdf" | "docx";
}

export interface CreditState {
  credits: number;
  plan: "free" | "credits" | "subscribe";
}
