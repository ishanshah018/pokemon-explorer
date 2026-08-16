"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PokemonListItem, PokemonType } from "@/types/pokemon";
import { PokemonGrid } from "./PokemonGrid";
import { LoadMoreButton } from "../controls/LoadMoreButton";
import { fetchMorePokemon } from "@/lib/pokemon/actions";
import { AlertCircle, RefreshCw } from "lucide-react";

interface PokemonListContainerProps {
  initialItems: PokemonListItem[];
  initialTotal: number;
  initialHasMore: boolean;
  search: string;
  type: PokemonType | "";
}

export function PokemonListContainer({
  initialItems,
  initialTotal,
  initialHasMore,
  search,
  type,
}: PokemonListContainerProps) {
  const [items, setItems] = useState<PokemonListItem[]>(initialItems);
  const [total, setTotal] = useState<number>(initialTotal);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [offset, setOffset] = useState<number>(initialItems.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const activeSort = searchParams.get("sort") || "id";

  const loadNextBatch = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchMorePokemon({
        search,
        type,
        offset,
        limit: 20,
      });

      if (response.items.length > 0) {
        setItems((prev) => [...prev, ...response.items]);
        setOffset((prev) => prev + response.items.length);
      }
      setTotal(response.total);
      setHasMore(response.hasMore);
    } catch {
      setError("Failed to fetch the next batch of Pokemon. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Sort items on render dynamically
  const sortedItems = [...items].sort((a, b) => {
    switch (activeSort) {
      case "name":
        return a.name.localeCompare(b.name);
      case "attack": {
        const valA = a.stats?.find((s) => s.name === "attack")?.base || 0;
        const valB = b.stats?.find((s) => s.name === "attack")?.base || 0;
        return valB - valA;
      }
      case "speed": {
        const valA = a.stats?.find((s) => s.name === "speed")?.base || 0;
        const valB = b.stats?.find((s) => s.name === "speed")?.base || 0;
        return valB - valA;
      }
      case "hp": {
        const valA = a.stats?.find((s) => s.name === "hp")?.base || 0;
        const valB = b.stats?.find((s) => s.name === "hp")?.base || 0;
        return valB - valA;
      }
      case "id":
      default:
        return a.id - b.id;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
        <span>
          Showing {items.length} of {total} Pokemon
        </span>
      </div>

      <PokemonGrid items={sortedItems} />

      {error && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 text-center sm:text-left mt-4 animate-fade-in">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadNextBatch}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 shrink-0 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {hasMore && !error && (
        <LoadMoreButton
          onLoadMore={loadNextBatch}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
    </div>
  );
}
