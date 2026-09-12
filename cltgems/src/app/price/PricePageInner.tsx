"use client";

import { useSearchParams } from "next/navigation";
import { PriceClient } from "@/components/price/PriceClient";
import type { TradeId } from "@/lib/pricing";

export function PricePageInner() {
  const search = useSearchParams();
  const tradeParam = search.get("trade");
  const initialTrade: TradeId | undefined =
    tradeParam === "cleaning" || tradeParam === "construction" ? tradeParam : undefined;
  return <PriceClient initialTrade={initialTrade} />;
}
