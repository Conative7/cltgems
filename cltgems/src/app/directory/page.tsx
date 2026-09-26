import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectoryClient } from "@/components/directory/DirectoryClient";

export const metadata: Metadata = {
  title: "Directory",
  description: "Demo directory of Charlotte-oriented certified and local operators — filter by category and certification.",
};

export default function DirectoryPage() {
  return (
    <div>
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-10 sm:py-14">
          <p className="warhol-eyebrow">AI Bloom · Charlotte directory</p>
          <h1 className="headline-lg mt-5">Directory</h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-600 leading-relaxed font-medium">
            Growing directory of NC-certified & local operators. Filter by category, certification, or free text.
          </p>
        </div>
      </section>
      <div className="container-page py-10 sm:py-12">
        <Suspense fallback={<p className="text-sm text-muted">Loading directory…</p>}>
          <DirectoryClient />
        </Suspense>
      </div>
    </div>
  );
}
