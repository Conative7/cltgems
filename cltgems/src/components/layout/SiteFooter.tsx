import Link from "next/link";
import { Mail } from "lucide-react";

const OUTLOOK =
  "https://outlook.live.com/mail/0/deeplink/compose?to=hello.aibloom%40outlook.com&subject=Hello%20from%20AI%20Bloom";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="container-page py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-lg font-extrabold text-gem-dark">AI Bloom</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">AI made simple.</p>
            <p className="mt-0.5 text-sm text-muted tracking-wide">Learn. Try. Grow.</p>
            <p className="mt-3 max-w-md text-sm text-muted leading-relaxed">
              Simple Charlotte tools for the AI age — find leads, price jobs, invoice, and get help
              without the hassle.
            </p>
            <a
              href={OUTLOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gem hover:underline underline-offset-2"
            >
              <Mail className="h-4 w-4" />
              hello.aibloom@outlook.com
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-stone-600">
              <Link href="/directory" className="hover:text-gem">Directory</Link>
              <Link href="/intel" className="hover:text-gem">Find leads</Link>
              <Link href="/price" className="hover:text-gem">Price a job</Link>
              <Link href="/invoices" className="hover:text-gem">Invoices</Link>
              <Link href="/add" className="hover:text-gem">Add business</Link>
              <Link href="/about" className="hover:text-gem">About</Link>
            </div>
            <p className="text-sm text-muted">
              Questions or just saying hi?{" "}
              <Link href="/about#connect" className="font-bold text-gem underline underline-offset-2">
                Connect with us
              </Link>
            </p>
          </div>
        </div>
        <p className="mt-8 text-xs text-stone-400">
          © {new Date().getFullYear()} AI Bloom · aibloom.agency · AI made simple. Learn. Try. Grow.
        </p>
      </div>
    </footer>
  );
}
