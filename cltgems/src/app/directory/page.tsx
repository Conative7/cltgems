import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectoryClient } from "@/components/directory/DirectoryClient";

export const metadata: Metadata = {
  title: "Directory",
  description: "Demo directory of Charlotte-oriented certified and local operators — filter by category and certification.",
};

export default function DirectoryPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <h1 className="font-display text-3xl font-extrabold text-ink">Directory</h1>
      <p className="mt-2 max-w-2xl text-muted leading-relaxed">
        Growing directory of NC-certified & local operators. Filter by category, certification, or free text.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-muted">Loading directory…</p>}>
          <DirectoryClient />
        </Suspense>
      </div>
    </div>
  );
}
