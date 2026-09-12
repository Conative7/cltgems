import {
  AlignmentType as Align,
  BorderStyle as Border,
  Document as Doc,
  HeadingLevel as Heading,
  Packer as Pack,
  Paragraph as Para,
  Table as Tbl,
  TableCell as Cell,
  TableRow as Row,
  TextRun as Run,
  WidthType as W,
} from "docx";
import { saveAs } from "file-saver";
import { calcTotals, formatMoney, lineItemAmount } from "../calculations";
import { getFormat } from "../formats";
import type { InvoiceData } from "../types";

const noBorder = {
  top: { style: Border.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: Border.NONE, size: 0, color: "FFFFFF" },
  left: { style: Border.NONE, size: 0, color: "FFFFFF" },
  right: { style: Border.NONE, size: 0, color: "FFFFFF" },
};

const thinBottom = {
  top: { style: Border.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: Border.SINGLE, size: 4, color: "E2E8F0" },
  left: { style: Border.NONE, size: 0, color: "FFFFFF" },
  right: { style: Border.NONE, size: 0, color: "FFFFFF" },
};

function cell(text: string, opts?: { bold?: boolean; width?: number; align?: typeof Align[keyof typeof Align]; color?: string }) {
  return new Cell({
    width: { size: opts?.width ?? 2400, type: W.DXA },
    borders: thinBottom,
    children: [
      new Para({
        alignment: opts?.align ?? Align.LEFT,
        children: [
          new Run({
            text,
            bold: opts?.bold,
            size: 18,
            font: "Calibri",
            color: opts?.color ?? "0F172A",
          }),
        ],
      }),
    ],
  });
}

