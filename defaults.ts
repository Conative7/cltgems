import type { CleaningInputs, ConstructionInputs, PricingDefaults } from "./types";

/** Charlotte-friendly starter rates — labeled as editable defaults, not market guarantees. */
export const DEFAULT_PRICING: PricingDefaults = {
  cleaning: {
    hourlyRate: 42,
    sqFtPerPersonHour: 350,
    suppliesPct: 8,
    defaultCrewSize: 2,
    overheadPct: 12,
    profitPct: 18,
  },
  construction: {
    hourlyRate: 55,
    laborPerSqFt: 28,
    contingencyPct: 10,
    defaultCrewSize: 2,
    overheadPct: 15,
    profitPct: 20,
  },
};

export function defaultCleaningInputs(defaults = DEFAULT_PRICING.cleaning): CleaningInputs {
  return {
    jobType: "one-time",
    sqFt: 1200,
    rooms: 0,
    useRoomsForHours: false,
    condition: "standard",
    crewSize: defaults.defaultCrewSize,
    hoursOverride: 0,
    suppliesMode: "percent",
    suppliesValue: defaults.suppliesPct,
  };
}

export function defaultConstructionInputs(
  defaults = DEFAULT_PRICING.construction
): ConstructionInputs {
  return {
    jobType: "repair",
    sqFt: 200,
    laborHours: 0,
    materialBudget: 500,
    crewSize: defaults.defaultCrewSize,
    contingencyPct: defaults.contingencyPct,
  };
}

export const CLEANING_CONDITION_MULT = {
  light: 0.85,
  standard: 1,
  heavy: 1.35,
} as const;

/** Recurring jobs often price a bit lower per visit than one-time deep cleans. */
export const CLEANING_JOB_MULT = {
  "one-time": 1,
  weekly: 0.92,
  biweekly: 0.95,
  monthly: 0.97,
} as const;

export const CONSTRUCTION_JOB_MULT = {
  repair: 1,
  remodel: 1.08,
  "new-work": 1.05,
} as const;

/** ~200 sq ft per room when converting rooms → hours */
export const SQFT_PER_ROOM = 200;
