import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Thanks · Payment received",
  description: "Thanks for your AI Bloom payment. We’ll follow up by email.",
};

export default function PayThanksPage() {
  return (
    <div className="section-cream border-b-4 border-warhol-ink">
      <div className="container-page py-16 sm:py-24 max-w-xl text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-warhol-ink bg-warhol-teal text-white shadow-[4px_4px_0_var(--warhol-ink)]">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="headline-lg mt-6">Payment received — thank you</h1>
        <p className="mt-3 text-stone-600 leading-relaxed font-medium">
          Stripe confirms the charge. We’ll email you at the address on the receipt with next steps
          (usually within one business day). Questions? hello.aibloom@outlook.com
        </p>
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          <Link href="/intel" className="btn-warhol btn-warhol-magenta">
            Back to Find leads <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/" className="btn-warhol btn-warhol-outline">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
