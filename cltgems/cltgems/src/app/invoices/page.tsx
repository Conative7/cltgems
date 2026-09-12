import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MonitorSmartphone, Shield } from "lucide-react";
import { INVOICE_FORMATS } from "@/lib/formats";
import { FormatCard } from "@/components/invoices/FormatCard";

export const metadata: Metadata = {
  title: "Invoice Library",
  description: "CLT Gems Docs — guest invoice builder with Word and PDF export, library-PC session wipe.",
};

export default function InvoicesPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-wide text-gem">CLT Gems Docs</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-ink">Invoice Library</h1>
      <p className="mt-2 max-w-2xl text-muted leading-relaxed">
        Eight practical formats. Build as a guest, preview live, download Word (.docx) or PDF.
        Free useful tier first — no account required.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/invoices/builder" className="btn btn-primary">
          Open builder <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/invoices/formats" className="btn btn-secondary">
          Browse all formats
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-5 flex gap-3">
          <MonitorSmartphone className="h-5 w-5 text-gem shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-ink">Library / shared PC ready</h2>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              Drafts stay in this browser only. Use the wipe control on the builder before you walk away.
            </p>
          </div>
        </div>
        <div className="card p-5 flex gap-3">
          <Shield className="h-5 w-5 text-gem shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-ink">Getting paid matters</h2>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              Pair clean invoices with the directory and grants pointers — certification without cashflow is half the story.
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-12 font-display text-xl font-bold text-ink">Formats ({INVOICE_FORMATS.length})</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INVOICE_FORMATS.map((f) => (
          <FormatCard key={f.id} format={f} />
        ))}
      </div>
    </div>
  );
}
