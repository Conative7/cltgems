"use client";

import type { ConstructionInputs, ConstructionJobType } from "@/lib/pricing";

const JOB_TYPES: { id: ConstructionJobType; label: string }[] = [
  { id: "repair", label: "Repair" },
  { id: "remodel", label: "Remodel" },
  { id: "new-work", label: "New work" },
];

export function ConstructionForm({
  inputs,
  onChange,
}: {
  inputs: ConstructionInputs;
  onChange: (next: ConstructionInputs) => void;
}) {
  function patch(p: Partial<ConstructionInputs>) {
    onChange({ ...inputs, ...p });
  }

  return (
    <div className="card p-5 space-y-4">
      <h2 className="font-display text-lg font-bold text-ink">General construction</h2>

      <fieldset>
        <legend className="label">Job type</legend>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map((j) => (
            <button
              key={j.id}
              type="button"
              className={
                "btn text-xs " +
                (inputs.jobType === j.id ? "btn-primary" : "btn-secondary")
              }
              onClick={() => patch({ jobType: j.id })}
            >
              {j.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="label">Square feet</span>
          <input
            className="input"
            type="number"
            min={0}
            value={inputs.sqFt || ""}
            placeholder="e.g. 200"
            onChange={(e) => patch({ sqFt: Number(e.target.value) || 0 })}
          />
          <span className="mt-1 block text-xs text-muted">
            Used when lump hours are 0 (labor = sq ft × $/sq ft).
          </span>
        </label>
        <label className="block">
          <span className="label">Lump labor hours (optional)</span>
          <input
            className="input"
            type="number"
            min={0}
            step="0.25"
            value={inputs.laborHours || ""}
            placeholder="Overrides sq ft labor"
            onChange={(e) => patch({ laborHours: Number(e.target.value) || 0 })}
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="label">Material budget ($)</span>
          <input
            className="input"
            type="number"
            min={0}
            step="any"
            value={inputs.materialBudget || ""}
            placeholder="e.g. 500"
            onChange={(e) => patch({ materialBudget: Number(e.target.value) || 0 })}
          />
        </label>
        <label className="block">
          <span className="label">Crew size</span>
          <input
            className="input"
            type="number"
            min={1}
            value={inputs.crewSize}
            onChange={(e) => patch({ crewSize: Math.max(1, Number(e.target.value) || 1) })}
          />
        </label>
      </div>

      <label className="block max-w-xs">
        <span className="label">Contingency %</span>
        <input
          className="input"
          type="number"
          min={0}
          step="any"
          value={inputs.contingencyPct}
          onChange={(e) => patch({ contingencyPct: Number(e.target.value) || 0 })}
        />
        <span className="mt-1 block text-xs text-muted">Applied to labor + materials before overhead.</span>
      </label>
    </div>
  );
}
