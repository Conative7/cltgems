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
    <div className="container-page py-8 sm:py-10">
      <Link href="/invoices" className="text-sm font-semibold text-gem hover:underline">
        ← Invoice Library
      </Link>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-ink">Invoice builder</h1>
      <p className="mt-2 text-muted max-w-2xl">
        Guest mode — edit, preview, download. Wipe your session when finished on a shared computer.
      </p>
      <div className="mt-6">
        <Suspense fallback={<p className="text-sm text-muted p-6">Loading builder…</p>}>
          <BuilderClient />
        </Suspense>
      </div>
    </div>
  );
}
