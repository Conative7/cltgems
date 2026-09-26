import type { Metadata } from "next";
import Link from "next/link";
import { INVOICE_FORMATS } from "@/lib/formats";
import { FormatCard } from "@/components/invoices/FormatCard";

export const metadata: Metadata = {
  title: "Invoice formats",
};

export default function InvoiceFormatsPage() {
  return (
    <div>
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-10 sm:py-12">
          <Link
            href="/invoices"
            className="text-sm font-extrabold text-warhol-magenta hover:text-warhol-ink underline underline-offset-2"
          >
            ← Invoice Library
          </Link>
          <h1 className="headline-lg mt-4">All invoice formats</h1>
          <p className="mt-3 text-stone-600 font-medium">
            Choose a format to open the guest builder with that layout selected.
          </p>
        </div>
      </section>
      <div className="container-page py-8 sm:py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INVOICE_FORMATS.map((f) => (
            <FormatCard key={f.id} format={f} />
          ))}
        </div>
      </div>
    </div>
  );
}
