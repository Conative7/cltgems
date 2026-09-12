import { v4 as uuidv4 } from "uuid";
import { defaultDueDate, todayISO } from "./calculations";
import type { FormatId, InvoiceData, LineItem } from "./types";

export function newLineItem(partial?: Partial<LineItem>): LineItem {
  return {
    id: uuidv4(),
    description: "",
    quantity: 1,
    unitPrice: 0,
    unit: "ea",
    ...partial,
  };
}

export function createEmptyInvoice(formatId: FormatId = "classic-service"): InvoiceData {
  const bilingual = formatId === "bilingual-en-es";
  return {
    formatId,
    invoiceNumber: "INV-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 9000) + 1000),
    issueDate: todayISO(),
    dueDate: defaultDueDate(30),
    business: {
      name: "",
      email: "",
      phone: "",
      address: "",
      cityStateZip: "",
      website: "",
      taxId: "",
    },
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
      cityStateZip: "",
      company: "",
    },
    lineItems: [
      newLineItem({
        description: formatId === "consulting-tm" ? "Consulting hours" : "Service / item",
        quantity: formatId === "consulting-tm" ? 4 : 1,
        unitPrice: formatId === "consulting-tm" ? 150 : 0,
        unit: formatId === "consulting-tm" ? "hrs" : "ea",
      }),
    ],
    taxRate: 0,
    discountType: "none",
    discountValue: 0,
    notes: "",
    paymentTerms: "Net 30 — payment due within 30 days of invoice date.",
    currency: "USD",
    bilingual,
  };
}

export function createDemoInvoice(formatId: FormatId): InvoiceData {
  const base = createEmptyInvoice(formatId);
  return {
    ...base,
    business: {
      name: "Queen City Services LLC",
      email: "hello@queencityservices.example",
      phone: "(704) 555-0142",
      address: "123 Tryon St, Suite 200",
      cityStateZip: "Charlotte, NC 28202",
      website: "queencityservices.example",
      taxId: "",
    },
    client: {
      name: "Jordan Lee",
      company: "Lee Neighborhood Services",
      email: "jordan@example.com",
      phone: "(704) 555-0199",
      address: "88 Freedom Dr",
      cityStateZip: "Charlotte, NC 28208",
    },
    lineItems: [
      newLineItem({
        description:
          formatId === "retail-product"
            ? "Starter kit (SKU-100)"
            : formatId === "contractor-job"
              ? "Labor — site prep & install"
              : formatId === "consulting-tm"
                ? "Strategy session"
                : formatId === "creative-agency"
                  ? "Brand refresh — Milestone 1"
                  : formatId === "nonprofit"
                    ? "Program facilitation"
                    : "Professional services",
        quantity: formatId === "consulting-tm" ? 6 : formatId === "retail-product" ? 3 : 1,
        unitPrice: formatId === "retail-product" ? 49 : formatId === "consulting-tm" ? 175 : 850,
        unit: formatId === "consulting-tm" ? "hrs" : formatId === "retail-product" ? "ea" : "project",
      }),
      newLineItem({
        description: formatId === "contractor-job" ? "Materials allowance" : "Follow-up / delivery",
        quantity: 1,
        unitPrice: 125,
        unit: "ea",
      }),
    ],
    taxRate: 7.25,
    discountType: "none",
    discountValue: 0,
    notes:
      formatId === "nonprofit"
        ? "Thank you for supporting our community mission. This invoice may serve as a contribution acknowledgment where applicable."
        : formatId === "bilingual-en-es"
          ? "Gracias por su negocio. / Thank you for your business."
          : "Thank you for your business. Questions? Reply to this invoice email.",
    paymentTerms: "Net 30. Accepts ACH, card, or check.",
  };
}
