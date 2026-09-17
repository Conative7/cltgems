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
      <section className="border-b border-border bg-gradient-to-b from-gem-mist to-warm">
        <div className="container-page py-12 sm:py-16 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wide text-gem">Free lead magnet · Charlotte</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
            Instant website scorecard — see what’s great, missing, and fixable in seconds.
          </h1>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">
            Drop your website — we scan the <strong className="text-ink">public homepage</strong> (no paid
            Google APIs) and show a <strong className="text-ink">live scorecard</strong> with what’s
            great, what’s missing, and what to fix. On this page. Instantly.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="badge badge-gem">
              <Zap className="h-3 w-3" /> Live on-page — not a waiting list
            </span>
            <span className="badge badge-gem">
              <Gauge className="h-3 w-3" /> 0–100 score · three columns
            </span>
          </div>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12 max-w-3xl grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 card p-5 sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-ink">Run your free scorecard</h2>
          <p className="mt-1 text-sm text-muted mb-4">
            Website, email &amp; phone required so we can score the page and follow up if useful.
          </p>
          <GoogleCheckForm />
        </div>

        <aside className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="flex gap-2 items-center text-gem-dark font-bold">
              <ListChecks className="h-5 w-5" />
              What the free scan checks
            </div>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              {LOOK_FOR.map((x) => (
                <li key={x} className="flex gap-2">
                  <Zap className="h-4 w-4 shrink-0 text-gem mt-0.5" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted leading-relaxed">
              Instant scorecard — not a full Maps audit. Great for a quick gut-check before the paid
              cleanup.
            </p>
          </div>
          <div className="rounded-xl border border-gem/25 bg-gem-mist p-5">
            <div className="flex gap-2 items-center font-bold text-gem-dark">
              <Sparkles className="h-5 w-5" />
              Want it fixed?
            </div>
            <p className="mt-2 text-sm text-stone-700 leading-relaxed">
              After the free scorecard, a full GBP cleanup checklist / PDF is{" "}
              <strong className="text-ink">$97</strong> (white-label available). Lead packs start at $49.
            </p>
            <Link href="/pay#cleanup" className="btn btn-primary mt-4 w-full text-sm">
              Pay $97 cleanup <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pay#hot" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-gem">
              Hot Lead Pack <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
