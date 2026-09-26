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
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-10 sm:py-14 max-w-3xl">
          <p className="warhol-eyebrow">Checkout · Charlotte · AI Bloom</p>
          <h1 className="headline-lg mt-5">
            Pay for what you need — no subscription
          </h1>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed font-medium">
            Lead packs, Google listing cleanup, or done-with-you Starter. Card pay is one tap.
            Free tools (Price a job, invoices, free Google check) stay free.
          </p>
          {!live ? (
            <p className="mt-4 rounded-xl border-2 border-warhol-ink bg-warhol-yellow/40 px-4 py-3 text-sm font-semibold text-warhol-ink leading-relaxed">
              Live Stripe buttons turn on as soon as payment links are pasted in. Until then, tap Buy and
              we’ll email you a secure pay link the same day.
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-stone-600">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-warhol-teal" /> Stripe-secure cards
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-warhol-magenta" /> Pay per task
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

        <div className="mt-10 rounded-2xl border-2 border-warhol-ink bg-warhol-cream p-5 sm:p-6 max-w-3xl shadow-[6px_6px_0_var(--warhol-yellow)]">
          <h2 className="font-display text-lg font-extrabold text-warhol-ink">Not sure which pack?</h2>
          <p className="mt-2 text-sm text-stone-700 leading-relaxed">
            Start with the free 3-bullet Google listing check, or request a Hot Lead Pack and tell us your
            niche + city. Prefer Venmo / Zelle / invoice for a local Charlotte job?{" "}
            <Link href="/about#connect" className="font-bold text-warhol-magenta underline underline-offset-2">
              Connect with us
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/check" className="btn-warhol btn-warhol-magenta text-sm !py-3">
              Free Google check <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/intel" className="btn-warhol btn-warhol-outline text-sm !py-3">
              How lead packs work <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
