import type { InvoiceFormat } from "./types";

export const INVOICE_FORMATS: InvoiceFormat[] = [
  {
    id: "classic-service",
    name: "Classic Service",
    tagline: "Clean professional invoice",
    useCase: "Freelancers, coaches, local service pros",
    description:
      "Traditional layout with clear header, itemized services, and payment terms — prints cleanly from a library PC.",
    accent: "#2563eb",
    icon: "FileText",
    badges: ["Word", "PDF"],
    features: ["Letterhead block", "Service line items", "Payment terms"],
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    tagline: "Whitespace-first design",
    useCase: "Designers, consultants, boutique brands",
    description:
      "Sparse typography, strong totals column, and a quiet footer — looks premium without Canva gymnastics.",
    accent: "#0f172a",
    icon: "Sparkles",
    badges: ["Word", "PDF"],
    features: ["Minimal chrome", "Bold totals", "Subtle accent bar"],
  },
  {
    id: "contractor-job",
    name: "Contractor Job",
    tagline: "Job / site ready",
    useCase: "Trades, handymen, field contractors",
    description:
      "Job description, materials + labor rows, and site address fields that survive Word edits on shared machines.",
    accent: "#ea580c",
    icon: "HardHat",
    badges: ["Word", "PDF"],
    features: ["Job reference", "Materials & labor", "Site notes"],
  },
  {
    id: "retail-product",
    name: "Retail / Product",
    tagline: "SKU-friendly product invoice",
    useCase: "Shops, makers, product sellers",
    description:
      "Quantity × unit price grid with product-oriented columns — ideal for small retail and e-commerce follow-ups.",
    accent: "#059669",
    icon: "Package",
    badges: ["Word", "PDF"],
    features: ["Qty × price grid", "Product descriptions", "Order summary"],
  },
  {
    id: "consulting-tm",
    name: "Consulting T&M",
    tagline: "Time & materials",
    useCase: "Consultants, agencies billing hours",
    description:
      "Hourly rate rows, period covered, and retainer-friendly notes — built for professional services billing.",
    accent: "#7c3aed",
    icon: "Clock",
    badges: ["Word", "PDF"],
    features: ["Hours × rate", "Period covered", "Retainer notes"],
  },
  {
    id: "creative-agency",
    name: "Creative / Agency",
    tagline: "Project milestone billing",
    useCase: "Agencies, creatives, marketing shops",
    description:
      "Project name, milestone line items, and brand-forward header — polished enough to send to enterprise clients.",
    accent: "#db2777",
    icon: "Palette",
    badges: ["Word", "PDF"],
    features: ["Project header", "Milestones", "Brand accent"],
  },
  {
    id: "nonprofit",
    name: "Nonprofit-style",
    tagline: "Grant & contribution friendly",
    useCase: "Nonprofits, community orgs, fiscal sponsors",
    description:
      "Mission-friendly language, contribution acknowledgment space, and transparent fee breakdown.",
    accent: "#0891b2",
    icon: "Heart",
    badges: ["Word", "PDF"],
    features: ["Acknowledgment block", "Transparent fees", "Mission footer"],
  },
  {
    id: "bilingual-en-es",
    name: "Bilingual EN/ES",
    tagline: "English + Spanish labels",
    useCase: "Bilingual businesses, Latino-owned SMBs",
    description:
      "Dual-language field labels (Invoice / Factura) so shared computers and mixed-language clients stay clear.",
    accent: "#c2410c",
    icon: "Languages",
    badges: ["Word", "PDF"],
    features: ["EN + ES labels", "Clear totals", "Library-PC safe"],
  },
];

export function getFormat(id: string): InvoiceFormat | undefined {
  return INVOICE_FORMATS.find((f) => f.id === id);
}
