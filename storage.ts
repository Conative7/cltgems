import { DEFAULT_PRICING } from "./defaults";
import type { PriceHandoffPayload, PricingDefaults } from "./types";

const KEYS = {
  defaults: "cltgems_pricing_defaults",
  handoff: "cltgems_price_handoff",
} as const;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function mergeDefaults(stored: Partial<PricingDefaults> | null): PricingDefaults {
  const s = stored ?? {};
  return {
    cleaning: { ...DEFAULT_PRICING.cleaning, ...(s.cleaning ?? {}) },
    construction: { ...DEFAULT_PRICING.construction, ...(s.construction ?? {}) },
  };
}

export function loadPricingDefaults(): PricingDefaults {
  if (typeof window === "undefined") return DEFAULT_PRICING;
  return mergeDefaults(safeParse(localStorage.getItem(KEYS.defaults), null));
}

export function savePricingDefaults(defaults: PricingDefaults): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.defaults, JSON.stringify(defaults));
}

export function resetPricingDefaults(): PricingDefaults {
  if (typeof window !== "undefined") {
    localStorage.removeItem(KEYS.defaults);
  }
  return { ...DEFAULT_PRICING, cleaning: { ...DEFAULT_PRICING.cleaning }, construction: { ...DEFAULT_PRICING.construction } };
}

export function savePriceHandoff(payload: PriceHandoffPayload): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEYS.handoff, JSON.stringify(payload));
}

export function consumePriceHandoff(): PriceHandoffPayload | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEYS.handoff);
  if (!raw) return null;
  sessionStorage.removeItem(KEYS.handoff);
  return safeParse<PriceHandoffPayload | null>(raw, null);
}

export function clearPricingLocalData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.defaults);
  sessionStorage.removeItem(KEYS.handoff);
}

export { KEYS as PRICING_STORAGE_KEYS };
