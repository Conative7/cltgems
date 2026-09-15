/**
 * AI Bloom paid products + Stripe Payment Links.
 *
 * How to go live:
 * 1. Create a Stripe account → https://dashboard.stripe.com/register
 * 2. Products → Payment links → create one link per product below
 * 3. Paste each Payment Link URL into the matching stripeLink field
 *    OR set the NEXT_PUBLIC_STRIPE_LINK_* env vars in Vercel
 * 4. Redeploy
 *
 * Until a link is set, the Pay button asks the customer to request an invoice
 * (Formspree → hello.aibloom@outlook.com) so you can send a Stripe link by hand.
 */

export type PayProduct = {
  id: string;
  name: string;
  priceLabel: string;
  priceCents: number;
  blurb: string;
  detail: string;
  highlight?: boolean;
  /** Stripe Payment Link URL, e.g. https://buy.stripe.com/xxxx */
  stripeLink: string;
};

function envLink(key: string, fallback = ""): string {
  if (typeof process === "undefined") return fallback;
  const v = process.env[key];
  return (v && v.trim()) || fallback;
}

/** Paste Stripe Payment Links here after you create them in Stripe. */
const MANUAL_LINKS: Record<string, string> = {
  neighborhood: "",
  hot: "",
  metro: "",
  cleanup: "",
  starter: "",
};

export const PRODUCTS: PayProduct[] = [
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
    id: "metro",
    name: "Metro Sweep",
    priceLabel: "$197",
    priceCents: 19700,
    blurb: "Multi-suburb · up to ~300–500",
    detail: "Wider Charlotte metro coverage for agencies and resellers.",
    stripeLink: envLink("NEXT_PUBLIC_STRIPE_LINK_METRO", MANUAL_LINKS.metro),
  },
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
