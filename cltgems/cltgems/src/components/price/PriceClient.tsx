"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, HardHat, Sparkles } from "lucide-react";
import { CleaningForm } from "./CleaningForm";
import { ConstructionForm } from "./ConstructionForm";
import { EstimateSummary } from "./EstimateSummary";
import { RateDefaultsPanel } from "./RateDefaultsPanel";
import {
  DEFAULT_PRICING,
  buildCleaningHandoff,
  buildConstructionHandoff,
  calcCleaningEstimate,
  calcConstructionEstimate,
  defaultCleaningInputs,
  defaultConstructionInputs,
  loadPricingDefaults,
  resetPricingDefaults,
  savePriceHandoff,
  savePricingDefaults,
  type CleaningInputs,
  type ConstructionInputs,
  type PricingDefaults,
  type TradeId,
} from "@/lib/pricing";

const TRADES: { id: TradeId; label: string; desc: string; icon: typeof Sparkles }[] = [
  {
    id: "cleaning",
    label: "Cleaning",
    desc: "One-time or recurring visits by sq ft / rooms",
    icon: Sparkles,
  },
  {
    id: "construction",
    label: "General construction",
    desc: "Repair, remodel, or new work — hours or sq ft",
    icon: HardHat,
  },
];

const CLEANING_JOB_LABELS = {
  "one-time": "One-time",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
} as const;

const CLEANING_COND_LABELS = {
  light: "light",
  standard: "standard",
  heavy: "heavy",
} as const;

const CONSTRUCTION_JOB_LABELS = {
  repair: "Repair",
  remodel: "Remodel",
  "new-work": "New work",
} as const;

export function PriceClient({ initialTrade }: { initialTrade?: TradeId }) {
  const router = useRouter();
  const [trade, setTrade] = useState<TradeId>(initialTrade ?? "cleaning");
  const [defaults, setDefaults] = useState<PricingDefaults>(DEFAULT_PRICING);
  const [hydrated, setHydrated] = useState(false);
  const [cleaning, setCleaning] = useState<CleaningInputs>(() => defaultCleaningInputs());
  const [construction, setConstruction] = useState<ConstructionInputs>(() =>
    defaultConstructionInputs()
  );

  useEffect(() => {
    const loaded = loadPricingDefaults();
    setDefaults(loaded);
    setCleaning(defaultCleaningInputs(loaded.cleaning));
    setConstruction(defaultConstructionInputs(loaded.construction));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (initialTrade) setTrade(initialTrade);
  }, [initialTrade]);

  useEffect(() => {
    if (!hydrated) return;
    savePricingDefaults(defaults);
  }, [defaults, hydrated]);

  const estimate = useMemo(() => {
    if (trade === "cleaning") return calcCleaningEstimate(cleaning, defaults.cleaning);
    return calcConstructionEstimate(construction, defaults.construction);
  }, [trade, cleaning, construction, defaults]);

  function onDefaultsChange(next: PricingDefaults) {
    setDefaults(next);
  }

  function onResetDefaults() {
    const fresh = resetPricingDefaults();
    setDefaults(fresh);
    setCleaning((prev) => ({
      ...prev,
      crewSize: fresh.cleaning.defaultCrewSize,
      suppliesValue:
        prev.suppliesMode === "percent" ? fresh.cleaning.suppliesPct : prev.suppliesValue,
    }));
    setConstruction((prev) => ({
      ...prev,
      crewSize: fresh.construction.defaultCrewSize,
      contingencyPct: fresh.construction.contingencyPct,
    }));
  }

  function onCreateInvoice() {
    const payload =
      trade === "cleaning"
        ? buildCleaningHandoff({
            estimate,
            jobTypeLabel: CLEANING_JOB_LABELS[cleaning.jobType],
            conditionLabel: CLEANING_COND_LABELS[cleaning.condition],
            sqFt: cleaning.sqFt,
            rooms: cleaning.rooms,
          })
        : buildConstructionHandoff({
            estimate,
            jobTypeLabel: CONSTRUCTION_JOB_LABELS[construction.jobType],
            sqFt: construction.sqFt,
          });
    savePriceHandoff(payload);
    router.push(`/invoices/builder?from=price&format=${payload.formatId}`);
  }

  if (!hydrated) {
    return <div className="text-sm text-muted p-6">Loading calculator…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {TRADES.map((t) => {
          const Icon = t.icon;
          const active = trade === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTrade(t.id)}
              className={
                "card flex gap-3 p-4 text-left transition-shadow hover:shadow-md " +
                (active ? "border-gem ring-2 ring-gem/30 bg-gem-mist" : "")
              }
            >
              <span
                className={
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl " +
                  (active ? "bg-gem text-white" : "bg-stone-100 text-stone-600")
                }
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display font-bold text-ink">{t.label}</span>
                <span className="mt-0.5 block text-xs text-muted leading-relaxed">{t.desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="flex items-start gap-2 text-sm text-muted">
        <Calculator className="h-4 w-4 mt-0.5 shrink-0 text-gem" />
        More trades can plug in later — cleaning and general construction ship first.
      </p>

      <RateDefaultsPanel
        trade={trade}
        defaults={defaults}
        onChange={onDefaultsChange}
        onReset={onResetDefaults}
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {trade === "cleaning" ? (
          <CleaningForm inputs={cleaning} onChange={setCleaning} />
        ) : (
          <ConstructionForm inputs={construction} onChange={setConstruction} />
        )}
        <div className="lg:sticky lg:top-20">
          <EstimateSummary estimate={estimate} onCreateInvoice={onCreateInvoice} />
        </div>
      </div>
    </div>
  );
}
