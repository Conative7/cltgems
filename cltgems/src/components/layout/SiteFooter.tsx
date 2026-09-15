import Link from "next/link";
import { Mail } from "lucide-react";
import { outlookComposeUrl } from "@/lib/notifyEmail";

const OUTLOOK = outlookComposeUrl("Hello from AI Bloom", "");

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
              Simple Charlotte tools — find leads, free Google listing checks, price jobs, estimates, and
              invoices without Canva.
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
              <Link href="/intel" className="hover:text-gem">Find leads</Link>
              <Link href="/check" className="hover:text-gem">Free Google check</Link>
              <Link href="/pay" className="hover:text-gem">Pay</Link>
              <Link href="/price" className="hover:text-gem">Price a job</Link>
              <Link href="/estimate" className="hover:text-gem">Estimate</Link>
              <Link href="/invoices" className="hover:text-gem">Invoices</Link>
              <Link href="/starter" className="hover:text-gem">Get started</Link>
              <Link href="/about" className="hover:text-gem">About</Link>
              <Link href="/add" className="hover:text-gem text-muted">Add business</Link>
            </div>
            <p className="text-sm text-muted">
              Questions?{" "}
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
