import type { Metadata } from "next";
import Link from "next/link";
import { INVOICE_FORMATS } from "@/lib/formats";
import { FormatCard } from "@/components/invoices/FormatCard";

export const metadata: Metadata = {
  title: "Invoice formats",
};

export default function InvoiceFormatsPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <Link href="/invoices" className="text-sm font-semibold text-gem hover:underline">
        ← Invoice Library
      </Link>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-ink">All invoice formats</h1>
      <p className="mt-2 text-muted">Choose a format to open the guest builder with that layout selected.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INVOICE_FORMATS.map((f) => (
          <FormatCard key={f.id} format={f} />
        ))}
      </div>
    </div>
  );
}
