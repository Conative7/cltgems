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
    <div className="container-page py-10 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-wide text-gem">
        Estimate & agreement · AI Bloom
      </p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-ink max-w-3xl leading-tight">
        Estimate & agreement
      </h1>
      <p className="mt-3 max-w-2xl text-muted leading-relaxed">
        Scope the job, set a price, optional deposit — then download a clean PDF (or Word) clients can
        accept. When they say yes,{" "}
        <strong className="text-ink">turn it into an invoice</strong> in one tap. Start from scratch or
        import from{" "}
        <Link href="/price" className="font-bold text-gem underline underline-offset-2">
          Price a job
        </Link>
        .
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-muted p-6">Loading…</p>}>
          <EstimateClient />
        </Suspense>
      </div>
    </div>
  );
}
