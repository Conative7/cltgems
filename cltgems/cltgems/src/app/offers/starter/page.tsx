import { redirect } from "next/navigation";

/** Alias route → canonical /starter */
export default function OffersStarterRedirect() {
  redirect("/starter");
}
