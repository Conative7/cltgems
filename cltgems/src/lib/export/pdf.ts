import { jsPDF } from "jspdf";
import { calcTotals, formatMoney, formatQty, formatTaxPercent, lineItemAmount, normalizeTaxRate } from "../calculations";
import { getFormat } from "../formats";
import type { InvoiceData } from "../types";
import { invoiceFilename, triggerBlobDownload } from "./download";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function buildPdf(invoice: InvoiceData): { blob: Blob; filename: string } {
  const format = getFormat(invoice.formatId);
  const accent = format?.accent ?? "#2563eb";
  const [ar, ag, ab] = hexToRgb(accent);
  const totals = calcTotals(invoice);
  const bilingual = invoice.bilingual || invoice.formatId === "bilingual-en-es";
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;

  const label = (en: string, es: string) => (bilingual ? en + " / " + es : en);

  doc.setFillColor(ar, ag, ab);
  doc.rect(0, 0, pageW, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text(bilingual ? "INVOICE / FACTURA" : "INVOICE", margin, y + 24);

  if (invoice.business.name) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(invoice.business.name, margin, y + 42);
  }

  const metaX = pageW - margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(invoice.invoiceNumber, metaX, y + 24, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(label("Issue", "Emisión") + ": " + invoice.issueDate, metaX, y + 40, { align: "right" });
  doc.text(label("Due", "Vence") + ": " + invoice.dueDate, metaX, y + 54, { align: "right" });

  y += 80;

  const colW = (pageW - margin * 2 - 24) / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(ar, ag, ab);
  doc.text(label("FROM", "DE"), margin, y);
  doc.text(label("BILL TO", "FACTURAR A"), margin + colW + 24, y);
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(invoice.business.name || "—", margin, y);
  doc.text(
    invoice.client.company || invoice.client.name || "—",
    margin + colW + 24,
    y
  );
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const leftLines = [
    invoice.business.address,
    invoice.business.cityStateZip,
    invoice.business.email,
    invoice.business.phone,
    invoice.business.website,
  ].filter(Boolean) as string[];
  const rightLines = [
    invoice.client.company && invoice.client.name ? invoice.client.name : "",
    invoice.client.address,
    invoice.client.cityStateZip,
    invoice.client.email,
    invoice.client.phone,
  ].filter(Boolean) as string[];

  const maxLines = Math.max(leftLines.length, rightLines.length, 1);
  for (let i = 0; i < maxLines; i++) {
    if (leftLines[i]) doc.text(leftLines[i], margin, y + i * 12);
    if (rightLines[i]) doc.text(rightLines[i], margin + colW + 24, y + i * 12);
  }
  y += maxLines * 12 + 28;

  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y - 12, pageW - margin * 2, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const descX = margin + 8;
  const qtyX = pageW - margin - 220;
  const priceX = pageW - margin - 140;
  const amtX = pageW - margin - 8;
  doc.text(label("DESCRIPTION", "DESCRIPCIÓN"), descX, y);
  doc.text(label("QTY", "CANT"), qtyX, y, { align: "right" });
  doc.text(label("PRICE", "PRECIO"), priceX, y, { align: "right" });
  doc.text(label("AMOUNT", "IMPORTE"), amtX, y, { align: "right" });
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  invoice.lineItems.forEach((item) => {
    const amount = lineItemAmount(item);
    const desc = item.description || "—";
    const wrapped = doc.splitTextToSize(desc, qtyX - descX - 16);
    doc.text(wrapped, descX, y);
    doc.text(formatQty(Number(item.quantity) || 0, item.unit), qtyX, y, { align: "right" });
    doc.text(formatMoney(item.unitPrice, invoice.currency), priceX, y, { align: "right" });
    doc.text(formatMoney(amount, invoice.currency), amtX, y, { align: "right" });
    y += Math.max(16, wrapped.length * 12 + 4);
    if (y > 700) {
      doc.addPage();
      y = margin;
    }
  });

  y += 8;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  const totalsX = pageW - margin - 180;
  const valueX = pageW - margin;
  const rows: [string, string, boolean?][] = [
    [label("Subtotal", "Subtotal"), formatMoney(totals.subtotal, invoice.currency)],
  ];
  if (totals.discountAmount > 0) {
    rows.push([label("Discount", "Descuento"), "-" + formatMoney(totals.discountAmount, invoice.currency)]);
  }
  const taxRate = normalizeTaxRate(invoice.taxRate);
  if (taxRate > 0) {
    rows.push([
      label("Sales tax", "Impuesto") + " (" + formatTaxPercent(taxRate) + "%)",
      formatMoney(totals.taxAmount, invoice.currency),
    ]);
  }
  rows.push([label("Amount due", "Total a pagar"), formatMoney(totals.total, invoice.currency), true]);

  rows.forEach(([lab, val, bold]) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 12 : 10);
    doc.setTextColor(15, 23, 42);
    doc.text(lab, totalsX, y);
    doc.text(val, valueX, y, { align: "right" });
    y += bold ? 20 : 16;
  });

  y += 16;
  if (invoice.paymentTerms) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(ar, ag, ab);
    doc.text(label("Payment terms", "Términos de pago"), margin, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const terms = doc.splitTextToSize(invoice.paymentTerms, pageW - margin * 2);
    doc.text(terms, margin, y);
    y += terms.length * 12 + 10;
  }

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("AI Bloom — AI made simple. Learn. Try. Grow. · aibloom.agency", pageW / 2, 760, {
    align: "center",
  });

  const filename = invoiceFilename(invoice.invoiceNumber, "pdf");
  const blob = doc.output("blob");
  return { blob, filename };
}

/** Build PDF blob without downloading (for share / email helpers). */
export function buildInvoicePdfBlob(invoice: InvoiceData): { blob: Blob; filename: string } {
  return buildPdf(invoice);
}

/** Generate and download PDF. Resolves only after a download is triggered successfully. */
export async function downloadInvoicePdf(invoice: InvoiceData): Promise<{ blob: Blob; filename: string }> {
  const { blob, filename } = buildPdf(invoice);
  await triggerBlobDownload(blob, filename);
  return { blob, filename };
}
