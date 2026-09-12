"use client";

import { formatMoney, lineItemAmount } from "@/lib/calculations";
import { getFormat } from "@/lib/formats";
import type { InvoiceData, InvoiceTotals } from "@/lib/types";

export function InvoicePreview({
  invoice,
  totals,
}: {
  invoice: InvoiceData;
  totals: InvoiceTotals;
}) {
  const format = getFormat(invoice.formatId);
  const accent = format?.accent ?? "#2563eb";
  const bilingual = invoice.bilingual || invoice.formatId === "bilingual-en-es";
  const L = (en: string, es: string) => (bilingual ? en + " / " + es : en);

  return (
    <div className="invoice-paper text-sm">
      <div className="h-1.5 w-full rounded-full mb-4" style={{ background: accent }} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xl font-bold tracking-tight" style={{ color: accent }}>
            {bilingual ? "INVOICE / FACTURA" : "INVOICE"}
          </div>
          <div className="text-xs text-muted mt-1">{format?.name}</div>
        </div>
        <div className="text-right text-xs text-slate-600">
          <div className="font-bold text-ink text-sm">{invoice.invoiceNumber || "INV-XXXX"}</div>
          <div>
            {L("Issue", "Emisión")}: {invoice.issueDate || "—"}
          </div>
          <div>
            {L("Due", "Vence")}: {invoice.dueDate || "—"}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: accent }}>
            {L("From", "De")}
          </div>
          <div className="mt-1 font-semibold text-ink">{invoice.business.name || "Your business"}</div>
          <div className="text-xs text-slate-600 whitespace-pre-line">
            {[invoice.business.address, invoice.business.cityStateZip, invoice.business.email, invoice.business.phone]
              .filter(Boolean)
              .join("\n")}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: accent }}>
            {L("Bill to", "Facturar a")}
          </div>
          <div className="mt-1 font-semibold text-ink">
            {invoice.client.company || invoice.client.name || "Client"}
          </div>
          <div className="text-xs text-slate-600 whitespace-pre-line">
            {[
              invoice.client.company && invoice.client.name ? invoice.client.name : "",
              invoice.client.address,
              invoice.client.cityStateZip,
              invoice.client.email,
              invoice.client.phone,
            ]
              .filter(Boolean)
              .join("\n")}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-slate-50">
              <th className="py-2 px-2 font-semibold text-slate-500">{L("Description", "Descripción")}</th>
              <th className="py-2 px-2 font-semibold text-slate-500 text-right">{L("Qty", "Cant")}</th>
              <th className="py-2 px-2 font-semibold text-slate-500 text-right">{L("Price", "Precio")}</th>
              <th className="py-2 px-2 font-semibold text-slate-500 text-right">{L("Amount", "Importe")}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="py-2 px-2 text-ink">{item.description || "—"}</td>
                <td className="py-2 px-2 text-right text-slate-600">
                  {item.quantity}
                  {item.unit ? " " + item.unit : ""}
                </td>
                <td className="py-2 px-2 text-right text-slate-600">
                  {formatMoney(Number(item.unitPrice) || 0, invoice.currency)}
                </td>
                <td className="py-2 px-2 text-right font-medium text-ink">
                  {formatMoney(lineItemAmount(item), invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <dl className="w-52 space-y-1 text-xs">
          <div className="flex justify-between">
            <dt className="text-muted">{L("Subtotal", "Subtotal")}</dt>
            <dd className="font-medium">{formatMoney(totals.subtotal, invoice.currency)}</dd>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">{L("Discount", "Descuento")}</dt>
              <dd className="font-medium">-{formatMoney(totals.discountAmount, invoice.currency)}</dd>
            </div>
          )}
          {invoice.taxRate > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">
                {L("Tax", "Impuesto")} ({invoice.taxRate}%)
              </dt>
              <dd className="font-medium">{formatMoney(totals.taxAmount, invoice.currency)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-2 text-sm">
            <dt className="font-bold" style={{ color: accent }}>
              {L("Total", "Total")}
            </dt>
            <dd className="font-bold" style={{ color: accent }}>
              {formatMoney(totals.total, invoice.currency)}
            </dd>
          </div>
        </dl>
      </div>

      {(invoice.paymentTerms || invoice.notes) && (
        <div className="mt-6 space-y-3 border-t border-border pt-4 text-xs text-slate-600">
          {invoice.paymentTerms ? (
            <div>
              <div className="font-bold uppercase tracking-wide text-[10px]" style={{ color: accent }}>
                {L("Payment terms", "Términos de pago")}
              </div>
              <p className="mt-1">{invoice.paymentTerms}</p>
            </div>
          ) : null}
          {invoice.notes ? (
            <div>
              <div className="font-bold uppercase tracking-wide text-[10px]" style={{ color: accent }}>
                {L("Notes", "Notas")}
              </div>
              <p className="mt-1 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
