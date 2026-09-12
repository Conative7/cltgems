import type { CreditState, DraftRecord, ExportRecord, InvoiceData } from "./types";
import { clearPricingLocalData } from "./pricing/storage";

const KEYS = {
  session: "cltgems_invoice_session",
  drafts: "cltgems_drafts",
  exports: "cltgems_exports",
  credits: "cltgems_credits",
} as const;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadSession(): InvoiceData | null {
  if (typeof window === "undefined") return null;
  return safeParse<InvoiceData | null>(localStorage.getItem(KEYS.session), null);
}

export function saveSession(invoice: InvoiceData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.session, JSON.stringify(invoice));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.session);
}

export function loadDrafts(): DraftRecord[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(KEYS.drafts), []);
}

export function saveDraft(draft: DraftRecord): void {
  if (typeof window === "undefined") return;
  const drafts = loadDrafts().filter((d) => d.id !== draft.id);
  drafts.unshift(draft);
  localStorage.setItem(KEYS.drafts, JSON.stringify(drafts.slice(0, 50)));
}

export function deleteDraft(id: string): void {
  if (typeof window === "undefined") return;
  const drafts = loadDrafts().filter((d) => d.id !== id);
  localStorage.setItem(KEYS.drafts, JSON.stringify(drafts));
}

export function loadExports(): ExportRecord[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(KEYS.exports), []);
}

export function addExport(record: ExportRecord): void {
  if (typeof window === "undefined") return;
  const list = loadExports();
  list.unshift(record);
  localStorage.setItem(KEYS.exports, JSON.stringify(list.slice(0, 100)));
}

export function loadCredits(): CreditState {
  if (typeof window === "undefined") return { credits: 10, plan: "free" };
  return safeParse(localStorage.getItem(KEYS.credits), { credits: 10, plan: "free" as const });
}

export function saveCredits(state: CreditState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.credits, JSON.stringify(state));
}

export function consumeCredit(): CreditState {
  const state = loadCredits();
  if (state.plan === "subscribe") return state;
  const next = { ...state, credits: Math.max(0, state.credits - 1) };
  saveCredits(next);
  return next;
}

/** Wipe all CLT Gems invoice data from this browser (public PC safe). */
export function wipeAllLocalData(): void {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  clearPricingLocalData();
  sessionStorage.clear();
}
