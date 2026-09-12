"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, FileText, Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { InvoiceForm } from "./InvoiceForm";
import { InvoicePreview } from "./InvoicePreview";
import { SessionWipe } from "./SessionWipe";
import { useInvoiceSession } from "@/hooks/useInvoiceSession";
import { downloadInvoiceDocx } from "@/lib/export/docx";
import { downloadInvoicePdf } from "@/lib/export/pdf";
import { createDemoInvoice, newLineItem } from "@/lib/defaults";
import { formatMoney } from "@/lib/calculations";
import { getFormat } from "@/lib/formats";
import { consumePriceHandoff } from "@/lib/pricing";
import { addExport, consumeCredit, loadCredits, saveDraft } from "@/lib/storage";
import type { FormatId } from "@/lib/types";

const VALID: FormatId[] = [
  "classic-service",
  "modern-minimal",
  "contractor-job",
  "retail-product",
  "consulting-tm",
  "creative-agency",
  "nonprofit",
  "bilingual-en-es",
];

export function BuilderClient() {
  const search = useSearchParams();
  const formatParam = search.get("format");
  const initialFormat = useMemo(() => {
    if (formatParam && VALID.includes(formatParam as FormatId)) return formatParam as FormatId;
    return undefined;
  }, [formatParam]);

  const session = useInvoiceSession(initialFormat);
  const [busy, setBusy] = useState<"pdf" | "docx" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const format = getFormat(session.invoice.formatId);
  const handoffApplied = useRef(false);

  useEffect(() => {
    if (!session.hydrated || handoffApplied.current) return;
    if (search.get("from") !== "price") return;
    const payload = consumePriceHandoff();
    if (!payload) return;
    handoffApplied.current = true;
    session.setInvoice((prev) => ({
      ...prev,
      formatId: payload.formatId,
      bilingual: false,
      notes: payload.notes,
      lineItems: payload.lineItems.map((li) =>
        newLineItem({
          description: li.description,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          unit: li.unit ?? "ea",
        })
      ),
    }));
    setMessage("Estimate loaded from Price a job — review line items before sending.");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- apply handoff once after hydrate
  }, [session.hydrated, search]);

  async function ensureCredit(): Promise<boolean> {
    const credits = loadCredits();
    if (credits.plan === "subscribe") return true;
    if (credits.credits <= 0) {
      setMessage("Free export allowance used for this browser. You can still edit & preview — wipe session or return later for a fresh free allowance (pricing hooks optional).");
      return false;
    }
    const next = consumeCredit();
    session.refreshCredits();
    setMessage("1 credit used. Remaining: " + next.credits);
    return true;
  }

  async function onPdf() {
    setBusy("pdf");
    setMessage(null);
    try {
      const ok = await ensureCredit();
      if (!ok) return;
      downloadInvoicePdf(session.invoice);
      addExport({
        id: uuidv4(),
        exportedAt: new Date().toISOString(),
        formatId: session.invoice.formatId,
        invoiceNumber: session.invoice.invoiceNumber,
        clientName: session.invoice.client.company || session.invoice.client.name || "Client",
        total: session.totals.total,
        type: "pdf",
      });
    } catch (e) {
      setMessage("PDF export failed: " + (e instanceof Error ? e.message : "unknown error"));
    } finally {
      setBusy(null);
    }
  }

  async function onDocx() {
    setBusy("docx");
    setMessage(null);
    try {
      const ok = await ensureCredit();
      if (!ok) return;
      await downloadInvoiceDocx(session.invoice);
      addExport({
        id: uuidv4(),
        exportedAt: new Date().toISOString(),
        formatId: session.invoice.formatId,
        invoiceNumber: session.invoice.invoiceNumber,
        clientName: session.invoice.client.company || session.invoice.client.name || "Client",
        total: session.totals.total,
        type: "docx",
      });
    } catch (e) {
      setMessage("Word export failed: " + (e instanceof Error ? e.message : "unknown error"));
    } finally {
      setBusy(null);
    }
  }

  function onSaveDraft() {
    const label =
      (session.invoice.client.company || session.invoice.client.name || "Untitled") +
      " · " +
      session.invoice.invoiceNumber;
    saveDraft({
      id: uuidv4(),
      savedAt: new Date().toISOString(),
      label,
      invoice: session.invoice,
    });
    setMessage("Draft saved to this browser.");
  }

  function loadDemo() {
    session.setInvoice(createDemoInvoice(session.invoice.formatId));
    setMessage("Demo data loaded — edit freely.");
  }

  if (!session.hydrated) {
    return <div className="text-sm text-muted p-6">Loading session…</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">
            Format: <span className="font-semibold text-ink">{format?.name}</span>
            {" · "}
            Guest builder — no signup required
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Free exports left: {session.credits.plan === "subscribe" ? "Unlimited" : session.credits.credits}
            {" · "}Total preview: {formatMoney(session.totals.total, session.invoice.currency)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary text-xs" onClick={loadDemo}>
            Load demo
          </button>
          <button type="button" className="btn btn-secondary text-xs" onClick={onSaveDraft}>
            <Save className="h-3.5 w-3.5" /> Save draft
          </button>
          <button
            type="button"
            className="btn btn-secondary text-xs"
            disabled={busy !== null}
            onClick={onDocx}
          >
            <FileText className="h-3.5 w-3.5" /> {busy === "docx" ? "…" : "Download Word"}
          </button>
          <button
            type="button"
            className="btn btn-primary text-xs"
            disabled={busy !== null}
            onClick={onPdf}
          >
            <Download className="h-3.5 w-3.5" /> {busy === "pdf" ? "…" : "Download PDF"}
          </button>
        </div>
      </div>

      {message ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
          {message}
        </div>
      ) : null}

      <SessionWipe
        wipeConfirm={session.wipeConfirm}
        setWipeConfirm={session.setWipeConfirm}
        onWipe={() => {
          session.wipeEverything();
          setMessage("All local CLT Gems invoice data wiped from this browser.");
        }}
        onReset={() => {
          session.resetInvoice();
          setMessage("Draft fields cleared.");
        }}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <InvoiceForm
          invoice={session.invoice}
          update={session.update}
          updateBusiness={session.updateBusiness}
          updateClient={session.updateClient}
          updateLineItem={session.updateLineItem}
          addLineItem={session.addLineItem}
          removeLineItem={session.removeLineItem}
          setFormat={session.setFormat}
        />
        <div className="xl:sticky xl:top-20 h-fit space-y-3">
          <h2 className="text-sm font-bold text-ink">Live preview</h2>
          <InvoicePreview invoice={session.invoice} totals={session.totals} />
        </div>
      </div>
    </div>
  );
}
