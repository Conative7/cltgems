import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { RESOURCE_GEMS } from "@/data/resources";

export const metadata: Metadata = {
  title: "Resources",
  description: "Curated Charlotte and NC grants, city/county links, certification how-tos, and getting-paid tools.",
};

const GROUPS = [
  "Grants & aid",
  "City & county",
  "Workforce & certification",
  "Getting paid",
] as const;

export default function ResourcesPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <h1 className="font-display text-3xl font-extrabold text-ink">Resources</h1>
      <p className="mt-2 max-w-2xl text-muted leading-relaxed">
        Short, actionable gems — grants/aid, city & county, workforce/certification, and getting paid.
        Always confirm details on the official site before you apply.
      </p>

      <div className="mt-10 space-y-10">
        {GROUPS.map((group) => {
          const items = RESOURCE_GEMS.filter((r) => r.group === group);
          return (
            <section key={group}>
              <h2 className="font-display text-xl font-bold text-ink">{group}</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {items.map((r) => {
                  const external = r.href.startsWith("http");
                  const CardInner = (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-bold text-ink">{r.title}</h3>
                        {external ? <ExternalLink className="h-4 w-4 shrink-0 text-muted" /> : null}
                      </div>
                      <p className="mt-2 text-sm text-stone-600 leading-relaxed flex-1">{r.summary}</p>
                      {r.verifyNote ? (
                        <p className="mt-2 text-xs font-semibold text-amber-800">
                          Verify on official site — program pages move often.
                        </p>
                      ) : null}
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {r.tags.map((t) => (
                          <li key={t} className="badge badge-gem">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                  return (
                    <li key={r.id}>
                      {external ? (
                        <a
                          href={r.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card flex h-full flex-col p-5 transition-shadow hover:shadow-md"
                        >
                          {CardInner}
                        </a>
                      ) : (
                        <Link href={r.href} className="card flex h-full flex-col p-5 transition-shadow hover:shadow-md">
                          {CardInner}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
