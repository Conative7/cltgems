/**
 * AI Bloom paid products + Stripe Payment Links.
 *
 * ─── How to go live (Stripe Dashboard) ─────────────────────────────────────
 * 1. Create / sign in: https://dashboard.stripe.com/register
 * 2. Products → Payment links → “+ New” (or Product catalog → create product,
 *    then “Create payment link” on that product).
 * 3. Create ONE Payment Link per product below, matching the listed price:
 *      cleanup       → Google listing cleanup · $97
 *      hot           → Hot Lead Pack · $97
 *      neighborhood  → Neighborhood List · $49
 *      metro         → Metro Sweep · $197
 *      starter       → AI Bloom Starter · $497
 * 4. Copy each link (looks like https://buy.stripe.com/test_… or
 *    https://buy.stripe.com/…). Paste into MANUAL_LINKS[id] below
 *    OR set the matching Vercel env var (Preview + Production):
 *      NEXT_PUBLIC_STRIPE_LINK_CLEANUP
 *      NEXT_PUBLIC_STRIPE_LINK_HOT
 *      NEXT_PUBLIC_STRIPE_LINK_NEIGHBORHOOD
 *      NEXT_PUBLIC_STRIPE_LINK_METRO
 *      NEXT_PUBLIC_STRIPE_LINK_STARTER
 * 5. Redeploy. Env vars win over empty MANUAL_LINKS; non-empty MANUAL_LINKS
 *    are used when the env var is unset.
 *
 * Until a link is set, the Pay button asks the customer to request an invoice
 * (Formspree → hello.aibloom@outlook.com) so you can send a Stripe link by hand.
 *
 * Do NOT invent or commit fake buy.stripe.com URLs — leave "" until real links exist.
 */

export type PayProduct = {
  id: string;
  name: string;
  priceLabel: string;
  priceCents: number;
  blurb: string;
  detail: string;
  highlight?: boolean;
  /** Stripe Payment Link URL, e.g. https://buy.stripe.com/xxxx — keep "" until real */
  stripeLink: string;
};

function envLink(key: string, fallback = ""): string {
  if (typeof process === "undefined") return fallback;
  const v = process.env[key];
  return (v && v.trim()) || fallback;
}

/**
 * Paste real Stripe Payment Links here after you create them in Dashboard.
 * Keys MUST match product `id`. Leave "" until you have a real link.
 * Example once live: cleanup: "https://buy.stripe.com/a1b2c3d4",
 */
const MANUAL_LINKS: Record<string, string> = {
  cleanup: "",
  hot: "",
  neighborhood: "",
  metro: "",
  starter: "",
};

/** Customer-facing order: cleanup → hot (popular) → neighborhood → metro → starter */
export const PRODUCTS: PayProduct[] = [
  {
    id: "cleanup",
    name: "Google listing cleanup",
    priceLabel: "$97",
    priceCents: 9700,
    blurb: "Checklist / PDF after the free check",
    detail: "Plain-English cleanup plan for a Google Business Profile. White-label available.",
    stripeLink: envLink("NEXT_PUBLIC_STRIPE_LINK_CLEANUP", MANUAL_LINKS.cleanup),
  },
  {
    id: "hot",
    name: "Hot Lead Pack",
    priceLabel: "$97",
    priceCents: 9700,
    blurb: "Scored hot subset + short notes",
    detail: "Best starter — scored “hot” leads (weak site / reviews) you can text or sell.",
    highlight: true,
    stripeLink: envLink("NEXT_PUBLIC_STRIPE_LINK_HOT", MANUAL_LINKS.hot),
  },
  {
    id: "neighborhood",
    name: "Neighborhood List",
    priceLabel: "$49",
    priceCents: 4900,
    blurb: "~50–100 leads · 1 niche · 1 area",
    detail: "Clean CSV of local businesses for one niche in one Charlotte-area zone.",
    stripeLink: envLink("NEXT_PUBLIC_STRIPE_LINK_NEIGHBORHOOD", MANUAL_LINKS.neighborhood),
  },
  {
    id: "metro",
    name: "Metro Sweep",
    priceLabel: "$197",
    priceCents: 19700,
    blurb: "Multi-suburb · up to ~300–500",
    detail: "Wider Charlotte metro coverage for agencies and resellers.",
    stripeLink: envLink("NEXT_PUBLIC_STRIPE_LINK_METRO", MANUAL_LINKS.metro),
  },
  {
    id: "starter",
    name: "AI Bloom Starter",
    priceLabel: "$497",
    priceCents: 49700,
    blurb: "Done-with-you setup · ~1 week",
    detail: "Rates, invoice pack, AI follow-up scripts, 30-min setup, 30 days email support.",
    stripeLink: envLink("NEXT_PUBLIC_STRIPE_LINK_STARTER", MANUAL_LINKS.starter),
  },
];

export function getProduct(id: string): PayProduct | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function hasAnyLiveCheckout(): boolean {
  return PRODUCTS.some((p) => Boolean(p.stripeLink));
}

/**
 * Dev/ops hint only — never render on the public site.
 * Use when logging or documenting which env/manual slot is still empty.
 */
export function stripePlaceholderHint(productId: string): string {
  const envKey = `NEXT_PUBLIC_STRIPE_LINK_${productId.toUpperCase()}`;
  return `Paste Stripe Payment Link into MANUAL_LINKS.${productId} or Vercel env ${envKey} (e.g. https://buy.stripe.com/…)`;
}
