import type { CreditState } from "../types";
import type { EstimateAgreement, EstimateInvoiceHandoff } from "./types";
import { createEmptyEstimate } from "./defaults";

const KEYS = {
  draft: "cltgems_estimate_draft",
  invoiceHandoff: "cltgems_estimate_invoice_handoff",
  credits: "cltgems_estimate_credits",
} as const;

/** Free exports for this tool only — does not touch invoice credits. */
const FREE_ESTIMATE_EXPORTS = 2;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadEstimateDraft(): EstimateAgreement | null {
  if (typeof window === "undefined") return null;
  return safeParse<EstimateAgreement | null>(localStorage.getItem(KEYS.draft), null);
}

export function saveEstimateDraft(data: EstimateAgreement): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.draft, JSON.stringify(data));
}

export function clearEstimateDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.draft);
}

export function saveEstimateInvoiceHandoff(payload: EstimateInvoiceHandoff): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEYS.invoiceHandoff, JSON.stringify(payload));
}

export function consumeEstimateInvoiceHandoff(): EstimateInvoiceHandoff | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEYS.invoiceHandoff);
  if (!raw) return null;
  sessionStorage.removeItem(KEYS.invoiceHandoff);
  return safeParse<EstimateInvoiceHandoff | null>(raw, null);
}

export function loadEstimateCredits(): CreditState {
  if (typeof window === "undefined") {
    return { credits: FREE_ESTIMATE_EXPORTS, plan: "free" };
  }
  return safeParse(localStorage.getItem(KEYS.credits), {
    credits: FREE_ESTIMATE_EXPORTS,
    plan: "free" as const,
  });
}

export function saveEstimateCredits(state: CreditState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.credits, JSON.stringify(state));
}

export function consumeEstimateCredit(): CreditState {
  const state = loadEstimateCredits();
  if (state.plan === "subscribe") return state;
  const next = { ...state, credits: Math.max(0, state.credits - 1) };
  saveEstimateCredits(next);
  return next;
}

export function clearEstimateLocalData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.draft);
  localStorage.removeItem(KEYS.credits);
  sessionStorage.removeItem(KEYS.invoiceHandoff);
}

export function resetEstimateForm(): EstimateAgreement {
  clearEstimateDraft();
  return createEmptyEstimate();
}

export { KEYS as ESTIMATE_STORAGE_KEYS, FREE_ESTIMATE_EXPORTS };
