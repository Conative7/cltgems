import type { EstimateBreakdown, PriceHandoffPayload, TradeId } from "./types";

export function buildCleaningHandoff(args: {
  estimate: EstimateBreakdown;
  jobTypeLabel: string;
  conditionLabel: string;
  sqFt: number;
  rooms: number;
}): PriceHandoffPayload {
  const { estimate } = args;
  const areaBits = [
    args.sqFt > 0 ? `${args.sqFt.toLocaleString()} sq ft` : null,
    args.rooms > 0 ? `${args.rooms} room(s)` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const lineItems = [
    {
      description: `Cleaning — ${args.jobTypeLabel}${areaBits ? ` (${areaBits})` : ""}, ${args.conditionLabel}`,
      quantity: Math.max(0.25, estimate.laborHours),
      unitPrice:
        estimate.laborHours > 0
          ? Math.round((estimate.laborCost / estimate.laborHours) * 100) / 100
          : estimate.laborCost,
      unit: "hrs",
    },
  ];

  if (estimate.materialsCost > 0) {
    lineItems.push({
      description: "Cleaning supplies allowance",
      quantity: 1,
      unitPrice: estimate.materialsCost,
      unit: "ea",
    });
  }

  // Fold OH + profit into a single “job package” line so invoice total ≈ target
  const packageExtra = estimate.overheadCost + estimate.profitCost;
  if (packageExtra > 0) {
    lineItems.push({
      description: `Overhead (${estimate.overheadPct}%) + margin (${estimate.profitPct}%) — ballpark package`,
      quantity: 1,
      unitPrice: packageExtra,
      unit: "ea",
    });
  }

  return {
    source: "price-calculator",
    trade: "cleaning",
    createdAt: new Date().toISOString(),
    formatId: "classic-service",
    notes: "",
    lineItems,
    targetTotal: estimate.target,
  };
}

export function buildConstructionHandoff(args: {
  estimate: EstimateBreakdown;
  jobTypeLabel: string;
  sqFt: number;
}): PriceHandoffPayload {
  const { estimate } = args;
  const lineItems = [
    {
      description:
        `Construction labor — ${args.jobTypeLabel}` +
        (args.sqFt > 0 ? ` (${args.sqFt.toLocaleString()} sq ft)` : ""),
      quantity: Math.max(0.25, estimate.laborHours || 1),
      unitPrice:
        estimate.laborHours > 0
          ? Math.round((estimate.laborCost / estimate.laborHours) * 100) / 100
          : estimate.laborCost,
      unit: "hrs",
    },
  ];

  if (estimate.materialsCost > 0) {
    lineItems.push({
      description: "Materials budget",
      quantity: 1,
      unitPrice: estimate.materialsCost,
      unit: "ea",
    });
  }

  if (estimate.contingencyCost > 0) {
    lineItems.push({
      description: "Contingency allowance",
      quantity: 1,
      unitPrice: estimate.contingencyCost,
      unit: "ea",
    });
  }

  const packageExtra = estimate.overheadCost + estimate.profitCost;
  if (packageExtra > 0) {
    lineItems.push({
      description: `Overhead (${estimate.overheadPct}%) + margin (${estimate.profitPct}%) — ballpark package`,
      quantity: 1,
      unitPrice: packageExtra,
      unit: "ea",
    });
  }

  return {
    source: "price-calculator",
    trade: "construction" as TradeId,
    createdAt: new Date().toISOString(),
    formatId: "contractor-job",
    notes: "",
    lineItems,
    targetTotal: estimate.target,
  };
}
