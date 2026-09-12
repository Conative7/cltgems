"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import type { PricingDefaults, TradeId } from "@/lib/pricing";

export function RateDefaultsPanel({
  trade,
  defaults,
  onChange,
  onReset,
}: {
  trade: TradeId;
  defaults: PricingDefaults;
  onChange: (next: PricingDefaults) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const c = defaults.cleaning;
  const g = defaults.construction;

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-stone-50"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div>
          <p className="text-sm font-bold text-ink">Your rates (editable defaults)</p>
          <p className="text-xs text-muted">
            Charlotte-friendly starters — not market guarantees. Saved in this browser only.
          </p>
        </div>
        <ChevronDown className={"h-5 w-5 text-muted transition-transform " + (open ? "rotate-180" : "")} />
      </button>

      {open ? (
        <div className="border-t border-border px-4 py-4 space-y-4">
          {trade === "cleaning" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Hourly rate ($/person-hr)"
                value={c.hourlyRate}
                onChange={(v) =>
                  onChange({ ...defaults, cleaning: { ...c, hourlyRate: v } })
                }
              />
              <Field
                label="Productivity (sq ft / person-hr)"
                value={c.sqFtPerPersonHour}
                onChange={(v) =>
                  onChange({ ...defaults, cleaning: { ...c, sqFtPerPersonHour: v } })
                }
              />
              <Field
                label="Default crew size"
                value={c.defaultCrewSize}
                onChange={(v) =>
                  onChange({ ...defaults, cleaning: { ...c, defaultCrewSize: v } })
                }
              />
              <Field
                label="Default supplies %"
                value={c.suppliesPct}
                onChange={(v) =>
                  onChange({ ...defaults, cleaning: { ...c, suppliesPct: v } })
                }
              />
              <Field
                label="Overhead %"
                value={c.overheadPct}
                onChange={(v) =>
                  onChange({ ...defaults, cleaning: { ...c, overheadPct: v } })
                }
              />
              <Field
                label="Profit / margin %"
                value={c.profitPct}
                onChange={(v) =>
                  onChange({ ...defaults, cleaning: { ...c, profitPct: v } })
                }
              />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Crew hourly rate ($)"
                value={g.hourlyRate}
                onChange={(v) =>
                  onChange({ ...defaults, construction: { ...g, hourlyRate: v } })
                }
              />
              <Field
                label="Labor $/sq ft"
                value={g.laborPerSqFt}
                onChange={(v) =>
                  onChange({ ...defaults, construction: { ...g, laborPerSqFt: v } })
                }
              />
              <Field
                label="Default crew size"
                value={g.defaultCrewSize}
                onChange={(v) =>
                  onChange({ ...defaults, construction: { ...g, defaultCrewSize: v } })
                }
              />
              <Field
                label="Default contingency %"
                value={g.contingencyPct}
                onChange={(v) =>
                  onChange({ ...defaults, construction: { ...g, contingencyPct: v } })
                }
              />
              <Field
                label="Overhead %"
                value={g.overheadPct}
                onChange={(v) =>
                  onChange({ ...defaults, construction: { ...g, overheadPct: v } })
                }
              />
              <Field
                label="Profit / margin %"
                value={g.profitPct}
                onChange={(v) =>
                  onChange({ ...defaults, construction: { ...g, profitPct: v } })
                }
              />
            </div>
          )}

          <button type="button" className="btn btn-secondary text-xs" onClick={onReset}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset to CLT starters
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        className="input"
        type="number"
        min={0}
        step="any"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </label>
  );
}
