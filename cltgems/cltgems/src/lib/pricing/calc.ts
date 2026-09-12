import { round2 } from "@/lib/calculations";
import {
  CLEANING_CONDITION_MULT,
  CLEANING_JOB_MULT,
  CONSTRUCTION_JOB_MULT,
  SQFT_PER_ROOM,
} from "./defaults";
import type {
  CleaningInputs,
  CleaningRateDefaults,
  ConstructionInputs,
  ConstructionRateDefaults,
  EstimateBreakdown,
} from "./types";

function finishEstimate(args: {
  laborHours: number;
  laborCost: number;
  materialsCost: number;
  contingencyCost: number;
  overheadPct: number;
  profitPct: number;
  notes: string[];
  /** Extra low/high spread factors (e.g. condition uncertainty) */
  lowFactor?: number;
  highFactor?: number;
}): EstimateBreakdown {
  const subtotal = round2(args.laborCost + args.materialsCost + args.contingencyCost);
  const overheadCost = round2(subtotal * (args.overheadPct / 100));
  const afterOh = round2(subtotal + overheadCost);
  const profitCost = round2(afterOh * (args.profitPct / 100));
  const target = round2(afterOh + profitCost);
  const lowFactor = args.lowFactor ?? 0.9;
  const highFactor = args.highFactor ?? 1.15;
  return {
    laborHours: round2(args.laborHours),
    laborCost: round2(args.laborCost),
    materialsCost: round2(args.materialsCost),
    contingencyCost: round2(args.contingencyCost),
    subtotal,
    overheadPct: args.overheadPct,
    overheadCost,
    profitPct: args.profitPct,
    profitCost,
    target,
    low: round2(target * lowFactor),
    high: round2(target * highFactor),
    notes: args.notes,
  };
}

export function estimateCleaningHours(
  inputs: CleaningInputs,
  rates: CleaningRateDefaults
): { hours: number; notes: string[] } {
  const notes: string[] = [];
  if (inputs.hoursOverride > 0) {
    notes.push("Using your entered hours (auto estimate skipped).");
    return { hours: inputs.hoursOverride, notes };
  }

  const cond = CLEANING_CONDITION_MULT[inputs.condition];
  const productivity = Math.max(50, rates.sqFtPerPersonHour);
  let area = Math.max(0, inputs.sqFt);

  if (inputs.useRoomsForHours && inputs.rooms > 0) {
    area = inputs.rooms * SQFT_PER_ROOM;
    notes.push(
      `Hours from ${inputs.rooms} room(s) ≈ ${area.toLocaleString()} sq ft (${SQFT_PER_ROOM} sq ft/room).`
    );
  } else if (area <= 0 && inputs.rooms > 0) {
    area = inputs.rooms * SQFT_PER_ROOM;
    notes.push(`No sq ft entered — using ${inputs.rooms} room(s) ≈ ${area.toLocaleString()} sq ft.`);
  }

  if (area <= 0) {
    notes.push("Enter sq ft or rooms (or set hours) to estimate labor.");
    return { hours: 0, notes };
  }

  // Person-hours for the area at standard productivity, adjusted for condition, then ÷ crew
  const personHours = (area / productivity) * cond;
  const crew = Math.max(1, inputs.crewSize);
  const clockHours = personHours / crew;
  notes.push(
    `Auto hours: ${area.toLocaleString()} sq ft ÷ ${productivity} sq ft/person-hr × ${inputs.condition} (${cond}×) ÷ ${crew} crew ≈ ${round2(clockHours)} hrs.`
  );
  return { hours: clockHours, notes };
}

export function calcCleaningEstimate(
  inputs: CleaningInputs,
  rates: CleaningRateDefaults
): EstimateBreakdown {
  const { hours, notes } = estimateCleaningHours(inputs, rates);
  const crew = Math.max(1, inputs.crewSize);
  const jobMult = CLEANING_JOB_MULT[inputs.jobType];
  const laborCost = hours * crew * rates.hourlyRate * jobMult;

  if (jobMult !== 1) {
    notes.push(`${inputs.jobType} visit factor ${jobMult}× applied to labor.`);
  }

  let materialsCost = 0;
  if (inputs.suppliesMode === "fixed") {
    materialsCost = Math.max(0, inputs.suppliesValue);
    notes.push(`Supplies allowance: $${round2(materialsCost).toFixed(2)} fixed.`);
  } else {
    const pct = Math.max(0, inputs.suppliesValue);
    materialsCost = laborCost * (pct / 100);
    notes.push(`Supplies: ${pct}% of labor ≈ $${round2(materialsCost).toFixed(2)}.`);
  }

  const heavySpread = inputs.condition === "heavy";
  return finishEstimate({
    laborHours: hours,
    laborCost,
    materialsCost,
    contingencyCost: 0,
    overheadPct: rates.overheadPct,
    profitPct: rates.profitPct,
    notes,
    lowFactor: heavySpread ? 0.88 : 0.9,
    highFactor: heavySpread ? 1.22 : 1.15,
  });
}

export function calcConstructionEstimate(
  inputs: ConstructionInputs,
  rates: ConstructionRateDefaults
): EstimateBreakdown {
  const notes: string[] = [];
  const crew = Math.max(1, inputs.crewSize);
  const jobMult = CONSTRUCTION_JOB_MULT[inputs.jobType];
  let hours = 0;
  let laborCost = 0;

  if (inputs.laborHours > 0) {
    hours = inputs.laborHours;
    laborCost = hours * crew * rates.hourlyRate * jobMult;
    notes.push(
      `Labor from ${hours} hrs × ${crew} crew × $${rates.hourlyRate}/hr` +
        (jobMult !== 1 ? ` × ${inputs.jobType} ${jobMult}×` : "") +
        "."
    );
  } else if (inputs.sqFt > 0) {
    const base = inputs.sqFt * rates.laborPerSqFt * jobMult;
    laborCost = base;
    // Implied clock hours for transparency (crew-aware)
    const denom = Math.max(1, crew * rates.hourlyRate);
    hours = base / denom;
    notes.push(
      `Labor from ${inputs.sqFt.toLocaleString()} sq ft × $${rates.laborPerSqFt}/sq ft` +
        (jobMult !== 1 ? ` × ${inputs.jobType} ${jobMult}×` : "") +
        ` ≈ $${round2(laborCost).toFixed(2)} (~${round2(hours)} crew-hrs).`
    );
  } else {
    notes.push("Enter sq ft or lump labor hours to estimate labor.");
  }

  const materialsCost = Math.max(0, inputs.materialBudget);
  if (materialsCost > 0) {
    notes.push(`Materials budget: $${round2(materialsCost).toFixed(2)}.`);
  }

  const contingencyPct = Math.max(0, inputs.contingencyPct);
  const contingencyCost = (laborCost + materialsCost) * (contingencyPct / 100);
  if (contingencyPct > 0) {
    notes.push(`Contingency ${contingencyPct}% on labor + materials.`);
  }

  return finishEstimate({
    laborHours: hours,
    laborCost,
    materialsCost,
    contingencyCost,
    overheadPct: rates.overheadPct,
    profitPct: rates.profitPct,
    notes,
    lowFactor: 0.9,
    highFactor: inputs.jobType === "remodel" ? 1.2 : 1.15,
  });
}
