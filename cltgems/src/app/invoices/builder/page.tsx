import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BuilderClient } from "@/components/invoices/BuilderClient";

export const metadata: Metadata = {
  title: "Invoice builder",
  description: "Guest invoice builder with live preview and Word/PDF export.",
};

export default function InvoiceBuilderPage() {
  return (
    <div>
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-8 sm:py-10">
          <Link
            href="/invoices"
            className="text-sm font-extrabold text-warhol-magenta hover:text-warhol-ink underline underline-offset-2"
          >
            ← Invoice Library
          </Link>
          <h1 className="headline-lg mt-4">Invoice builder</h1>
          <p className="mt-3 text-stone-600 max-w-2xl font-medium leading-relaxed">
            Guest mode — edit, preview, download PDF/Word, or email/share. Credits only after a successful download.
            Wipe your session when finished on a shared computer.
          </p>
        </div>
      </section>
      <div className="container-page py-6 sm:py-8">
        <Suspense fallback={<p className="text-sm text-muted p-6">Loading builder…</p>}>
          <BuilderClient />
        </Suspense>
      </div>
    </div>
  );
}
