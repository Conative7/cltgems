import type { InvoiceData, InvoiceTotals, LineItem } from "./types";

export function lineItemAmount(item: LineItem): number {
  const qty = Number(item.quantity) || 0;
  const price = Number(item.unitPrice) || 0;
  return round2(qty * price);
}

export function calcSubtotal(items: LineItem[]): number {
  return round2(items.reduce((sum, item) => sum + lineItemAmount(item), 0));
}

export function calcDiscount(
  subtotal: number,
  discountType: InvoiceData["discountType"],
  discountValue: number
): number {
  const value = Number(discountValue) || 0;
  if (discountType === "percent") {
    return round2(Math.min(subtotal, (subtotal * value) / 100));
  }
  if (discountType === "fixed") {
    return round2(Math.min(subtotal, value));
  }
  return 0;
}

/** Keep tax rates in a sane percent range (0–40). Fixes typos like 723. */
export function normalizeTaxRate(raw: number): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n > 40) return 0;
  return round2(n);
}

export function formatTaxPercent(rate: number): string {
  const n = normalizeTaxRate(rate);
  if (n === 0) return "0";
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function calcTotals(invoice: InvoiceData): InvoiceTotals {
  const subtotal = calcSubtotal(invoice.lineItems);
  const discountAmount = calcDiscount(
    subtotal,
    invoice.discountType,
    invoice.discountValue
  );
  const taxableAmount = round2(Math.max(0, subtotal - discountAmount));
  const taxRate = normalizeTaxRate(invoice.taxRate);
  const taxAmount = round2((taxableAmount * taxRate) / 100);
  const total = round2(taxableAmount + taxAmount);
  return { subtotal, discountAmount, taxableAmount, taxAmount, total };
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatMoney(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return "$" + amount.toFixed(2);
  }
}

export function formatQty(qty: number, unit?: string): string {
  const n = Number(qty) || 0;
  const q = Number.isInteger(n) ? String(n) : round2(n).toFixed(2).replace(/\.?0+$/, "");
  return unit ? q + " " + unit : q;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function defaultDueDate(days = 30): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
