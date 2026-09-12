import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Why CLT Gems exists — resources, invoices, and directory for underserved Charlotte businesses.",
};

export default function AboutPage() {
  return (
    <div className="container-page py-10 sm:py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-ink">About CLT Gems</h1>
      <div className="mt-6 space-y-5 text-stone-700 leading-relaxed">
        <p>
          <strong className="text-ink">CLT Gems</strong> is a simple Charlotte resource hub for
          underserved, small, mobility, HUB, minority-owned, and certified contractors and operators.
          The goal is practical help — not a bloated SaaS.
        </p>
        <p>
          Why put <Link href="/directory" className="font-semibold text-gem underline underline-offset-2">directory</Link>,{" "}
          <Link href="/resources" className="font-semibold text-gem underline underline-offset-2">grants & resources</Link>, and an{" "}
          <Link href="/invoices" className="font-semibold text-gem underline underline-offset-2">invoice library</Link>{" "}
          together? Getting certified and finding opportunities matters — and so does getting paid.
          Clean Word/PDF invoices that work on a library PC close that loop.
        </p>
        <p>
          We keep messaging honest: this MVP ships with clearly labeled <em>demo listings</em>, not
          inflated “1,700 live results” claims. Replace sample data with your verified directory when ready.
        </p>
        <p className="text-sm text-muted">
          Powered quietly by AI Bloom in the footer — CLT Gems is the front door for Charlotte operators.
        </p>
      </div>
    </div>
  );
}
