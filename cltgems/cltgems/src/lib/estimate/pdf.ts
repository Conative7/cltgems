import { jsPDF } from "jspdf";
import { formatMoney } from "../calculations";
import { triggerBlobDownload } from "../export/download";
import { DISCLAIMER } from "./defaults";
import { calcEstimateTotals, lineAmount } from "./calc";
import { estimateFilename } from "./filename";
import type { EstimateAgreement } from "./types";

function buildPdf(data: EstimateAgreement): { blob: Blob; filename: string } {
  const totals = calcEstimateTotals(data);
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;
  const gem: [number, number, number] = [15, 118, 110];

  doc.setFillColor(...gem);
  doc.rect(0, 0, pageW, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(28, 25, 23);
  doc.text("ESTIMATE & AGREEMENT", margin, y + 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 113, 108);
  doc.text("Simple work agreement / estimate acceptance", margin, y + 40);

  const metaX = pageW - margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(28, 25, 23);
  doc.text(data.documentNumber, metaX, y + 24, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 113, 108);
  doc.text("Issued: " + data.issueDate, metaX, y + 40, { align: "right" });
  doc.text("Valid until: " + data.validUntil, metaX, y + 54, { align: "right" });

  y += 78;

  const colW = (pageW - margin * 2 - 24) / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...gem);
  doc.text("FROM", margin, y);
  doc.text("CLIENT", margin + colW + 24, y);
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(28, 25, 23);
  doc.text(data.businessName || "—", margin, y);
  doc.text(data.clientName || "—", margin + colW + 24, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 113, 108);
  const left = [data.businessEmail, data.businessPhone].filter(Boolean) as string[];
  const right = [data.clientEmail, data.clientPhone].filter(Boolean) as string[];
  const max = Math.max(left.length, right.length, 1);
  for (let i = 0; i < max; i++) {
    if (left[i]) doc.text(left[i], margin, y + i * 12);
    if (right[i]) doc.text(right[i], margin + colW + 24, y + i * 12);
  }
  y += max * 12 + 18;

  if (data.jobAddress || data.jobCityStateZip) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...gem);
    doc.text("JOB ADDRESS", margin, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(28, 25, 23);
    doc.text(
      [data.jobAddress, data.jobCityStateZip].filter(Boolean).join(", ") || "—",
      margin,
      y
    );
    y += 20;
  }

  if (data.timeline) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...gem);
    doc.text("TIMELINE", margin, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(28, 25, 23);
    const tw = doc.splitTextToSize(data.timeline, pageW - margin * 2);
    doc.text(tw, margin, y);
    y += tw.length * 12 + 16;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...gem);
  doc.text("SCOPE OF WORK", margin, y);
  y += 14;

  if (data.scopeMode === "bullets") {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(28, 25, 23);
    const bullets = data.scopeBullets.map((b) => b.trim()).filter(Boolean);
    (bullets.length ? bullets : ["—"]).forEach((b) => {
      const wrapped = doc.splitTextToSize("•  " + b, pageW - margin * 2);
      if (y > 680) {
        doc.addPage();
        y = margin;
      }
      doc.text(wrapped, margin, y);
      y += wrapped.length * 12 + 4;
    });
    y += 8;
  } else {
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y - 10, pageW - margin * 2, 20, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(120, 113, 108);
    const descX = margin + 8;
    const qtyX = pageW - margin - 200;
    const priceX = pageW - margin - 110;
    const amtX = pageW - margin - 8;
    doc.text("DESCRIPTION", descX, y);
    doc.text("QTY", qtyX, y, { align: "right" });
    doc.text("PRICE", priceX, y, { align: "right" });
    doc.text("AMOUNT", amtX, y, { align: "right" });
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(28, 25, 23);
    data.lineItems.forEach((item) => {
      if (y > 680) {
        doc.addPage();
        y = margin;
      }
      const amount = lineAmount(item);
      const wrapped = doc.splitTextToSize(item.description || "—", qtyX - descX - 16);
      doc.text(wrapped, descX, y);
      doc.text(String(item.quantity || 0) + (item.unit ? " " + item.unit : ""), qtyX, y, {
        align: "right",
      });
      doc.text(formatMoney(item.unitPrice, data.currency), priceX, y, { align: "right" });
      doc.text(formatMoney(amount, data.currency), amtX, y, { align: "right" });
      y += Math.max(16, wrapped.length * 12 + 4);
    });
  }

  y += 10;
  doc.setDrawColor(231, 229, 228);
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  const totalsX = pageW - margin - 180;
  const valueX = pageW - margin;
  const rows: [string, string, boolean?][] = [
    ["Estimate total", formatMoney(totals.subtotal, data.currency), true],
  ];
  if (totals.depositAmount > 0) {
    rows.push(["Deposit due", formatMoney(totals.depositAmount, data.currency)]);
    rows.push(["Balance after deposit", formatMoney(totals.balanceDue, data.currency)]);
  }
  rows.forEach(([lab, val, bold]) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 12 : 10);
    doc.setTextColor(28, 25, 23);
    doc.text(lab, totalsX, y);
    doc.text(val, valueX, y, { align: "right" });
    y += bold ? 20 : 16;
  });

  if (data.notes.trim()) {
    y += 12;
    if (y > 680) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...gem);
    doc.text("NOTES", margin, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 113, 108);
    const nw = doc.splitTextToSize(data.notes, pageW - margin * 2);
    doc.text(nw, margin, y);
    y += nw.length * 12 + 12;
  }

  y += 16;
  if (y > 640) {
    doc.addPage();
    y = margin;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...gem);
  doc.text("ACCEPTANCE", margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    "By signing below, the client accepts this estimate as a simple work agreement for the scope described.",
    margin,
    y
  );
  y += 28;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, margin + 200, y);
  doc.line(margin + 240, y, pageW - margin, y);
  y += 12;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Client signature / date", margin, y);
  doc.text("Provider signature / date", margin + 240, y);

  y += 28;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  const disc = doc.splitTextToSize(DISCLAIMER, pageW - margin * 2);
  doc.text(disc, margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("AI Bloom — AI made simple. Learn. Try. Grow. · aibloom.agency", pageW / 2, 760, {
    align: "center",
  });

  const filename = estimateFilename(data.documentNumber, "pdf");
  return { blob: doc.output("blob"), filename };
}

export function buildEstimatePdfBlob(data: EstimateAgreement): { blob: Blob; filename: string } {
  return buildPdf(data);
}

export async function downloadEstimatePdf(
  data: EstimateAgreement
): Promise<{ blob: Blob; filename: string }> {
  const { blob, filename } = buildPdf(data);
  await triggerBlobDownload(blob, filename);
  return { blob, filename };
}

