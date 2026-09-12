export type TradeId = "cleaning" | "construction";

export type CleaningJobType = "one-time" | "weekly" | "biweekly" | "monthly";
export type CleaningCondition = "light" | "standard" | "heavy";
export type ConstructionJobType = "repair" | "remodel" | "new-work";

export interface SharedRateDefaults {
  overheadPct: number;
  profitPct: number;
}

export interface CleaningRateDefaults extends SharedRateDefaults {
  hourlyRate: number;
  /** Sq ft cleaned per person-hour at standard condition */
  sqFtPerPersonHour: number;
  /** Default supplies as % of labor (when mode is percent) */
  suppliesPct: number;
  defaultCrewSize: number;
}

export interface ConstructionRateDefaults extends SharedRateDefaults {
  hourlyRate: number;
  /** Optional labor $/sq ft when estimating from area */
  laborPerSqFt: number;
  contingencyPct: number;
  defaultCrewSize: number;
}

export interface PricingDefaults {
  cleaning: CleaningRateDefaults;
  construction: ConstructionRateDefaults;
}

export interface CleaningInputs {
  jobType: CleaningJobType;
  sqFt: number;
  rooms: number;
  /** Prefer sq ft for auto hours when > 0; rooms is optional context */
  useRoomsForHours: boolean;
  condition: CleaningCondition;
  crewSize: number;
  /** 0 = auto from sq ft / rooms + productivity */
  hoursOverride: number;
  suppliesMode: "fixed" | "percent";
  suppliesValue: number;
}

export interface ConstructionInputs {
  jobType: ConstructionJobType;
  sqFt: number;
  /** If > 0, use lump hours instead of sq-ft labor estimate */
  laborHours: number;
  materialBudget: number;
  crewSize: number;
  contingencyPct: number;
}

export interface EstimateBreakdown {
  laborHours: number;
  laborCost: number;
  materialsCost: number;
  contingencyCost: number;
  subtotal: number;
  overheadPct: number;
  overheadCost: number;
  profitPct: number;
  profitCost: number;
  target: number;
  low: number;
  high: number;
  notes: string[];
}

export interface PriceHandoffPayload {
  source: "price-calculator";
  trade: TradeId;
  createdAt: string;
  formatId: "classic-service" | "contractor-job";
  notes: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    unit?: string;
  }>;
  targetTotal: number;
}
