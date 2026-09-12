"use client";

import type { CleaningInputs, CleaningJobType, CleaningCondition } from "@/lib/pricing";

const JOB_TYPES: { id: CleaningJobType; label: string }[] = [
  { id: "one-time", label: "One-time" },
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Biweekly" },
  { id: "monthly", label: "Monthly" },
];

const CONDITIONS: { id: CleaningCondition; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "standard", label: "Standard" },
  { id: "heavy", label: "Heavy" },
];

export function CleaningForm({
  inputs,
  onChange,
}: {
  inputs: CleaningInputs;
  onChange: (next: CleaningInputs) => void;
}) {
  function patch(p: Partial<CleaningInputs>) {
    onChange({ ...inputs, ...p });
  }

  return (
    <div className="card p-5 space-y-4">
      <h2 className="font-display text-lg font-bold text-ink">Cleaning job</h2>

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
          <span className="label">Square feet (primary)</span>
          <input
            className="input"
            type="number"
            min={0}
            value={inputs.sqFt || ""}
            placeholder="e.g. 1200"
            onChange={(e) => patch({ sqFt: Number(e.target.value) || 0, useRoomsForHours: false })}
          />
        </label>
        <label className="block">
          <span className="label">Rooms (optional)</span>
          <input
            className="input"
            type="number"
            min={0}
            value={inputs.rooms || ""}
            placeholder="e.g. 5"
            onChange={(e) => {
              const rooms = Number(e.target.value) || 0;
              patch({ rooms, useRoomsForHours: rooms > 0 && inputs.sqFt <= 0 });
            }}
          />
        </label>
      </div>

      <label className="flex items-start gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          className="mt-1"
          checked={inputs.useRoomsForHours}
          onChange={(e) => patch({ useRoomsForHours: e.target.checked })}
        />
        <span>Estimate hours from rooms instead of sq ft (~200 sq ft/room)</span>
      </label>

      <fieldset>
        <legend className="label">Condition</legend>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={
                "btn text-xs " +
                (inputs.condition === c.id ? "btn-primary" : "btn-secondary")
              }
              onClick={() => patch({ condition: c.id })}
            >
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
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
        <label className="block">
          <span className="label">Hours override (0 = auto)</span>
          <input
            className="input"
            type="number"
            min={0}
            step="0.25"
            value={inputs.hoursOverride || ""}
            placeholder="Auto from sq ft"
            onChange={(e) => patch({ hoursOverride: Number(e.target.value) || 0 })}
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="label">Supplies mode</span>
          <select
            className="input"
            value={inputs.suppliesMode}
            onChange={(e) =>
              patch({ suppliesMode: e.target.value as CleaningInputs["suppliesMode"] })
            }
          >
            <option value="percent">% of labor</option>
            <option value="fixed">Fixed $</option>
          </select>
        </label>
        <label className="block">
          <span className="label">
            {inputs.suppliesMode === "percent" ? "Supplies %" : "Supplies $"}
          </span>
          <input
            className="input"
            type="number"
            min={0}
            step="any"
            value={inputs.suppliesValue}
            onChange={(e) => patch({ suppliesValue: Number(e.target.value) || 0 })}
          />
        </label>
      </div>
    </div>
  );
}
