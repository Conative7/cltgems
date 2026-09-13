import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ListChecks, MapPin, Sparkles } from "lucide-react";
import { GoogleCheckForm } from "@/components/check/GoogleCheckForm";

export const metadata: Metadata = {
  title: "Free Google listing check",
  description:
    "Free 3-bullet Google Maps listing check for Charlotte businesses. Plain English. Optional $97 cleanup.",
};

const LOOK_FOR = [
  "Missing or weak website / booking link on the listing",
  "Too few reviews (or a low rating that hurts trust)",
  "Hours, photos, categories, or description looking incomplete",
];

export default function CheckPage() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-gem-mist to-warm">
        <div className="container-page py-12 sm:py-16 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wide text-gem">Free sample · Charlotte</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
            Free 3-bullet Google listing check
          </h1>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">
            Send us a Charlotte business name (or Maps link). We’ll reply with{" "}
            <strong className="text-ink">three plain bullets</strong> on what stands out — no jargon,
            no pressure.
          </p>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12 max-w-3xl grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 card p-5 sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-ink">Request yours</h2>
          <p className="mt-1 text-sm text-muted mb-4">Usually back within a day via email or text.</p>
          <GoogleCheckForm />
        </div>

        <aside className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="flex gap-2 items-center text-gem-dark font-bold">
              <ListChecks className="h-5 w-5" />
              What we look at
            </div>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              {LOOK_FOR.map((x) => (
                <li key={x} className="flex gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-gem mt-0.5" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gem/25 bg-gem-mist p-5">
            <div className="flex gap-2 items-center font-bold text-gem-dark">
              <Sparkles className="h-5 w-5" />
              Want it fixed?
            </div>
            <p className="mt-2 text-sm text-stone-700 leading-relaxed">
              After the free check, a full cleanup checklist / PDF is{" "}
              <strong className="text-ink">$97</strong> (white-label available).
            </p>
            <Link
              href="/intel"
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-gem"
            >
              Or order lead packs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
