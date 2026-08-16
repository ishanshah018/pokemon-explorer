"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

export function SortSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSort = searchParams.get("sort") || "id";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;

    if (val === "id") {
      params.delete("sort");
    } else {
      params.set("sort", val);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-3 text-zinc-400 dark:text-zinc-500 pointer-events-none">
        <ArrowUpDown className="w-4 h-4" />
      </div>
      <select
        value={activeSort}
        onChange={handleSortChange}
        aria-label="Sort Pokemon list"
        className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/50 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all appearance-none cursor-pointer"
      >
        <option value="id">ID (Lowest first)</option>
        <option value="name">Name (A to Z)</option>
        <option value="attack">Attack (Highest first)</option>
        <option value="speed">Speed (Highest first)</option>
        <option value="hp">HP (Highest first)</option>
      </select>
      <div className="absolute right-3 text-zinc-400 dark:text-zinc-500 pointer-events-none">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
