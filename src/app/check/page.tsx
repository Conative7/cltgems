import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gauge, ListChecks, Sparkles, Zap } from "lucide-react";
import { GoogleCheckForm } from "@/components/check/GoogleCheckForm";

export const metadata: Metadata = {
  title: "Instant website scorecard",
  description:
    "Instant website scorecard — see what’s great, missing, and fixable in seconds. Free public-HTML scan for Charlotte businesses. Optional $97 GBP cleanup.",
};

const LOOK_FOR = [
  "HTTPS, title, meta, viewport, H1 & favicon",
  "Click-to-call, email/contact path, address & hours",
  "CTAs, Open Graph, LocalBusiness schema & images",
];

export default function CheckPage() {
  return (
    <div>
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="warhol-eyebrow">Free scorecard · Charlotte · AI Bloom</p>
              <h1 className="headline-lg mt-5">
                Instant website scorecard — see what’s great, missing, and fixable in seconds.
              </h1>
              <p className="mt-4 text-lg text-stone-600 leading-relaxed font-medium">
                Drop your website — we scan the <strong className="text-warhol-ink">public homepage</strong> (no paid
                Google APIs) and show a <strong className="text-warhol-ink">live scorecard</strong> with what’s
                great, what’s missing, and what to fix. On this page. Instantly.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-warhol-ink bg-warhol-yellow px-3 py-1 text-xs font-extrabold text-warhol-ink">
                  <Zap className="h-3 w-3" /> Live on-page — not a waiting list
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-warhol-ink bg-white px-3 py-1 text-xs font-extrabold text-warhol-ink">
                  <Gauge className="h-3 w-3" /> 0–100 score · three columns
                </span>
              </div>
            </div>
            <div className="hidden sm:block shrink-0">
              <div className="overflow-hidden rounded-2xl border-3 border-warhol-ink border-2 shadow-[6px_6px_0_var(--warhol-magenta)] w-28 h-28 lg:w-36 lg:h-36">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/aibloom-flower-mark.jpg"
                  alt=""
                  width={144}
                  height={144}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12 max-w-5xl grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-2xl border-2 border-warhol-ink bg-white p-5 sm:p-6 shadow-[6px_6px_0_var(--warhol-teal)]">
          <h2 className="font-display text-xl font-extrabold text-warhol-ink">Run your free scorecard</h2>
          <p className="mt-1 text-sm text-muted mb-4">
            Website, email &amp; phone required so we can score the page and follow up if useful.
          </p>
          <GoogleCheckForm />
        </div>

        <aside className="lg:col-span-2 space-y-4">
          <div className="warhol-card warhol-card-indigo !p-5">
            <div className="flex gap-2 items-center text-warhol-ink font-extrabold">
              <ListChecks className="h-5 w-5 text-warhol-indigo" />
              What the free scan checks
            </div>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              {LOOK_FOR.map((x) => (
                <li key={x} className="flex gap-2">
                  <Zap className="h-4 w-4 shrink-0 text-warhol-magenta mt-0.5" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted leading-relaxed">
              Instant scorecard — not a full Maps audit. Great for a quick gut-check before the paid
              cleanup.
            </p>
          </div>
          <div className="warhol-card warhol-card-magenta !p-5">
            <div className="flex gap-2 items-center font-extrabold text-warhol-ink">
              <Sparkles className="h-5 w-5 text-warhol-magenta" />
              Want it fixed?
            </div>
            <p className="mt-2 text-sm text-stone-700 leading-relaxed">
              After the free scorecard, a full GBP cleanup checklist / PDF is{" "}
              <strong className="text-warhol-ink">$97</strong> (white-label available). Lead packs start at $49.
            </p>
            <Link href="/pay#cleanup" className="btn-warhol btn-warhol-magenta mt-4 w-full text-sm !py-3">
              Pay $97 cleanup <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pay#hot"
              className="mt-3 inline-flex items-center gap-1 text-sm font-extrabold text-warhol-teal hover:text-warhol-magenta"
            >
              Hot Lead Pack <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
