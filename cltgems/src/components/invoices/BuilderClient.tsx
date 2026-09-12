"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, FileText, Mail, Save, Share2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { InvoiceForm } from "./InvoiceForm";
import { InvoicePreview } from "./InvoicePreview";
import { SessionWipe } from "./SessionWipe";
import { useInvoiceSession } from "@/hooks/useInvoiceSession";
import { downloadInvoiceDocx } from "@/lib/export/docx";
import { buildInvoicePdfBlob, downloadInvoicePdf } from "@/lib/export/pdf";
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

function canExport(): { ok: true } | { ok: false; message: string } {
  const credits = loadCredits();
  if (credits.plan === "subscribe") return { ok: true };
  if (credits.credits <= 0) {
    return {
      ok: false,
      message:
        "Free export allowance used for this browser. You can still edit & preview — wipe session or return later for a fresh free allowance.",
    };
  }
  return { ok: true };
}

function openMailto(invoice: ReturnType<typeof useInvoiceSession>["invoice"], totalLabel: string) {
  const to = invoice.client.email?.trim() || "";
  const fromName = invoice.business.name?.trim() || "your business";
  const subject = encodeURIComponent(`Invoice ${invoice.invoiceNumber} from ${fromName}`);
  const body = encodeURIComponent(
    [
      "Hi" + (invoice.client.name ? " " + invoice.client.name.split(" ")[0] : "") + ",",
      "",
      `Please find invoice ${invoice.invoiceNumber} attached as a PDF.`,
      `Total due: ${totalLabel}`,
      `Due date: ${invoice.dueDate}`,
      "",
      "Attach the PDF you downloaded from the invoice builder, then send this email.",
      "",
      "Thank you,",
      fromName,
      invoice.business.email || "",
      invoice.business.phone || "",
    ]
      .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
      .join("\n")
  );
  window.location.href = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;
}

