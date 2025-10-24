import { useState, useMemo } from "react";

type SortConfig<T> = {
  key: keyof T;
  direction: "asc" | "desc";
};

export function useSortData<T>(items: T[], initialSortKey?: keyof T) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    initialSortKey ? { key: initialSortKey, direction: "asc" } : null
  );

  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;

    const sorted = [...items].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return aValue - bValue;
      }

      return 0;
    });

    if (sortConfig.direction === "desc") sorted.reverse();
    return sorted;
  }, [items, sortConfig]);

  const requestSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  return { items: sortedItems, requestSort, sortConfig };
}
