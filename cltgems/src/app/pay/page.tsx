import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { PRODUCTS, hasAnyLiveCheckout } from "@/lib/payments";
import { PayCard } from "@/components/pay/PayCard";

export const metadata: Metadata = {
  title: "Pay · AI Bloom",
  description:
    "Pay for Charlotte lead packs, Google listing cleanup, or AI Bloom Starter. Card checkout via Stripe.",
};

export default function PayPage() {
  const live = hasAnyLiveCheckout();

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-gem-mist to-warm">
        <div className="container-page py-10 sm:py-14 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wide text-gem">Checkout · Charlotte</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
            Pay for what you need — no subscription
          </h1>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">
            Lead packs, Google listing cleanup, or done-with-you Starter. Card pay is one tap.
            Free tools (Price a job, invoices, free Google check) stay free.
          </p>
          {!live ? (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950 leading-relaxed">
              Live Stripe buttons turn on as soon as payment links are pasted in. Until then, tap Buy and
              we’ll email you a secure pay link the same day.
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-stone-600">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-gem" /> Stripe-secure cards
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-gem" /> Pay per task
            </span>
          </div>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <PayCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-10 card border-gem/20 bg-gem-mist/50 p-5 sm:p-6 max-w-3xl">
          <h2 className="font-display text-lg font-bold text-gem-dark">Not sure which pack?</h2>
          <p className="mt-2 text-sm text-stone-700 leading-relaxed">
            Start with the free 3-bullet Google listing check, or request a Hot Lead Pack and tell us your
            niche + city. Prefer Venmo / Zelle / invoice for a local Charlotte job?{" "}
            <Link href="/about#connect" className="font-bold text-gem underline underline-offset-2">
              Connect with us
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/check" className="btn btn-secondary text-sm">
              Free Google check <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/intel" className="btn btn-secondary text-sm">
              How lead packs work <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
