"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ALL_POKEMON_TYPES, TYPE_COLORS } from "@/lib/pokemon/constants";
import { PokemonType } from "@/types/pokemon";
import { capitalize, cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function TypeFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = (searchParams.get("type") || "") as PokemonType | "";
  const [, startTransition] = useTransition();

  const handleTypeSelect = (type: PokemonType | "") => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("limit");
    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="w-full overflow-x-auto py-1 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {/* 'All' button */}
        <button
          onClick={() => handleTypeSelect("")}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer",
            !currentType
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
              : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          )}
        >
          {!currentType && <Check className="w-3 h-3" />}
          All Types
        </button>

        {/* 18 Type Pills */}
        {ALL_POKEMON_TYPES.map((type) => {
          const isActive = currentType === type;
          const theme = TYPE_COLORS[type];

          return (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer",
                isActive
                  ? `${theme.bg} ${theme.text} shadow-xs ring-2 ${theme.ring}`
                  : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {isActive && <Check className="w-3 h-3" />}
              {capitalize(type)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
