import { Suspense } from "react";
import type { Metadata } from "next";
import { PricePageInner } from "./PricePageInner";

export const metadata: Metadata = {
  title: "Price a job",
  description:
    "Stop guessing. Price the job in your palm — then invoice like a pro. Ballpark cleaning and construction estimates with Word/PDF invoice handoff.",
};

export default function PricePage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-wide text-gem">Price a job · AI Bloom</p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-ink max-w-3xl leading-tight">
        Stop guessing. Price the job in your palm — then invoice like a pro.
      </h1>
      <p className="mt-3 max-w-2xl text-muted leading-relaxed">
        Quick Low / Target / High for cleaning and construction. When the target looks right, tap{" "}
        <strong className="text-ink">Make invoice from this price</strong> — Word or PDF, no Canva.
        Planning tool only — not a formal bid.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-muted p-6">Loading…</p>}>
          <PricePageInner />
        </Suspense>
      </div>
    </div>
  );
}
