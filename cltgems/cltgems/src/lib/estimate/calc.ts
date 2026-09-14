import { round2 } from "../calculations";
import type { EstimateAgreement, EstimateLineItem, EstimateTotals } from "./types";

export function lineAmount(item: EstimateLineItem): number {
  return round2((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0));
}

export function calcEstimateSubtotal(data: EstimateAgreement): number {
  if (data.scopeMode === "bullets") {
    return round2(Number(data.totalOverride) || 0);
  }
  const fromLines = round2(
    data.lineItems.reduce((sum, item) => sum + lineAmount(item), 0)
  );
  if (fromLines > 0) return fromLines;
  return round2(Number(data.totalOverride) || 0);
}

export function calcDepositAmount(subtotal: number, data: EstimateAgreement): number {
  const value = Number(data.depositValue) || 0;
  if (data.depositType === "percent") {
    return round2(Math.min(subtotal, (subtotal * value) / 100));
  }
  if (data.depositType === "fixed") {
    return round2(Math.min(subtotal, value));
  }
  return 0;
}

export function calcEstimateTotals(data: EstimateAgreement): EstimateTotals {
  const subtotal = calcEstimateSubtotal(data);
  const depositAmount = calcDepositAmount(subtotal, data);
  const balanceDue = round2(Math.max(0, subtotal - depositAmount));
  return { subtotal, depositAmount, balanceDue };
}
