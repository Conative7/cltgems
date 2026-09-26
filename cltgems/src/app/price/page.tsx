import { Suspense } from "react";
import type { Metadata } from "next";
import { PricePageInner } from "./PricePageInner";

export const metadata: Metadata = {
  title: "Free cleaning price calculator | Price a job",
  description:
    "Free Charlotte cleaning price calculator — for cleaning business owners and homeowners. Get a Low / Target / High ballpark, then turn it into an estimate or invoice.",
};

export default function PricePage() {
  return (
    <div>
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-10 sm:py-14">
          <p className="warhol-eyebrow">Free cleaning calculator · AI Bloom</p>
          <h1 className="headline-lg mt-5 max-w-3xl">
            Free cleaning price calculator — price a job or get a ballpark quote
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-600 leading-relaxed font-medium">
            Cleaning business owners: set your rates, unlock Low / Target / High, then create an{" "}
            <strong className="text-warhol-ink">estimate</strong> or <strong className="text-warhol-ink">invoice</strong>.
            Homeowners: get a free Charlotte-area range and leave your info if you want a real follow-up.
            Construction pricing is available too. Planning tool only — not a formal bid.
          </p>
        </div>
      </section>
      <div className="container-page py-8 sm:py-10">
        <Suspense fallback={<p className="text-sm text-muted p-6">Loading…</p>}>
          <PricePageInner />
        </Suspense>
      </div>
    </div>
  );
}
