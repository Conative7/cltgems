"use client";

import { Plus, Trash2 } from "lucide-react";
import { DecimalInput } from "@/components/ui/DecimalInput";
import { INVOICE_FORMATS } from "@/lib/formats";
import type { FormatId, InvoiceData, LineItem } from "@/lib/types";

type Props = {
  invoice: InvoiceData;
  update: (patch: Partial<InvoiceData>) => void;
  updateBusiness: (patch: Partial<InvoiceData["business"]>) => void;
  updateClient: (patch: Partial<InvoiceData["client"]>) => void;
  updateLineItem: (id: string, patch: Partial<LineItem>) => void;
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  setFormat: (id: FormatId) => void;
};

export function InvoiceForm({
  invoice,
  update,
  updateBusiness,
  updateClient,
  updateLineItem,
  addLineItem,
  removeLineItem,
  setFormat,
}: Props) {
  return (
    <div className="space-y-5 pb-28 md:pb-0">
      <section className="card p-4 sm:p-5 space-y-4">
        <h2 className="text-sm font-bold text-ink">Format & meta</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Invoice format</label>
            <select
              className="input min-h-11"
              value={invoice.formatId}
              onChange={(e) => setFormat(e.target.value as FormatId)}
            >
              {INVOICE_FORMATS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Invoice #</label>
            <input
              className="input min-h-11"
              value={invoice.invoiceNumber}
              onChange={(e) => update({ invoiceNumber: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Currency</label>
            <input
              className="input min-h-11"
              value={invoice.currency}
              onChange={(e) => update({ currency: e.target.value.toUpperCase() })}
            />
          </div>
          <div>
            <label className="label">Issue date</label>
            <input
              type="date"
              className="input min-h-11"
              value={invoice.issueDate}
              onChange={(e) => update({ issueDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Due date</label>
            <input
              type="date"
              className="input min-h-11"
              value={invoice.dueDate}
              onChange={(e) => update({ dueDate: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="card p-4 sm:p-5 space-y-4">
        <h2 className="text-sm font-bold text-ink">Your business</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["name", "Business name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["website", "Website"],
              ["address", "Street address"],
              ["cityStateZip", "City, state, ZIP"],
              ["taxId", "Tax ID (optional)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className={key === "address" || key === "cityStateZip" ? "sm:col-span-2" : ""}>
              <label className="label">{label}</label>
              <input
                className="input min-h-11"
                value={invoice.business[key] ?? ""}
                onChange={(e) => updateBusiness({ [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4 sm:p-5 space-y-4">
        <h2 className="text-sm font-bold text-ink">Client</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["company", "Company"],
              ["name", "Contact name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["address", "Street address"],
              ["cityStateZip", "City, state, ZIP"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className={key === "address" || key === "cityStateZip" ? "sm:col-span-2" : ""}>
              <label className="label">{label}</label>
              <input
                className="input min-h-11"
                value={invoice.client[key] ?? ""}
                onChange={(e) => updateClient({ [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-ink">Line items</h2>
          <button type="button" className="btn btn-secondary text-sm min-h-10 px-3" onClick={addLineItem}>
            <Plus className="h-4 w-4" /> Add line
          </button>
        </div>
        <div className="space-y-4">
          {invoice.lineItems.map((item, idx) => (
            <div key={item.id} className="rounded-xl border border-border p-4 space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">Line {idx + 1}</span>
                <button
                  type="button"
                  className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                  onClick={() => removeLineItem(item.id)}
                  aria-label="Remove line"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div>
                <label className="label">Description</label>
                <input
                  className="input min-h-11"
                  value={item.description}
                  placeholder="What was done or sold"
                  onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="label">Qty</label>
                  <DecimalInput
                    className="input min-h-11"
                    value={item.quantity}
                    onChange={(n) => updateLineItem(item.id, { quantity: n })}
                    aria-label="Quantity"
                  />
                </div>
                <div>
                  <label className="label">Unit</label>
                  <input
                    className="input min-h-11"
                    value={item.unit ?? ""}
                    placeholder="hrs, ea, job…"
                    onChange={(e) => updateLineItem(item.id, { unit: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Unit price</label>
                  <DecimalInput
                    className="input min-h-11"
                    value={item.unitPrice}
                    onChange={(n) => updateLineItem(item.id, { unitPrice: n })}
                    aria-label="Unit price"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4 sm:p-5 space-y-4">
        <h2 className="text-sm font-bold text-ink">Tax, discount & terms</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Tax rate %</label>
            <DecimalInput
              className="input min-h-11"
              value={invoice.taxRate}
              onChange={(n) => update({ taxRate: n })}
              aria-label="Tax rate percent"
              placeholder="7.25"
            />
          </div>
          <div>
            <label className="label">Discount type</label>
            <select
              className="input min-h-11"
              value={invoice.discountType}
              onChange={(e) =>
                update({ discountType: e.target.value as InvoiceData["discountType"] })
              }
            >
              <option value="none">None</option>
              <option value="percent">Percent</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </div>
          <div>
            <label className="label">Discount value</label>
            <DecimalInput
              className="input min-h-11"
              disabled={invoice.discountType === "none"}
              value={invoice.discountValue}
              onChange={(n) => update({ discountValue: n })}
              aria-label="Discount value"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="label">Payment terms</label>
            <input
              className="input min-h-11"
              value={invoice.paymentTerms}
              onChange={(e) => update({ paymentTerms: e.target.value })}
            />
          </div>
          <div className="sm:col-span-3">
            <label className="label">Notes</label>
            <textarea
              className="input min-h-[96px]"
              value={invoice.notes}
              onChange={(e) => update({ notes: e.target.value })}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
