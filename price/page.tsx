import { Suspense } from "react";
import type { Metadata } from "next";
import { PricePageInner } from "./PricePageInner";

export const metadata: Metadata = {
  title: "Price a job",
  description:
    "Ballpark contract pricing for Charlotte cleaning and construction operators — transparent labor, materials, overhead, and margin.",
};

export default function PricePage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-wide text-gem">CLT Gems · Operators</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-ink">Price a job</h1>
      <p className="mt-2 max-w-2xl text-muted leading-relaxed">
        Quick Low / Target / High ranges for cleaning and general construction. Tune your own rates —
        then hand off a draft to the invoice builder. Not a formal bid platform.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-muted p-6">Loading…</p>}>
          <PricePageInner />
        </Suspense>
      </div>
    </div>
  );
}
