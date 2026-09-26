import type { Metadata } from "next";
import { AddBusinessForm } from "@/components/add/AddBusinessForm";

export const metadata: Metadata = {
  title: "Add your business",
  description: "Submit your Charlotte business for the AI Bloom directory (MVP local stub).",
};

export default function AddPage() {
  return (
    <div>
      <section className="section-cream border-b-4 border-warhol-ink">
        <div className="container-page py-10 sm:py-14 max-w-3xl">
          <p className="warhol-eyebrow">Directory · Charlotte</p>
          <h1 className="headline-lg mt-5">Add your business</h1>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed font-medium">
            Help the directory grow with real Charlotte operators — especially HUB, minority-owned,
            woman-owned, veteran, and NCSBE-certified firms.
          </p>
        </div>
      </section>
      <div className="container-page py-10 sm:py-12 max-w-3xl">
        <div className="rounded-2xl border-2 border-warhol-ink bg-white p-5 sm:p-6 shadow-[6px_6px_0_var(--warhol-teal)]">
          <AddBusinessForm />
        </div>
      </div>
    </div>
  );
}
