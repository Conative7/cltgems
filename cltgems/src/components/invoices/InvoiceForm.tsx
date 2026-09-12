"use client";

import { Plus, Trash2 } from "lucide-react";
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
    <div className="space-y-5">
      <section className="card p-4 space-y-3">
        <h2 className="text-sm font-bold text-ink">Format & meta</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Invoice format</label>
            <select
              className="input"
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
              className="input"
              value={invoice.invoiceNumber}
              onChange={(e) => update({ invoiceNumber: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Currency</label>
            <input
              className="input"
              value={invoice.currency}
              onChange={(e) => update({ currency: e.target.value.toUpperCase() })}
            />
          </div>
          <div>
            <label className="label">Issue date</label>
            <input
              type="date"
              className="input"
              value={invoice.issueDate}
              onChange={(e) => update({ issueDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Due date</label>
            <input
              type="date"
              className="input"
              value={invoice.dueDate}
              onChange={(e) => update({ dueDate: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="text-sm font-bold text-ink">Your business</h2>
        <div className="grid gap-3 sm:grid-cols-2">
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
                className="input"
                value={invoice.business[key] ?? ""}
                onChange={(e) => updateBusiness({ [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="text-sm font-bold text-ink">Client</h2>
        <div className="grid gap-3 sm:grid-cols-2">
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
                className="input"
                value={invoice.client[key] ?? ""}
                onChange={(e) => updateClient({ [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-ink">Line items</h2>
          <button type="button" className="btn btn-secondary text-xs" onClick={addLineItem}>
            <Plus className="h-3.5 w-3.5" /> Add line
          </button>
        </div>
        <div className="space-y-3">
          {invoice.lineItems.map((item, idx) => (
            <div key={item.id} className="rounded-lg border border-border p-3 space-y-2 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">Line {idx + 1}</span>
                <button
                  type="button"
                  className="text-slate-400 hover:text-red-600"
                  onClick={() => removeLineItem(item.id)}
                  aria-label="Remove line"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div>
                <label className="label">Description</label>
                <input
                  className="input"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="label">Qty</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className="input"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, { quantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="label">Unit</label>
                  <input
                    className="input"
                    value={item.unit ?? ""}
                    onChange={(e) => updateLineItem(item.id, { unit: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Unit price</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className="input"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, { unitPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="text-sm font-bold text-ink">Tax, discount & terms</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="label">Tax rate %</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="input"
              value={invoice.taxRate}
              onChange={(e) => update({ taxRate: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="label">Discount type</label>
            <select
              className="input"
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
            <input
              type="number"
              min={0}
              step="0.01"
              className="input"
              disabled={invoice.discountType === "none"}
              value={invoice.discountValue}
              onChange={(e) => update({ discountValue: Number(e.target.value) })}
            />
          </div>
          <div className="sm:col-span-3">
            <label className="label">Payment terms</label>
            <input
              className="input"
              value={invoice.paymentTerms}
              onChange={(e) => update({ paymentTerms: e.target.value })}
            />
          </div>
          <div className="sm:col-span-3">
            <label className="label">Notes</label>
            <textarea
              className="input min-h-[80px]"
              value={invoice.notes}
              onChange={(e) => update({ notes: e.target.value })}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
