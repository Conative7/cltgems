import type { Metadata } from "next";
import { LeadsTable } from "@/components/leads/LeadsTable";

export const metadata: Metadata = {
  title: "Check leads (private)",
  robots: { index: false, follow: false },
  description: "Password-gated Free Google check lead tracker — not for public navigation.",
};

export default function LeadsPage() {
  return (
    <div>
      <section className="section-ink border-b-4 border-warhol-yellow">
        <div className="container-page py-10 sm:py-12 max-w-5xl">
          <p className="inline-flex items-center rounded-full border-2 border-warhol-yellow bg-warhol-yellow px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-warhol-ink">
            Private · not in main nav
          </p>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            Google check leads
          </h1>
          <p className="mt-3 text-stone-300 max-w-2xl leading-relaxed">
            Best-effort store of /check lead magnet submissions. Use Formspree + optional webhook for
            durability.
          </p>
        </div>
      </section>
      <div className="container-page py-8 sm:py-10 max-w-5xl">
        <LeadsTable />
      </div>
    </div>
  );
}
