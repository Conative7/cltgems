import { v4 as uuidv4 } from "uuid";
import { todayISO } from "../calculations";
import type { EstimateAgreement, EstimateLineItem } from "./types";

export function newEstimateLine(partial?: Partial<EstimateLineItem>): EstimateLineItem {
  return {
    id: uuidv4(),
    description: "",
    quantity: 1,
    unitPrice: 0,
    unit: "ea",
    ...partial,
  };
}

function plusDays(iso: string, days: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function createEmptyEstimate(): EstimateAgreement {
  const issue = todayISO();
  return {
    documentNumber:
      "EST-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 9000) + 1000),
    issueDate: issue,
    validUntil: plusDays(issue, 30),
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    jobAddress: "",
    jobCityStateZip: "",
    scopeMode: "lines",
    lineItems: [
      newEstimateLine({ description: "Labor / services", quantity: 1, unitPrice: 0, unit: "ea" }),
    ],
    scopeBullets: ["Describe the work in plain language"],
    timeline: "",
    totalOverride: 0,
    depositType: "none",
    depositValue: 0,
    notes: "",
    currency: "USD",
  };
}

export const DISCLAIMER =
  "This is a simple work agreement / estimate acceptance for planning and client clarity. It is not legal advice and is not a substitute for an attorney-drafted contract. Customize terms for your trade and local requirements.";
