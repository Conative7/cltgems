"use client";

import { ShieldAlert, Trash2 } from "lucide-react";

export function SessionWipe({
  wipeConfirm,
  setWipeConfirm,
  onWipe,
  onReset,
}: {
  wipeConfirm: boolean;
  setWipeConfirm: (v: boolean) => void;
  onWipe: () => void;
  onReset: () => void;
}) {
  return (
    <div className="card border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-amber-900">Public / library PC safety</h3>
          <p className="mt-1 text-xs text-amber-800 leading-relaxed">
            Your draft stays in this browser only (localStorage). Before you leave a shared computer,
            clear the session so the next person cannot see your invoice.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary text-xs" onClick={onReset}>
              Clear draft fields
            </button>
            {!wipeConfirm ? (
              <button
                type="button"
                className="btn btn-danger text-xs"
                onClick={() => setWipeConfirm(true)}
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear session / wipe data
              </button>
            ) : (
              <>
                <button type="button" className="btn btn-danger text-xs" onClick={onWipe}>
                  Confirm wipe all local data
                </button>
                <button
                  type="button"
                  className="btn btn-secondary text-xs"
                  onClick={() => setWipeConfirm(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
