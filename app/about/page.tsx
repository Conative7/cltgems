import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "AI Bloom tools for underserved Charlotte businesses — directory, data intel, pricing, invoices.",
};

export default function AboutPage() {
  return (
    <div className="container-page py-10 sm:py-12 max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-wide text-gem">AI Bloom</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">About these tools</h1>
      <div className="mt-6 space-y-5 text-stone-700 leading-relaxed">
        <p>
          <strong className="text-ink">AI Bloom</strong> makes practical AI-era tools simple —
          learn, try, grow. This Charlotte-facing toolkit helps underserved, small, mobility, minority-owned,
          and certified contractors and operators get found, price work, pull local market lists, and get paid.
        </p>
        <p>
          Why put <Link href="/directory" className="font-semibold text-gem underline underline-offset-2">directory</Link>,{" "}
          <Link href="/intel" className="font-semibold text-gem underline underline-offset-2">data intel</Link>,{" "}
          <Link href="/price" className="font-semibold text-gem underline underline-offset-2">job pricing</Link>, and an{" "}
          <Link href="/invoices" className="font-semibold text-gem underline underline-offset-2">invoice library</Link>{" "}
          together? Getting found and finding opportunities matters — and so does getting paid.
          Clean Word/PDF invoices that work on a phone or library PC close that loop. Data intel is paid per task
          so the free Invoice Library still helps you bill for the work.
        </p>
        <p>
          Local product nickname <em>CLT Gems</em> still describes the Charlotte story in places —
          the chrome (header + footer) is AI Bloom for consistency with aibloom.agency.
        </p>
        <p>
          We keep messaging honest: this MVP ships with clearly labeled <em>demo listings</em>, not
          inflated “1,700 live results” claims. Replace sample data with your verified directory when ready.
        </p>
        <p className="rounded-xl border border-border bg-white p-4">
          <span className="font-display font-extrabold text-gem-dark">AI Bloom</span>
          <br />
          <span className="font-semibold text-ink">AI made simple.</span>
          <br />
          <span className="text-muted tracking-wide">Learn. Try. Grow.</span>
        </p>
      </div>
    </div>
  );
}
