"use client";

import { useEffect, useState } from "react";

type Props = {
  value: number;
  onChange: (n: number) => void;
  className?: string;
  min?: number;
  step?: string;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  placeholder?: string;
};

/** Controlled decimal field that allows empty / partial typing (fixes stuck-at-0 number inputs). */
export function DecimalInput({
  value,
  onChange,
  className = "input",
  min = 0,
  disabled,
  id,
  placeholder = "0",
  ...rest
}: Props) {
  const [text, setText] = useState(() => (value === 0 ? "" : String(value)));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (focused) return;
    setText(value === 0 ? "" : String(value));
  }, [value, focused]);

  function commit(raw: string) {
    const trimmed = raw.trim();
    if (trimmed === "" || trimmed === "." || trimmed === "-") {
      onChange(0);
      return;
    }
    const n = Number(trimmed);
    if (Number.isFinite(n)) {
      const next = min !== undefined && n < min ? min : n;
      onChange(next);
    }
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      aria-label={rest["aria-label"]}
      value={text}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        commit(text);
        const n = Number(text.trim());
        setText(!text.trim() || !Number.isFinite(n) || n === 0 ? "" : String(n));
      }}
      onChange={(e) => {
        const raw = e.target.value;
        // Allow empty, digits, one decimal point, optional leading minus only if min < 0
        const pattern = min < 0 ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;
        if (!pattern.test(raw)) return;
        setText(raw);
        if (raw === "" || raw === "." || raw === "-" || raw === "-.") {
          onChange(0);
          return;
        }
        const n = Number(raw);
        if (Number.isFinite(n)) onChange(n);
      }}
    />
  );
}