export async function downloadInvoiceDocx(invoice: InvoiceData): Promise<void> {
  const format = getFormat(invoice.formatId);
  const accent = (format?.accent ?? "#2563eb").replace("#", "");
  const totals = calcTotals(invoice);
  const bilingual = invoice.bilingual || invoice.formatId === "bilingual-en-es";
  const label = (en: string, es: string) => (bilingual ? en + " / " + es : en);

  const header = new Para({
    heading: Heading.HEADING_1,
    spacing: { after: 80 },
    children: [
      new Run({
        text: bilingual ? "INVOICE / FACTURA" : "INVOICE",
        bold: true,
        color: accent,
        font: "Calibri",
        size: 36,
      }),
    ],
  });

  const meta = new Para({
    spacing: { after: 200 },
    children: [
      new Run({
        text: invoice.invoiceNumber + "  ·  " + label("Issue", "Emisión") + " " + invoice.issueDate + "  ·  " + label("Due", "Vence") + " " + invoice.dueDate,
        size: 18,
        color: "64748B",
        font: "Calibri",
      }),
    ],
  });

  const formatLine = new Para({
    spacing: { after: 240 },
    children: [
      new Run({
        text: (format?.name ?? "Invoice") + " — CLT Gems",
        size: 16,
        color: "94A3B8",
        font: "Calibri",
        italics: true,
      }),
    ],
  });

  const parties = new Tbl({
    width: { size: 9360, type: W.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new Row({
        children: [
          new Cell({
            width: { size: 4680, type: W.DXA },
            borders: noBorder,
            children: [
              new Para({
                children: [new Run({ text: label("FROM", "DE"), bold: true, size: 16, color: accent, font: "Calibri" })],
              }),
              new Para({
                spacing: { before: 60 },
                children: [new Run({ text: invoice.business.name || "Your business", bold: true, size: 22, font: "Calibri" })],
              }),
              ...[invoice.business.address, invoice.business.cityStateZip, invoice.business.email, invoice.business.phone, invoice.business.website]
                .filter(Boolean)
                .map(
                  (t) =>
                    new Para({
                      children: [new Run({ text: String(t), size: 18, color: "475569", font: "Calibri" })],
                    })
                ),
            ],
          }),
          new Cell({
            width: { size: 4680, type: W.DXA },
            borders: noBorder,
            children: [
              new Para({
                children: [new Run({ text: label("BILL TO", "FACTURAR A"), bold: true, size: 16, color: accent, font: "Calibri" })],
              }),
              new Para({
                spacing: { before: 60 },
                children: [
                  new Run({
                    text: invoice.client.company || invoice.client.name || "Client",
                    bold: true,
                    size: 22,
                    font: "Calibri",
                  }),
                ],
              }),
              ...[
                invoice.client.company && invoice.client.name ? invoice.client.name : "",
                invoice.client.address,
                invoice.client.cityStateZip,
                invoice.client.email,
                invoice.client.phone,
              ]
                .filter(Boolean)
                .map(
                  (t) =>
                    new Para({
                      children: [new Run({ text: String(t), size: 18, color: "475569", font: "Calibri" })],
                    })
                ),
            ],
          }),
        ],
      }),
    ],
  });

  const tableHeader = new Row({
    children: [
      cell(label("Description", "Descripción"), { bold: true, width: 4560, color: "475569" }),
      cell(label("Qty", "Cant"), { bold: true, width: 1200, align: Align.RIGHT, color: "475569" }),
      cell(label("Price", "Precio"), { bold: true, width: 1800, align: Align.RIGHT, color: "475569" }),
      cell(label("Amount", "Importe"), { bold: true, width: 1800, align: Align.RIGHT, color: "475569" }),
    ],
  });

  const itemRows = invoice.lineItems.map(
    (item) =>
      new Row({
        children: [
          cell(item.description || "—", { width: 4560 }),
          cell(String(item.quantity) + (item.unit ? " " + item.unit : ""), { width: 1200, align: Align.RIGHT }),
          cell(formatMoney(item.unitPrice, invoice.currency), { width: 1800, align: Align.RIGHT }),
          cell(formatMoney(lineItemAmount(item), invoice.currency), { width: 1800, align: Align.RIGHT }),
        ],
      })
  );

  const itemsTable = new Tbl({
    width: { size: 9360, type: W.DXA },
    columnWidths: [4560, 1200, 1800, 1800],
    rows: [tableHeader, ...itemRows],
  });

  const totalLines: Para[] = [
    new Para({
      spacing: { before: 200 },
      alignment: Align.RIGHT,
      children: [
        new Run({
          text: label("Subtotal", "Subtotal") + ": " + formatMoney(totals.subtotal, invoice.currency),
          size: 20,
          font: "Calibri",
        }),
      ],
    }),
  ];
  if (totals.discountAmount > 0) {
    totalLines.push(
      new Para({
        alignment: Align.RIGHT,
        children: [
          new Run({
            text: label("Discount", "Descuento") + ": -" + formatMoney(totals.discountAmount, invoice.currency),
            size: 20,
            font: "Calibri",
          }),
        ],
      })
    );
  }
  if (invoice.taxRate > 0) {
    totalLines.push(
      new Para({
        alignment: Align.RIGHT,
        children: [
          new Run({
            text:
              label("Tax", "Impuesto") +
              " (" +
              invoice.taxRate +
              "%): " +
              formatMoney(totals.taxAmount, invoice.currency),
            size: 20,
            font: "Calibri",
          }),
        ],
      })
    );
  }
  totalLines.push(
    new Para({
      spacing: { before: 80 },
      alignment: Align.RIGHT,
      children: [
        new Run({
          text: label("Total", "Total") + ": " + formatMoney(totals.total, invoice.currency),
          bold: true,
          size: 26,
          color: accent,
          font: "Calibri",
        }),
      ],
    })
  );

  const children: (Para | Tbl)[] = [header, meta, formatLine, parties, new Para({ spacing: { before: 280 }, children: [] }), itemsTable, ...totalLines];

  if (invoice.paymentTerms) {
    children.push(
      new Para({
        spacing: { before: 280 },
        children: [new Run({ text: label("Payment terms", "Términos de pago"), bold: true, size: 18, color: accent, font: "Calibri" })],
      }),
      new Para({
        children: [new Run({ text: invoice.paymentTerms, size: 18, color: "475569", font: "Calibri" })],
      })
    );
  }
  if (invoice.notes) {
    children.push(
      new Para({
        spacing: { before: 200 },
        children: [new Run({ text: label("Notes", "Notas"), bold: true, size: 18, color: accent, font: "Calibri" })],
      }),
      new Para({
        children: [new Run({ text: invoice.notes, size: 18, color: "475569", font: "Calibri" })],
      })
    );
  }

  children.push(
    new Para({
      spacing: { before: 400 },
      children: [
        new Run({
          text: "Formatted with CLT Gems Invoice Library — opens cleanly in Microsoft Word.",
          size: 14,
          color: "94A3B8",
          font: "Calibri",
          italics: true,
        }),
      ],
    })
  );

  const doc = new Doc({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Pack.toBlob(doc);
  const filename = (invoice.invoiceNumber || "invoice").replace(/[^a-zA-Z0-9-_]/g, "_") + ".docx";
  saveAs(blob, filename);
}
