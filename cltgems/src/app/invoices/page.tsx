import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MonitorSmartphone, Shield } from "lucide-react";
import { INVOICE_FORMATS } from "@/lib/formats";
import { FormatCard } from "@/components/invoices/FormatCard";

export const metadata: Metadata = {
  title: "Invoice Library",
  description: "Guest invoice builder with Word and PDF export, email/share, library-PC session wipe.",
};

export default function InvoicesPage() {
  return (
    <div>
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-10 sm:py-14">
          <p className="warhol-eyebrow">AI Bloom · Invoices</p>
          <h1 className="headline-lg mt-5">Invoice Library</h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-600 leading-relaxed font-medium">
            Eight practical formats. Build as a guest, preview live, download Word (.docx) or PDF, or email/share from your phone.
            Free useful tier first — no account required. Credits only after a successful download.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
            <Link href="/invoices/builder" className="btn-warhol btn-warhol-magenta">
              Open builder <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/invoices/formats" className="btn-warhol btn-warhol-outline">
              Browse all formats
            </Link>
          </div>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="warhol-card warhol-card-teal !p-5 flex gap-3">
            <MonitorSmartphone className="h-5 w-5 text-warhol-teal shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-warhol-ink">Library / shared PC ready</h2>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                Drafts stay in this browser only. Use the wipe control on the builder before you walk away.
              </p>
            </div>
          </div>
          <div className="warhol-card warhol-card-yellow !p-5 flex gap-3">
            <Shield className="h-5 w-5 text-warhol-ink shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-warhol-ink">Getting paid matters</h2>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                Pair clean invoices with the directory and data intel — getting found without cashflow is half the story.
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-12 font-display text-xl font-extrabold text-warhol-ink">
          Formats ({INVOICE_FORMATS.length})
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INVOICE_FORMATS.map((f) => (
            <FormatCard key={f.id} format={f} />
          ))}
        </div>
      </div>
    </div>
  );
}
