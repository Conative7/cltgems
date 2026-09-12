"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

export function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) {
      router.push("/directory");
      return;
    }
    router.push("/directory?q=" + encodeURIComponent(trimmed));
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          className="input pl-10"
          placeholder="Search directory (e.g. HUB, cleaning, West Charlotte)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search directory"
        />
      </div>
      <button type="submit" className="btn btn-primary shrink-0">
        Search
      </button>
    </form>
  );
}
