"use client";

import { FormEvent, useState } from "react";
import { CATEGORIES, CERTIFICATIONS, type Category, type Certification } from "@/data/listings";
import { CheckCircle2 } from "lucide-react";

type FormState = {
  name: string;
  category: Category | "";
  certifications: Certification[];
  contactName: string;
  email: string;
  phone: string;
  website: string;
  area: string;
  notes: string;
};

const EMPTY: FormState = {
  name: "",
  category: "",
  certifications: [],
  contactName: "",
  email: "",
  phone: "",
  website: "",
  area: "",
  notes: "",
};

export function AddBusinessForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  function toggleCert(c: Certification) {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(c)
        ? prev.certifications.filter((x) => x !== c)
        : [...prev.certifications, c],
    }));
  }

  function validate(): string[] {
    const e: string[] = [];
    if (!form.name.trim()) e.push("Business name is required.");
    if (!form.category) e.push("Pick a category.");
    if (!form.email.trim() && !form.phone.trim()) e.push("Provide an email or phone.");
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.push("Email looks invalid.");
    }
    return e;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (errs.length) {
      setSaved(false);
      return;
    }

    const payload = {
      ...form,
      submittedAt: new Date().toISOString(),
    };
    try {
      const key = "cltgems_add_submissions";
      const prev = JSON.parse(localStorage.getItem(key) || "[]") as unknown[];
      prev.unshift(payload);
      localStorage.setItem(key, JSON.stringify(prev.slice(0, 25)));
    } catch {
      /* ignore quota */
    }
    setSaved(true);
  }

  function openMailto() {
    const subject = encodeURIComponent("CLT Gems — add business: " + form.name);
    const body = encodeURIComponent(
      [
        "Business: " + form.name,
        "Category: " + form.category,
        "Certifications: " + form.certifications.join(", "),
        "Area: " + form.area,
        "Contact: " + form.contactName,
        "Email: " + form.email,
        "Phone: " + form.phone,
        "Website: " + form.website,
        "Notes: " + form.notes,
        "",
        "(Sent from CLT Gems add form — MVP mailto stub)",
      ].join("\n")
    );
    window.location.href = "mailto:hello.aibloom@outlook.com?subject=" + subject + "&body=" + body;
  }

  if (saved) {
    return (
      <div className="card border-gem/30 bg-gem-mist p-6 space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-gem shrink-0" />
          <div>
            <h2 className="font-display text-xl font-bold text-ink">Saved on this device</h2>
            <p className="mt-2 text-sm text-stone-700 leading-relaxed">
              Your submission was stored in this browser (localStorage) so you have a copy.
              There is <strong>no live server inbox yet</strong> — this is an MVP stub.
            </p>
            <p className="mt-2 text-sm text-stone-700">
              TODO for production: wire a real form backend or CRM. Optionally email yourself now:
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary" onClick={openMailto}>
            Open email draft (mailto)
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setSaved(false);
              setForm(EMPTY);
            }}
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-5 sm:p-6 space-y-5" noValidate>
      {errors.length > 0 ? (
        <ul className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 list-disc list-inside">
          {errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Business name *</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Category *</label>
          <select
            className="input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category | "" })}
          >
            <option value="">Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">City area</label>
          <input
            className="input"
            placeholder="e.g. West Charlotte, Uptown"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Contact name</label>
          <input
            className="input"
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Phone</label>
          <input
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Website</label>
          <input
            className="input"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>
      </div>

      <fieldset>
        <legend className="label mb-2">Certifications</legend>
        <div className="flex flex-wrap gap-2">
          {CERTIFICATIONS.map((c) => {
            const on = form.certifications.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCert(c)}
                className={
                  "rounded-full border px-3 py-1 text-xs font-bold transition-colors " +
                  (on
                    ? "border-gem bg-gem text-white"
                    : "border-border bg-white text-stone-600 hover:border-gem")
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label className="label">Notes</label>
        <textarea
          className="input min-h-[100px]"
          placeholder="Services, service area, certifications in progress…"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <p className="text-xs text-muted leading-relaxed">
        MVP: validated in the browser and saved to localStorage. Optional mailto opens your email app.
        No claim of server delivery until a real backend is connected.
      </p>

      <button type="submit" className="btn btn-primary">
        Submit (local stub)
      </button>
    </form>
  );
}
