import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { EstimateClient } from "@/components/estimate/EstimateClient";

export const metadata: Metadata = {
  title: "Estimate & agreement",
  description:
    "Build a simple scope of work / estimate, optional deposit, download PDF or Word, then turn it into an invoice. Not legal advice — simple work agreement for Charlotte operators.",
};

export default function EstimatePage() {
  return (
    <div>
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-10 sm:py-14">
          <p className="warhol-eyebrow">Estimate & agreement · AI Bloom</p>
          <h1 className="headline-lg mt-5 max-w-3xl">Estimate & agreement</h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-600 leading-relaxed font-medium">
            Scope the job, set a price, optional deposit — then download a clean PDF (or Word) clients can
            accept. When they say yes,{" "}
            <strong className="text-warhol-ink">turn it into an invoice</strong> in one tap. Start from scratch or
            import from{" "}
            <Link href="/price" className="font-bold text-warhol-magenta underline underline-offset-2">
              Price a job
            </Link>
            .
          </p>
        </div>
      </section>
      <div className="container-page py-8 sm:py-10">
        <Suspense fallback={<p className="text-sm text-muted p-6">Loading…</p>}>
          <EstimateClient />
        </Suspense>
      </div>
    </div>
  );
}
