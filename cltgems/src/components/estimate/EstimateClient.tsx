"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Download,
  FileText,
  Lock,
  Mail,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { DecimalInput } from "@/components/ui/DecimalInput";
import { formatMoney } from "@/lib/calculations";
import {
  DISCLAIMER,
  calcEstimateTotals,
  consumeEstimateCredit,
  createEmptyEstimate,
  downloadEstimateDocx,
  downloadEstimatePdf,
  loadEstimateCredits,
  loadEstimateDraft,
  newEstimateLine,
  saveEstimateDraft,
  saveEstimateInvoiceHandoff,
  type DepositType,
  type EstimateAgreement,
  type ScopeMode,
} from "@/lib/estimate";
import { consumePriceHandoff } from "@/lib/pricing";

function canExportEstimate(): { ok: true } | { ok: false; message: string } {
  const credits = loadEstimateCredits();
  if (credits.plan === "subscribe") return { ok: true };
  if (credits.credits <= 0) {
    return {
      ok: false,
      message:
        "Free estimate exports used for this browser (2 included). You can still edit & preview — or get AI Bloom Starter for done-for-you setup.",
    };
  }
  return { ok: true };
}

function openMailto(data: EstimateAgreement, totalLabel: string) {
  const to = data.clientEmail?.trim() || "";
  const fromName = data.businessName?.trim() || "your business";
  const subject = encodeURIComponent(`Estimate ${data.documentNumber} from ${fromName}`);
  const body = encodeURIComponent(
    [
      "Hi" + (data.clientName ? " " + data.clientName.split(" ")[0] : "") + ",",
      "",
      `Please find estimate ${data.documentNumber} attached as a PDF.`,
      `Estimate total: ${totalLabel}`,
      data.validUntil ? `Valid until: ${data.validUntil}` : "",
      "",
      "Attach the PDF you downloaded, then send this email.",
      "",
      "Thank you,",
      fromName,
      data.businessEmail || "",
      data.businessPhone || "",
    ]
      .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
      .join("\n")
  );
  window.location.href = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;
}

