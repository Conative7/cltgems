"use client";

import { ClipboardList, FileText } from "lucide-react";
import { formatMoney } from "@/lib/calculations";
import type { EstimateBreakdown } from "@/lib/pricing";

export function EstimateSummary({
  estimate,
  onCreateInvoice,
  onCreateEstimate,
}: {
  estimate: EstimateBreakdown;
  onCreateInvoice: () => void;
  onCreateEstimate: () => void;
}) {
  return (
    <div className="card p-5 sm:p-6 space-y-5">
      <div>
        <h2 className="font-display text-lg font-bold text-ink">Ballpark estimate</h2>
        <p className="mt-1 text-xs text-muted leading-relaxed">
          Ballpark estimate for planning — not a formal bid or contract.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl border border-border bg-warm p-3 text-center">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">Low</p>
          <p className="mt-1 font-display text-lg sm:text-xl font-extrabold text-ink">
            {formatMoney(estimate.low)}
          </p>
        </div>
        <div className="rounded-xl border-2 border-gem bg-gem-mist p-3 text-center">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-gem-dark">Target</p>
          <p className="mt-1 font-display text-lg sm:text-xl font-extrabold text-gem-dark">
            {formatMoney(estimate.target)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-warm p-3 text-center">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">High</p>
          <p className="mt-1 font-display text-lg sm:text-xl font-extrabold text-ink">
            {formatMoney(estimate.high)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border">
              <td className="px-3 py-2 text-muted">Labor ({estimate.laborHours} hrs)</td>
              <td className="px-3 py-2 text-right font-semibold tabular-nums">
                {formatMoney(estimate.laborCost)}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2 text-muted">Materials / supplies</td>
              <td className="px-3 py-2 text-right font-semibold tabular-nums">
                {formatMoney(estimate.materialsCost)}
              </td>
            </tr>
            {estimate.contingencyCost > 0 ? (
              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted">Contingency</td>
                <td className="px-3 py-2 text-right font-semibold tabular-nums">
                  {formatMoney(estimate.contingencyCost)}
                </td>
              </tr>
            ) : null}
            <tr className="border-b border-border bg-stone-50">
              <td className="px-3 py-2 text-muted">Subtotal</td>
              <td className="px-3 py-2 text-right font-semibold tabular-nums">
                {formatMoney(estimate.subtotal)}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2 text-muted">Overhead ({estimate.overheadPct}%)</td>
              <td className="px-3 py-2 text-right font-semibold tabular-nums">
                {formatMoney(estimate.overheadCost)}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2 text-muted">Profit / margin ({estimate.profitPct}%)</td>
              <td className="px-3 py-2 text-right font-semibold tabular-nums">
                {formatMoney(estimate.profitCost)}
              </td>
            </tr>
            <tr className="bg-gem-mist">
              <td className="px-3 py-2.5 font-bold text-gem-dark">Target total</td>
              <td className="px-3 py-2.5 text-right font-extrabold text-gem-dark tabular-nums">
                {formatMoney(estimate.target)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {estimate.notes.length > 0 ? (
        <ul className="space-y-1 text-xs text-muted leading-relaxed">
          {estimate.notes.map((n, i) => (
            <li key={i}>• {n}</li>
          ))}
        </ul>
      ) : null}

      <p className="text-xs text-stone-500 leading-relaxed">
        Low/High are planning bands (± about the target). Tune hourly rates, overhead, and profit in{" "}
        <strong>Your rates</strong> — stored only in this browser.
      </p>

      <div className="rounded-xl border-2 border-gem/30 bg-gem-mist p-4 space-y-3">
        <p className="text-sm font-bold text-gem-dark">Next step with this target</p>
        <p className="text-xs text-stone-600 leading-relaxed">
          Send a simple estimate / work agreement first — or skip straight to a professional invoice.
        </p>
        <button type="button" className="btn btn-primary w-full" onClick={onCreateEstimate}>
          <ClipboardList className="h-4 w-4" />
          Create estimate / agreement
        </button>
        <button type="button" className="btn btn-secondary w-full" onClick={onCreateInvoice}>
          <FileText className="h-4 w-4" />
          Make invoice from this price
        </button>
      </div>
    </div>
  );
}
