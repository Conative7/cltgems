"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { calcTotals } from "@/lib/calculations";
import { createEmptyInvoice } from "@/lib/defaults";
import {
  clearSession,
  loadCredits,
  loadSession,
  saveCredits,
  saveSession,
  wipeAllLocalData,
} from "@/lib/storage";
import type { CreditState, FormatId, InvoiceData, LineItem } from "@/lib/types";
import { newLineItem } from "@/lib/defaults";

export function useInvoiceSession(initialFormat?: FormatId) {
  const [invoice, setInvoice] = useState<InvoiceData>(() =>
    createEmptyInvoice(initialFormat ?? "classic-service")
  );
  const [credits, setCredits] = useState<CreditState>({ credits: 10, plan: "free" });
  const [hydrated, setHydrated] = useState(false);
  const [wipeConfirm, setWipeConfirm] = useState(false);

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      if (initialFormat && saved.formatId !== initialFormat) {
        setInvoice({ ...saved, formatId: initialFormat, bilingual: initialFormat === "bilingual-en-es" });
      } else {
        setInvoice(saved);
      }
    } else if (initialFormat) {
      setInvoice(createEmptyInvoice(initialFormat));
    }
    setCredits(loadCredits());
    setHydrated(true);
  }, [initialFormat]);

  useEffect(() => {
    if (!hydrated) return;
    saveSession(invoice);
  }, [invoice, hydrated]);

  const totals = useMemo(() => calcTotals(invoice), [invoice]);

  const update = useCallback((patch: Partial<InvoiceData>) => {
    setInvoice((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateBusiness = useCallback((patch: Partial<InvoiceData["business"]>) => {
    setInvoice((prev) => ({ ...prev, business: { ...prev.business, ...patch } }));
  }, []);

  const updateClient = useCallback((patch: Partial<InvoiceData["client"]>) => {
    setInvoice((prev) => ({ ...prev, client: { ...prev.client, ...patch } }));
  }, []);

  const updateLineItem = useCallback((id: string, patch: Partial<LineItem>) => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((li) => (li.id === id ? { ...li, ...patch } : li)),
    }));
  }, []);

  const addLineItem = useCallback(() => {
    setInvoice((prev) => ({ ...prev, lineItems: [...prev.lineItems, newLineItem()] }));
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.length <= 1 ? prev.lineItems : prev.lineItems.filter((li) => li.id !== id),
    }));
  }, []);

  const setFormat = useCallback((formatId: FormatId) => {
    setInvoice((prev) => ({
      ...prev,
      formatId,
      bilingual: formatId === "bilingual-en-es",
    }));
  }, []);

  const resetInvoice = useCallback(() => {
    const next = createEmptyInvoice(invoice.formatId);
    setInvoice(next);
    clearSession();
  }, [invoice.formatId]);

  const wipeEverything = useCallback(() => {
    wipeAllLocalData();
    setInvoice(createEmptyInvoice(initialFormat ?? "classic-service"));
    setCredits({ credits: 10, plan: "free" });
    setWipeConfirm(false);
  }, [initialFormat]);

  const refreshCredits = useCallback(() => {
    setCredits(loadCredits());
  }, []);

  const setPlanCredits = useCallback((state: CreditState) => {
    saveCredits(state);
    setCredits(state);
  }, []);

  return {
    invoice,
    setInvoice,
    totals,
    credits,
    hydrated,
    wipeConfirm,
    setWipeConfirm,
    update,
    updateBusiness,
    updateClient,
    updateLineItem,
    addLineItem,
    removeLineItem,
    setFormat,
    resetInvoice,
    wipeEverything,
    refreshCredits,
    setPlanCredits,
  };
}
