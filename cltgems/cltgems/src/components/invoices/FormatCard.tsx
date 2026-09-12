import Link from "next/link";
import {
  Clock,
  FileText,
  HardHat,
  Heart,
  Languages,
  Package,
  Palette,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { ComponentType } from "react";
import type { InvoiceFormat } from "@/lib/types";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  FileText,
  Sparkles,
  HardHat,
  Package,
  Clock,
  Palette,
  Heart,
  Languages,
};

export function FormatCard({ format }: { format: InvoiceFormat }) {
  const Icon = ICONS[format.icon] ?? FileText;
  return (
    <article className="card flex flex-col p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white shrink-0"
          style={{ background: format.accent }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-ink">{format.name}</h3>
          <p className="text-sm text-muted">{format.tagline}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">{format.description}</p>
      <p className="mt-2 text-xs font-medium text-slate-500">
        <span className="text-ink">Best for:</span> {format.useCase}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {format.features.map((f) => (
          <li key={f} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {format.badges.map((b) => (
            <span key={b} className={b === "Word" ? "badge badge-word" : "badge badge-pdf"}>
              {b}
            </span>
          ))}
        </div>
        <Link href={"/invoices/builder?format=" + format.id} className="btn btn-primary text-xs py-2">
          Use format <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
