import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FileText,
  HandCoins,
  PlusCircle,
  Search,
} from "lucide-react";
import { HomeSearch } from "@/components/home/HomeSearch";

const GEMS = [
  {
    href: "/directory",
    title: "Find a business",
    desc: "Browse demo listings of Charlotte-oriented contractors, mobility, cleaning, consulting & more.",
    icon: Building2,
  },
  {
    href: "/resources",
    title: "Grants & aid",
    desc: "Curated city, county, state, and workforce pointers — short cards, real program names where known.",
    icon: HandCoins,
  },
  {
    href: "/invoices",
    title: "Invoice library",
    desc: "8 Word + PDF formats. Guest builder with live preview. Works on a shared library PC.",
    icon: FileText,
  },
  {
    href: "/add",
    title: "Add your business",
    desc: "Tell us who you are so the directory can grow with real Charlotte operators.",
    icon: PlusCircle,
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-gem-mist to-warm">
        <div className="container-page py-14 sm:py-20">
          <p className="inline-flex items-center rounded-full bg-white border border-border px-3 py-1 text-xs font-bold text-gem-dark">
            Charlotte NC · Practical resources
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl leading-tight">
            A gem of resources for Charlotte businesses that are building, getting certified, and getting paid.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-600 leading-relaxed">
            For underserved, small, mobility, HUB, minority-owned, and certified contractors & operators —
            directory pointers, grants/aid links, and invoice docs without the SaaS bloat.
          </p>

          <div className="mt-8 max-w-xl">
            <HomeSearch />
          </div>

          <p className="mt-4 flex items-start gap-2 text-sm text-muted">
            <Search className="h-4 w-4 mt-0.5 shrink-0 text-gem" />
            Growing directory of NC-certified & local operators — not a fake 1,700-listing claim.
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <h2 className="font-display text-2xl font-extrabold text-ink">Four gems to start</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {GEMS.map((g) => {
            const Icon = g.icon;
            return (
              <Link
                key={g.href}
                href={g.href}
                className="card group flex gap-4 p-5 transition-shadow hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gem text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-ink group-hover:text-gem">
                    {g.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted leading-relaxed">{g.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-gem">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 card border-gem/20 bg-gem-mist p-5 sm:p-6">
          <h3 className="font-display text-lg font-bold text-gem-dark">Library & shared PC friendly</h3>
          <p className="mt-2 text-sm text-stone-700 leading-relaxed max-w-3xl">
            Need an invoice on a public computer? Use the{" "}
            <Link href="/invoices" className="font-bold text-gem underline underline-offset-2">
              Invoice Library
            </Link>{" "}
            — no account required. Download Word or PDF, then use{" "}
            <strong>Clear session / wipe data</strong> before you leave so the next person cannot see your draft.
          </p>
        </div>
      </section>
    </div>
  );
}
