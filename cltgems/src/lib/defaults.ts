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

function starterLines(formatId: FormatId): LineItem[] {
  switch (formatId) {
    case "consulting-tm":
      return [
        newLineItem({
          description: "Professional services — consulting hours",
          quantity: 4,
          unitPrice: 0,
          unit: "hrs",
        }),
      ];
    case "contractor-job":
      return [
        newLineItem({
          description: "Labor",
          quantity: 1,
          unitPrice: 0,
          unit: "hrs",
        }),
        newLineItem({
          description: "Materials",
          quantity: 1,
          unitPrice: 0,
          unit: "ea",
        }),
      ];
    case "retail-product":
      return [
        newLineItem({
          description: "Product / SKU",
          quantity: 1,
          unitPrice: 0,
          unit: "ea",
        }),
      ];
    case "creative-agency":
      return [
        newLineItem({
          description: "Project milestone",
          quantity: 1,
          unitPrice: 0,
          unit: "ea",
        }),
      ];
    case "nonprofit":
      return [
        newLineItem({
          description: "Program / service fee",
          quantity: 1,
          unitPrice: 0,
          unit: "ea",
        }),
      ];
    default:
      return [
        newLineItem({
          description: "Professional services",
          quantity: 1,
          unitPrice: 0,
          unit: "ea",
        }),
      ];
  }
}

export function createEmptyInvoice(formatId: FormatId = "classic-service"): InvoiceData {
  const bilingual = formatId === "bilingual-en-es";
  return {
    formatId,
    invoiceNumber:
      "INV-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 9000) + 1000),
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
    lineItems: starterLines(formatId),
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
      email: "billing@queencityservices.example",
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
    lineItems:
      formatId === "consulting-tm"
        ? [
            newLineItem({
              description: "Strategy consulting",
              quantity: 6,
              unitPrice: 175,
              unit: "hrs",
            }),
          ]
        : formatId === "retail-product"
          ? [
              newLineItem({
                description: "Starter kit (SKU-100)",
                quantity: 3,
                unitPrice: 49,
                unit: "ea",
              }),
              newLineItem({
                description: "Shipping",
                quantity: 1,
                unitPrice: 12,
                unit: "ea",
              }),
            ]
          : formatId === "contractor-job"
            ? [
                newLineItem({
                  description: "Labor — site work",
                  quantity: 8,
                  unitPrice: 85,
                  unit: "hrs",
                }),
                newLineItem({
                  description: "Materials",
                  quantity: 1,
                  unitPrice: 220,
                  unit: "ea",
                }),
              ]
            : formatId === "creative-agency"
              ? [
                  newLineItem({
                    description: "Brand refresh — Milestone 1",
                    quantity: 1,
                    unitPrice: 2500,
                    unit: "ea",
                  }),
                ]
              : [
                  newLineItem({
                    description: "Professional services",
                    quantity: 1,
                    unitPrice: 850,
                    unit: "ea",
                  }),
                ],
    // Mecklenburg County, NC combined sales tax example (edit as needed)
    taxRate: 7.25,
    discountType: "none",
    discountValue: 0,
    notes: "",
    paymentTerms: "Net 30 — payment due within 30 days of invoice date. ACH, card, or check accepted.",
  };
}
