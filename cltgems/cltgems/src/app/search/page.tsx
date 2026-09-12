import { redirect } from "next/navigation";

/** Legacy /search route → directory with query. */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim();
  if (q) redirect("/directory?q=" + encodeURIComponent(q));
  redirect("/directory");
}
