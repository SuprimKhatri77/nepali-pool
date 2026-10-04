"use client";

import { cn } from "@/components/lib/utils";

// Pill buttons for a table's status filter, each with its count once known.
export function FilterTabs<T extends string>({
  label,
  options,
  value,
  counts,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  counts?: Partial<Record<T, number>>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => {
        const active = option.value === value;
        const n = counts?.[option.value];
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300",
            )}
          >
            {option.label}
            {n !== undefined && (
              <span className={active ? "text-emerald-100" : "text-gray-400"}>
                {" "}
                {n}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
