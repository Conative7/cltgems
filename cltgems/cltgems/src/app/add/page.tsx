import type { Metadata } from "next";
import { AddBusinessForm } from "@/components/add/AddBusinessForm";

export const metadata: Metadata = {
  title: "Add your business",
  description: "Submit your Charlotte business for the CLT Gems directory (MVP local stub).",
};

export default function AddPage() {
  return (
    <div className="container-page py-10 sm:py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-ink">Add your business</h1>
      <p className="mt-2 text-muted leading-relaxed">
        Help the directory grow with real Charlotte operators — especially HUB, minority-owned,
        woman-owned, veteran, and NCSBE-certified firms.
      </p>
      <div className="mt-8">
        <AddBusinessForm />
      </div>
    </div>
  );
}
