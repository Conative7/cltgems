import type { Metadata } from "next";
import { LeadsTable } from "@/components/leads/LeadsTable";

export const metadata: Metadata = {
  title: "Check leads (private)",
  robots: { index: false, follow: false },
  description: "Password-gated Free Google check lead tracker — not for public navigation.",
};

export default function LeadsPage() {
  return (
    <div className="container-page py-10 sm:py-12 max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-wide text-muted mb-2">Private · not in main nav</p>
      <h1 className="font-display text-3xl font-extrabold text-ink">Google check leads</h1>
      <p className="mt-2 text-stone-600 mb-8 max-w-2xl">
        Best-effort store of /check lead magnet submissions. Use Formspree + optional webhook for
        durability.
      </p>
      <LeadsTable />
    </div>
  );
}
