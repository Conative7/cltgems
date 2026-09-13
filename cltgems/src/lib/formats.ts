import type { InvoiceFormat } from "./types";

export const INVOICE_FORMATS: InvoiceFormat[] = [
  {
    id: "classic-service",
    name: "Professional Service",
    tagline: "Standard business invoice",
    useCase: "Service pros, freelancers, coaches",
    description:
      "Clean letterhead, itemized services, tax, and Net-30 terms — the format most clients expect.",
    accent: "#1d4ed8",
    icon: "FileText",
    badges: ["Word", "PDF"],
    features: ["Letterhead", "Itemized services", "Tax & totals"],
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    tagline: "Quiet, premium layout",
    useCase: "Consultants, designers, boutique brands",
    description:
      "Whitespace-first design with a strong totals column — polished without looking busy.",
    accent: "#0f172a",
    icon: "Sparkles",
    badges: ["Word", "PDF"],
    features: ["Minimal chrome", "Bold totals", "Accent bar"],
  },
  {
    id: "contractor-job",
    name: "Trade / Contractor",
    tagline: "Labor + materials",
    useCase: "HVAC, cleaning, handymen, field trades",
    description:
      "Built for job work: labor hours, materials, and clear amounts that edit cleanly in Word or PDF.",
    accent: "#c2410c",
    icon: "HardHat",
    badges: ["Word", "PDF"],
    features: ["Labor & materials", "Job reference", "Field-ready"],
  },
  {
    id: "retail-product",
    name: "Product / Retail",
    tagline: "Quantity × unit price",
    useCase: "Shops, makers, product sellers",
    description:
      "SKU-friendly grid with qty, unit price, and line totals — ideal for product orders.",
    accent: "#047857",
    icon: "Package",
    badges: ["Word", "PDF"],
    features: ["Qty × price", "Product lines", "Order summary"],
  },
  {
    id: "consulting-tm",
    name: "Time & Materials",
    tagline: "Hours × rate",
    useCase: "Consultants, agencies, specialists",
    description:
      "Hourly billing with period coverage and precise hour totals — for professional services.",
    accent: "#6d28d9",
    icon: "Clock",
    badges: ["Word", "PDF"],
    features: ["Hours × rate", "Period covered", "Precise totals"],
  },
  {
    id: "creative-agency",
    name: "Project / Milestone",
    tagline: "Milestone billing",
    useCase: "Agencies, creatives, marketing shops",
    description:
      "Project name and milestone line items — clear enough for enterprise clients.",
    accent: "#be185d",
    icon: "Palette",
    badges: ["Word", "PDF"],
    features: ["Project header", "Milestones", "Brand accent"],
  },
  {
    id: "nonprofit",
    name: "Organization / Nonprofit",
    tagline: "Transparent fee invoice",
    useCase: "Nonprofits, community orgs, fiscal sponsors",
    description:
      "Clear fee breakdown with space for organization details — grant- and board-friendly.",
    accent: "#0e7490",
    icon: "Heart",
    badges: ["Word", "PDF"],
    features: ["Clear fees", "Org details", "Simple totals"],
  },
  {
    id: "bilingual-en-es",
    name: "Bilingual EN / ES",
    tagline: "English + Spanish labels",
    useCase: "Bilingual businesses, Latino-owned SMBs",
    description:
      "Dual-language labels (Invoice / Factura) so mixed-language clients stay clear.",
    accent: "#b45309",
    icon: "Languages",
    badges: ["Word", "PDF"],
    features: ["EN + ES labels", "Clear totals", "Library-PC safe"],
  },
];

export function getFormat(id: string): InvoiceFormat | undefined {
  return INVOICE_FORMATS.find((f) => f.id === id);
}