export function BuilderClient() {
  const search = useSearchParams();
  const formatParam = search.get("format");
  const initialFormat = useMemo(() => {
    if (formatParam && VALID.includes(formatParam as FormatId)) return formatParam as FormatId;
    return undefined;
  }, [formatParam]);

  const session = useInvoiceSession(initialFormat);
  const [busy, setBusy] = useState<"pdf" | "docx" | "share" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"info" | "error" | "ok">("info");
  const format = getFormat(session.invoice.formatId);
  const handoffApplied = useRef(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

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
    setMessageTone("ok");
    setMessage("Estimate loaded from Price a job — review line items before sending.");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- apply handoff once after hydrate
  }, [session.hydrated, search]);

  function recordExport(type: "pdf" | "docx") {
    addExport({
      id: uuidv4(),
      exportedAt: new Date().toISOString(),
      formatId: session.invoice.formatId,
      invoiceNumber: session.invoice.invoiceNumber,
      clientName: session.invoice.client.company || session.invoice.client.name || "Client",
      total: session.totals.total,
      type,
    });
  }

  function afterSuccessfulExport(type: "pdf" | "docx") {
    const next = consumeCredit();
    session.refreshCredits();
    recordExport(type);
    const left =
      next.plan === "subscribe" ? "Unlimited" : String(next.credits);
    setMessageTone("ok");
    setMessage(
      (type === "pdf" ? "PDF downloaded" : "Word file downloaded") +
        ". 1 credit used. Remaining: " +
        left
    );
  }

  async function onPdf() {
    setBusy("pdf");
    setMessage(null);
    try {
      const gate = canExport();
      if (!gate.ok) {
        setMessageTone("error");
        setMessage(gate.message);
        return;
      }
      await downloadInvoicePdf(session.invoice);
      afterSuccessfulExport("pdf");
    } catch (e) {
      setMessageTone("error");
      setMessage(
        "PDF export failed: " +
          (e instanceof Error ? e.message : "unknown error") +
          ". Credit was not used."
      );
    } finally {
      setBusy(null);
    }
  }

  async function onDocx() {
    setBusy("docx");
    setMessage(null);
    try {
      const gate = canExport();
      if (!gate.ok) {
        setMessageTone("error");
        setMessage(gate.message);
        return;
      }
      await downloadInvoiceDocx(session.invoice);
      afterSuccessfulExport("docx");
    } catch (e) {
      setMessageTone("error");
      setMessage(
        "Word export failed: " +
          (e instanceof Error ? e.message : "unknown error") +
          ". Credit was not used."
      );
    } finally {
      setBusy(null);
    }
  }

  async function onShare() {
    setBusy("share");
    setMessage(null);
    try {
      const { blob, filename } = buildInvoicePdfBlob(session.invoice);
      const file = new File([blob], filename, { type: "application/pdf" });
      const title = `Invoice ${session.invoice.invoiceNumber}`;
      const text =
        `Invoice ${session.invoice.invoiceNumber} · Total ${formatMoney(session.totals.total, session.invoice.currency)}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title, text });
        setMessageTone("ok");
        setMessage("Shared. Attachments via Share do not use an export credit.");
        return;
      }
      if (typeof navigator.share === "function") {
        await navigator.share({ title, text });
        setMessageTone("info");
        setMessage("Shared text only — download the PDF first if you need to attach the file.");
        return;
      }
      setMessageTone("info");
      setMessage("Sharing isn’t available here — use Email invoice or Download PDF.");
    } catch (e) {
      // User cancel is fine
      if (e instanceof Error && e.name === "AbortError") {
        setMessage(null);
        return;
      }
      setMessageTone("error");
      setMessage("Share failed: " + (e instanceof Error ? e.message : "unknown error"));
    } finally {
      setBusy(null);
    }
  }

  function onEmail() {
    openMailto(
      session.invoice,
      formatMoney(session.totals.total, session.invoice.currency)
    );
    setMessageTone("info");
    setMessage(
      "Email draft opened. Download the PDF first, then attach it before sending. No credit used for email."
    );
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
    setMessageTone("ok");
    setMessage("Draft saved to this browser.");
  }

  function loadDemo() {
    session.setInvoice(createDemoInvoice(session.invoice.formatId));
    setMessageTone("ok");
    setMessage("Demo data loaded — edit freely.");
  }

  if (!session.hydrated) {
    return <div className="text-sm text-muted p-6">Loading session…</div>;
  }

  const actionButtons = (
    <>
      <button
        type="button"
        className="btn btn-primary min-h-11 text-sm flex-1 sm:flex-none"
        disabled={busy !== null}
        onClick={onPdf}
      >
        <Download className="h-4 w-4" /> {busy === "pdf" ? "Preparing…" : "PDF"}
      </button>
      <button
        type="button"
        className="btn btn-secondary min-h-11 text-sm flex-1 sm:flex-none"
        disabled={busy !== null}
        onClick={onDocx}
      >
        <FileText className="h-4 w-4" /> {busy === "docx" ? "…" : "Word"}
      </button>
      <button
        type="button"
        className="btn btn-secondary min-h-11 text-sm flex-1 sm:flex-none"
        disabled={busy !== null}
        onClick={onEmail}
      >
        <Mail className="h-4 w-4" /> Email
      </button>
      {canNativeShare ? (
        <button
          type="button"
          className="btn btn-secondary min-h-11 text-sm flex-1 sm:flex-none"
          disabled={busy !== null}
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" /> {busy === "share" ? "…" : "Share"}
        </button>
      ) : null}
    </>
  );

  const msgClass =
    messageTone === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : messageTone === "ok"
        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
        : "border-blue-200 bg-blue-50 text-blue-900";

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
            Free exports left:{" "}
            {session.credits.plan === "subscribe" ? "Unlimited" : session.credits.credits}
            {" · "}Total preview: {formatMoney(session.totals.total, session.invoice.currency)}
          </p>
        </div>
        <div className="hidden md:flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary text-sm min-h-10" onClick={loadDemo}>
            Load demo
          </button>
          <button type="button" className="btn btn-secondary text-sm min-h-10" onClick={onSaveDraft}>
            <Save className="h-4 w-4" /> Save draft
          </button>
          {actionButtons}
        </div>
      </div>

      {message ? (
        <div className={"rounded-lg border px-3 py-2.5 text-sm " + msgClass}>{message}</div>
      ) : null}

      <SessionWipe
        wipeConfirm={session.wipeConfirm}
        setWipeConfirm={session.setWipeConfirm}
        onWipe={() => {
          session.wipeEverything();
          setMessageTone("ok");
          setMessage("All local invoice data wiped from this browser.");
        }}
        onReset={() => {
          session.resetInvoice();
          setMessageTone("info");
          setMessage("Draft fields cleared.");
        }}
      />

      <div className="md:hidden flex flex-wrap gap-2">
        <button type="button" className="btn btn-secondary text-sm min-h-10" onClick={loadDemo}>
          Load demo
        </button>
        <button type="button" className="btn btn-secondary text-sm min-h-10" onClick={onSaveDraft}>
          <Save className="h-4 w-4" /> Save draft
        </button>
      </div>

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
        <div className="xl:sticky xl:top-20 h-fit space-y-3 hidden sm:block">
          <h2 className="text-sm font-bold text-ink">Live preview</h2>
          <InvoicePreview invoice={session.invoice} totals={session.totals} />
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-warm/95 backdrop-blur px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(28,25,23,0.08)]">
        <div className="flex gap-2 max-w-lg mx-auto">{actionButtons}</div>
        <p className="mt-1.5 text-center text-[11px] text-muted">
          Credits only charged after a successful PDF/Word download
        </p>
      </div>
    </div>
  );
}
