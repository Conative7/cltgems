import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="container-page py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-lg font-extrabold text-ink">CLT Gems</p>
            <p className="mt-1 max-w-md text-sm text-muted leading-relaxed">
              A simple gem of resources for underserved Charlotte businesses — directory,
              grants pointers, job pricing, and invoice docs that work on a library PC.
            </p>
            <p className="mt-4 font-display text-base font-extrabold text-gem-dark">AI Bloom</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">AI made simple.</p>
            <p className="mt-0.5 text-sm text-muted tracking-wide">Learn. Try. Grow.</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-stone-600">
            <Link href="/directory" className="hover:text-gem">Directory</Link>
            <Link href="/resources" className="hover:text-gem">Resources</Link>
            <Link href="/price" className="hover:text-gem">Price a job</Link>
            <Link href="/invoices" className="hover:text-gem">Invoices</Link>
            <Link href="/add" className="hover:text-gem">Add business</Link>
            <Link href="/about" className="hover:text-gem">About</Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-stone-400">
          © {new Date().getFullYear()} CLT Gems · aibloom.agency · AI Bloom — AI made simple. Learn. Try. Grow.
        </p>
      </div>
    </footer>
  );
}
