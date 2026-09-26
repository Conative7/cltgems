import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/payments";

const CARD_ACCENTS = [
  "warhol-card warhol-card-teal",
  "warhol-card warhol-card-magenta",
  "warhol-card warhol-card-yellow",
  "warhol-card warhol-card-indigo",
  "warhol-card warhol-card-teal",
] as const;

export function PricingLadder() {
  return (
    <section id="pricing" className="section-cream border-b-4 border-warhol-ink scroll-mt-24">
      <div className="container-page py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="accent-bar" aria-hidden />
            <h2 className="headline-lg mt-3">Pricing ladder</h2>
            <p className="mt-2 max-w-xl text-stone-600 leading-relaxed">
              Start free. Pay only when you want cleanup, leads, or done-with-you Starter —
              no monthly trap.
            </p>
          </div>
          <Link href="/pay" className="btn-warhol btn-warhol-magenta shrink-0">
            See checkout <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/check" className="warhol-card warhol-card-yellow group flex flex-col">
            <span className="warhol-eyebrow !text-[10px] !py-1 w-fit">Free</span>
            <h3 className="mt-2 font-display text-xl font-extrabold text-warhol-ink group-hover:text-warhol-magenta transition-colors">
              Google scorecard
            </h3>
            <p className="mt-1 font-display text-3xl font-extrabold text-warhol-ink">$0</p>
            <p className="mt-2 flex-1 text-sm text-stone-600 leading-relaxed">
              See listing gaps and what to fix first — then upgrade if you want a cleanup plan or
              leads.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-warhol-ink">
              Run free check{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          {PRODUCTS.map((p, i) => (
            <Link
              key={p.id}
              href={`/pay#${p.id}`}
              className={
                CARD_ACCENTS[i % CARD_ACCENTS.length] +
                " group flex flex-col" +
                (p.highlight ? " ring-2 ring-warhol-magenta ring-offset-2" : "")
              }
            >
              {p.highlight ? (
                <span className="warhol-eyebrow !text-[10px] !py-1 w-fit">Most popular</span>
              ) : null}
              <h3 className="mt-2 font-display text-xl font-extrabold text-warhol-ink group-hover:text-warhol-magenta transition-colors">
                {p.name}
              </h3>
              <p className="mt-1 font-display text-3xl font-extrabold text-warhol-magenta">
                {p.priceLabel}
              </p>
              <p className="mt-2 text-sm font-semibold text-stone-700">{p.blurb}</p>
              <p className="mt-2 flex-1 text-sm text-stone-600 leading-relaxed">{p.detail}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-warhol-ink">
                Buy on checkout{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-stone-600 font-semibold">
          Ready to pay?{" "}
          <Link
            href="/pay"
            className="font-extrabold text-warhol-magenta underline underline-offset-2 hover:text-warhol-ink"
          >
            Open checkout
          </Link>{" "}
          · Free check stays{" "}
          <Link
            href="/check"
            className="font-extrabold text-warhol-teal underline underline-offset-2 hover:text-warhol-ink"
          >
            $0
          </Link>
        </p>
      </div>
    </section>
  );
}