export function EstimateClient() {
  const search = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<EstimateAgreement>(() => createEmptyEstimate());
  const [hydrated, setHydrated] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(2);
  const [busy, setBusy] = useState<"pdf" | "docx" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"info" | "error" | "ok">("info");
  const handoffApplied = useRef(false);

  const totals = useMemo(() => calcEstimateTotals(data), [data]);

  useEffect(() => {
    const saved = loadEstimateDraft();
    if (saved) setData(saved);
    setCreditsLeft(loadEstimateCredits().credits);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveEstimateDraft(data);
  }, [data, hydrated]);

  useEffect(() => {
    if (!hydrated || handoffApplied.current) return;
    if (search.get("from") !== "price") return;
    const payload = consumePriceHandoff();
    if (!payload) return;
    handoffApplied.current = true;
    setData((prev) => ({
      ...prev,
      scopeMode: "lines",
      lineItems: payload.lineItems.map((li) =>
        newEstimateLine({
          description: li.description,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          unit: li.unit ?? "ea",
        })
      ),
      totalOverride: payload.targetTotal,
      notes:
        prev.notes ||
        `Imported from Price a job (${payload.trade}) — target ballpark ${formatMoney(payload.targetTotal)}.`,
    }));
    setMessageTone("ok");
    setMessage(
      "Loaded from Price a job — add client & job address, then download PDF or turn into an invoice."
    );
  }, [hydrated, search]);

  function patch(p: Partial<EstimateAgreement>) {
    setData((prev) => ({ ...prev, ...p }));
  }

  function afterExport(type: "pdf" | "docx") {
    const next = consumeEstimateCredit();
    setCreditsLeft(next.credits);
    setMessageTone("ok");
    setMessage(
      (type === "pdf" ? "PDF downloaded" : "Word file downloaded") +
        ". 1 estimate credit used. Remaining: " +
        (next.plan === "subscribe" ? "Unlimited" : String(next.credits))
    );
  }

  async function onPdf() {
    setBusy("pdf");
    setMessage(null);
    try {
      const gate = canExportEstimate();
      if (!gate.ok) {
        setMessageTone("error");
        setMessage(gate.message);
        return;
      }
      await downloadEstimatePdf(data);
      afterExport("pdf");
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
      const gate = canExportEstimate();
      if (!gate.ok) {
        setMessageTone("error");
        setMessage(gate.message);
        return;
      }
      await downloadEstimateDocx(data);
      afterExport("docx");
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

  function onEmail() {
    openMailto(data, formatMoney(totals.subtotal, data.currency));
    setMessageTone("info");
    setMessage("Email draft opened. Download the PDF first, then attach it. No credit used for email.");
  }

  function onTurnIntoInvoice() {
    const lineItems =
      data.scopeMode === "lines"
        ? data.lineItems
            .filter((li) => li.description.trim() || li.unitPrice > 0)
            .map((li) => ({
              description: li.description || "Services",
              quantity: li.quantity || 1,
              unitPrice: li.unitPrice,
              unit: li.unit ?? "ea",
            }))
        : [
            {
              description:
                "Work per estimate " +
                data.documentNumber +
                (data.scopeBullets.filter((b) => b.trim()).length
                  ? " — " + data.scopeBullets.filter((b) => b.trim()).slice(0, 3).join("; ")
                  : ""),
              quantity: 1,
              unitPrice: totals.subtotal,
              unit: "ea",
            },
          ];

    const noteParts = [
      `From estimate ${data.documentNumber}`,
      data.timeline ? `Timeline: ${data.timeline}` : "",
      data.jobAddress || data.jobCityStateZip
        ? `Job: ${[data.jobAddress, data.jobCityStateZip].filter(Boolean).join(", ")}`
        : "",
      totals.depositAmount > 0
        ? `Deposit noted on estimate: ${formatMoney(totals.depositAmount, data.currency)}`
        : "",
      data.notes.trim(),
      DISCLAIMER,
    ].filter(Boolean);

    saveEstimateInvoiceHandoff({
      source: "estimate-agreement",
      createdAt: new Date().toISOString(),
      formatId: "classic-service",
      notes: noteParts.join("\n"),
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      clientAddress: data.jobAddress,
      clientCityStateZip: data.jobCityStateZip,
      businessName: data.businessName,
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      lineItems,
    });
    router.push("/invoices/builder?from=estimate&format=classic-service");
  }

  if (!hydrated) {
    return <div className="text-sm text-muted p-6">Loading estimate…</div>;
  }

  const msgClass =
    messageTone === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : messageTone === "ok"
        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
        : "border-blue-200 bg-blue-50 text-blue-900";

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
      <button
        type="button"
        className="btn btn-secondary min-h-11 text-sm flex-1 sm:flex-none border-gem/40 text-gem-dark"
        onClick={onTurnIntoInvoice}
      >
        <ArrowRight className="h-4 w-4" /> Invoice
      </button>
    </>
  );

  return (
    <div className="space-y-5 pb-28 md:pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">
            Guest tool — no signup · drafts stay in this browser
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Free exports left: {creditsLeft}
            {" · "}Total: {formatMoney(totals.subtotal, data.currency)}
            {totals.depositAmount > 0
              ? ` · Deposit ${formatMoney(totals.depositAmount, data.currency)}`
              : ""}
          </p>
        </div>
        <div className="hidden md:flex flex-wrap gap-2">{actionButtons}</div>
      </div>

      {message ? (
        <div className={"rounded-lg border px-3 py-2.5 text-sm " + msgClass}>{message}</div>
      ) : null}

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-950 leading-relaxed">
        <strong className="font-bold">Disclaimer:</strong> {DISCLAIMER}
      </div>

      <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-3 space-y-4">
          <section className="card p-4 sm:p-5 space-y-3">
            <h2 className="font-display text-base font-bold text-ink">Document</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="est-num">
                  Estimate #
                </label>
                <input
                  id="est-num"
                  className="input"
                  value={data.documentNumber}
                  onChange={(e) => patch({ documentNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="label" htmlFor="est-issue">
                  Issue date
                </label>
                <input
                  id="est-issue"
                  type="date"
                  className="input"
                  value={data.issueDate}
                  onChange={(e) => patch({ issueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="label" htmlFor="est-valid">
                  Valid until
                </label>
                <input
                  id="est-valid"
                  type="date"
                  className="input"
                  value={data.validUntil}
                  onChange={(e) => patch({ validUntil: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="card p-4 sm:p-5 space-y-3">
            <h2 className="font-display text-base font-bold text-ink">Your business</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="biz-name">
                  Business name
                </label>
                <input
                  id="biz-name"
                  className="input"
                  value={data.businessName}
                  onChange={(e) => patch({ businessName: e.target.value })}
                  placeholder="Your company"
                />
              </div>
              <div>
                <label className="label" htmlFor="biz-email">
                  Email
                </label>
                <input
                  id="biz-email"
                  type="email"
                  className="input"
                  value={data.businessEmail}
                  onChange={(e) => patch({ businessEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="label" htmlFor="biz-phone">
                  Phone
                </label>
                <input
                  id="biz-phone"
                  className="input"
                  value={data.businessPhone}
                  onChange={(e) => patch({ businessPhone: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="card p-4 sm:p-5 space-y-3">
            <h2 className="font-display text-base font-bold text-ink">Client & job</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="cli-name">
                  Client name
                </label>
                <input
                  id="cli-name"
                  className="input"
                  value={data.clientName}
                  onChange={(e) => patch({ clientName: e.target.value })}
                />
              </div>
              <div>
                <label className="label" htmlFor="cli-email">
                  Client email
                </label>
                <input
                  id="cli-email"
                  type="email"
                  className="input"
                  value={data.clientEmail}
                  onChange={(e) => patch({ clientEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="label" htmlFor="cli-phone">
                  Client phone
                </label>
                <input
                  id="cli-phone"
                  className="input"
                  value={data.clientPhone}
                  onChange={(e) => patch({ clientPhone: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="job-addr">
                  Job address
                </label>
                <input
                  id="job-addr"
                  className="input"
                  value={data.jobAddress}
                  onChange={(e) => patch({ jobAddress: e.target.value })}
                  placeholder="Street"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="job-csz">
                  City, state, ZIP
                </label>
                <input
                  id="job-csz"
                  className="input"
                  value={data.jobCityStateZip}
                  onChange={(e) => patch({ jobCityStateZip: e.target.value })}
                  placeholder="Charlotte, NC 28202"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="timeline">
                  Timeline
                </label>
                <input
                  id="timeline"
                  className="input"
                  value={data.timeline}
                  onChange={(e) => patch({ timeline: e.target.value })}
                  placeholder="e.g. Start Mon · finish in 2 days"
                />
              </div>
            </div>
          </section>

          <section className="card p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold text-ink">Scope of work</h2>
              <div className="flex rounded-lg border border-border p-0.5 bg-warm">
                {(
                  [
                    { id: "lines" as ScopeMode, label: "Line items" },
                    { id: "bullets" as ScopeMode, label: "Bullets" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={
                      "rounded-md px-3 py-1.5 text-xs font-bold transition-colors " +
                      (data.scopeMode === opt.id
                        ? "bg-gem text-white"
                        : "text-muted hover:text-ink")
                    }
                    onClick={() => patch({ scopeMode: opt.id })}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {data.scopeMode === "lines" ? (
              <div className="space-y-3">
                {data.lineItems.map((li) => (
                  <div
                    key={li.id}
                    className="rounded-xl border border-border bg-warm/60 p-3 space-y-2"
                  >
                    <input
                      className="input"
                      placeholder="Description"
                      value={li.description}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          lineItems: prev.lineItems.map((x) =>
                            x.id === li.id ? { ...x, description: e.target.value } : x
                          ),
                        }))
                      }
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="label">Qty</label>
                        <DecimalInput
                          value={li.quantity}
                          onChange={(n) =>
                            setData((prev) => ({
                              ...prev,
                              lineItems: prev.lineItems.map((x) =>
                                x.id === li.id ? { ...x, quantity: n } : x
                              ),
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="label">Unit price</label>
                        <DecimalInput
                          value={li.unitPrice}
                          onChange={(n) =>
                            setData((prev) => ({
                              ...prev,
                              lineItems: prev.lineItems.map((x) =>
                                x.id === li.id ? { ...x, unitPrice: n } : x
                              ),
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          className="btn btn-secondary w-full min-h-10 text-sm"
                          aria-label="Remove line"
                          disabled={data.lineItems.length <= 1}
                          onClick={() =>
                            setData((prev) => ({
                              ...prev,
                              lineItems:
                                prev.lineItems.length <= 1
                                  ? prev.lineItems
                                  : prev.lineItems.filter((x) => x.id !== li.id),
                            }))
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary text-sm min-h-10"
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      lineItems: [...prev.lineItems, newEstimateLine()],
                    }))
                  }
                >
                  <Plus className="h-4 w-4" /> Add line
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="label" htmlFor="bullets">
                    Scope bullets (one per line)
                  </label>
                  <textarea
                    id="bullets"
                    className="input min-h-[140px] font-sans"
                    value={data.scopeBullets.join("\n")}
                    onChange={(e) =>
                      patch({
                        scopeBullets: e.target.value.split("\n"),
                      })
                    }
                    placeholder={"Deep clean kitchen\nWipe cabinets\nMop floors"}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="total-override">
                    Estimate total ($)
                  </label>
                  <DecimalInput
                    id="total-override"
                    value={data.totalOverride}
                    onChange={(n) => patch({ totalOverride: n })}
                  />
                </div>
              </div>
            )}
          </section>

          <section className="card p-4 sm:p-5 space-y-3">
            <h2 className="font-display text-base font-bold text-ink">Deposit (optional)</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="dep-type">
                  Type
                </label>
                <select
                  id="dep-type"
                  className="input"
                  value={data.depositType}
                  onChange={(e) => patch({ depositType: e.target.value as DepositType })}
                >
                  <option value="none">None</option>
                  <option value="percent">Percent %</option>
                  <option value="fixed">Fixed $</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="dep-val">
                  Value
                </label>
                <DecimalInput
                  id="dep-val"
                  value={data.depositValue}
                  onChange={(n) => patch({ depositValue: n })}
                  disabled={data.depositType === "none"}
                />
              </div>
            </div>
          </section>

          <section className="card p-4 sm:p-5 space-y-3">
            <h2 className="font-display text-base font-bold text-ink">Notes</h2>
            <textarea
              className="input min-h-[90px]"
              value={data.notes}
              onChange={(e) => patch({ notes: e.target.value })}
              placeholder="Payment method, exclusions, site access…"
            />
          </section>
        </div>

        <aside className="lg:col-span-2 space-y-4 lg:sticky lg:top-20">
          <div className="card p-5 space-y-4 border-gem/25 bg-gem-mist/40">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gem">Live total</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-gem-dark tabular-nums">
                {formatMoney(totals.subtotal, data.currency)}
              </p>
              {totals.depositAmount > 0 ? (
                <p className="mt-2 text-sm text-stone-600">
                  Deposit {formatMoney(totals.depositAmount, data.currency)}
                  {" · "}Balance {formatMoney(totals.balanceDue, data.currency)}
                </p>
              ) : null}
            </div>
            <div className="hidden sm:flex flex-col gap-2">{actionButtons}</div>
            <p className="text-[11px] text-muted leading-relaxed">
              Credits only charged after a successful PDF/Word download. Invoice handoff is free.
            </p>
          </div>

          <div className="card p-4 border-gem/30 bg-white space-y-2">
            <p className="flex items-center gap-2 text-sm font-bold text-gem-dark">
              <Sparkles className="h-4 w-4" />
              Want this done-for-you?
            </p>
            <p className="text-xs text-muted leading-relaxed">
              AI Bloom Starter sets your rates, estimate/invoice pack, and follow-up scripts — $497
              one-time.
            </p>
            <Link href="/starter" className="btn btn-primary w-full text-sm min-h-10">
              AI Bloom Starter $497 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-dashed border-border bg-stone-50 p-4">
            <div className="pointer-events-none select-none blur-[2px] opacity-60 space-y-2">
              <p className="text-sm font-bold text-ink">Pro templates</p>
              <p className="text-xs text-muted">Cleaning · Remodel · Handyman packs</p>
              <div className="h-8 rounded-lg bg-stone-200" />
              <div className="h-8 rounded-lg bg-stone-200 w-2/3" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/95 px-3 py-1.5 text-xs font-bold text-muted shadow-sm">
                <Lock className="h-3.5 w-3.5" /> Coming later — not required for MVP
              </span>
            </div>
          </div>

          <button
            type="button"
            className="text-xs font-semibold text-muted hover:text-ink underline underline-offset-2"
            onClick={() => {
              setData(createEmptyEstimate());
              setMessageTone("info");
              setMessage("Started fresh.");
            }}
          >
            Clear & start from scratch
          </button>
        </aside>
      </div>

      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-warm/95 backdrop-blur px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(28,25,23,0.08)]">
        <div className="flex gap-2 max-w-lg mx-auto flex-wrap">{actionButtons}</div>
      </div>
    </div>
  );
}
