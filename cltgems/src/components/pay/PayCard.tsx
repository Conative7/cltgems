"use client";

import { useState } from "react";
import { ArrowRight, CreditCard, Loader2 } from "lucide-react";
import type { PayProduct } from "@/lib/payments";
import { submitViaFormspree, openOutlookDraft } from "@/lib/notifyEmail";

type Props = { product: PayProduct };

export function PayCard({ product }: Props) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [niche, setNiche] = useState("");
  const [email, setEmail] = useState("");
  const [showRequest, setShowRequest] = useState(false);

  const live = Boolean(product.stripeLink);

  async function requestInvoice() {
    if (!email.trim()) return;
    setBusy(true);
    const fields = {
      _subject: `AI Bloom order request: ${product.name} (${product.priceLabel})`,
      product: product.name,
      price: product.priceLabel,
      product_id: product.id,
      customer_email: email.trim(),
      niche_or_notes: niche.trim() || "(none)",
      source: "aibloom.agency/pay",
    };
    const ok = await submitViaFormspree(fields);
    if (!ok) {
      openOutlookDraft(
        fields._subject,
        `Product: ${product.name}\nPrice: ${product.priceLabel}\nEmail: ${email}\nNotes: ${niche || "—"}`
      );
    }
    setBusy(false);
    setDone(true);
  }

  return (
    <article
      id={product.id}
      className={
        "card flex flex-col p-5 sm:p-6 scroll-mt-24 " +
        (product.highlight ? "border-gem/40 ring-2 ring-gem/15 bg-gem-mist/40" : "")
      }
    >
      {product.highlight ? (
        <span className="badge badge-gem w-fit">Most popular</span>
      ) : null}
      <h3 className="mt-2 font-display text-xl font-bold text-ink">{product.name}</h3>
      <p className="mt-1 font-display text-3xl font-extrabold text-gem-dark">{product.priceLabel}</p>
      <p className="mt-2 text-sm font-semibold text-stone-700">{product.blurb}</p>
      <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{product.detail}</p>

      {live ? (
        <a
          href={product.stripeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-5 w-full"
        >
          <CreditCard className="h-4 w-4" />
          Pay {product.priceLabel} <ArrowRight className="h-4 w-4" />
        </a>
      ) : done ? (
        <p className="mt-5 rounded-xl bg-gem-mist px-4 py-3 text-sm font-semibold text-gem-dark">
          Got it — we’ll email a secure pay link to {email} soon.
        </p>
      ) : showRequest ? (
        <div className="mt-5 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wide text-muted">
            Your email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-ink"
              placeholder="you@business.com"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted">
            Niche / city / notes (optional)
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink"
              placeholder="e.g. HVAC, South End Charlotte"
            />
          </label>
          <button
            type="button"
            disabled={busy || !email.trim()}
            onClick={requestInvoice}
            className="btn btn-primary w-full disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Request pay link
          </button>
          <button
            type="button"
            className="w-full text-center text-xs font-semibold text-muted hover:text-ink"
            onClick={() => setShowRequest(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn-primary mt-5 w-full" onClick={() => setShowRequest(true)}>
          <CreditCard className="h-4 w-4" />
          Buy {product.priceLabel} <ArrowRight className="h-4 w-4" />
        </button>
      )}

      {!live ? (
        <p className="mt-2 text-center text-[11px] text-muted">
          Secure Stripe checkout — you’ll get a pay link by email if live checkout isn’t on yet.
        </p>
      ) : (
        <p className="mt-2 text-center text-[11px] text-muted">Secure checkout powered by Stripe</p>
      )}
    </article>
  );
}
