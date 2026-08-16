import {
  getPokemonByName,
  getPokemonByType,
  getPokemonList,
  getAllPokemonNames,
} from "@/lib/pokemon/queries";
import { fetchJson } from "@/lib/pokemon/client";
import { PokemonType } from "@/types/pokemon";
import { SearchBar } from "@/components/controls/SearchBar";
import { TypeFilterBar } from "@/components/controls/TypeFilterBar";
import { SortSelector } from "@/components/controls/SortSelector";
import { PokemonListContainer } from "@/components/pokemon/PokemonListContainer";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PokemonListItem } from "@/types/pokemon";

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    type?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const searchTerm = (params.search || "").trim();
  const activeType = (params.type || "") as PokemonType | "";
  const initialLimit = 20;

  let items: PokemonListItem[] = [];
  let total = 0;
  let hasMore = false;
  let searchError = false;

  if (searchTerm) {
    // 1. Search Query Handling
    try {
      // First attempt exact or direct fetch
      const singlePokemon = await getPokemonByName(searchTerm);
      if (!activeType || singlePokemon.types.includes(activeType)) {
        items = [singlePokemon];
        total = 1;
        hasMore = false;
      }
    } catch {
      // If direct fetch 404s, try matching against full cached name catalog
      try {
        let matches: string[] = [];

        if (activeType) {
          // Fetch all Pokemon of the active type first, then filter by search query on client
          const typeData = await fetchJson<{ pokemon: Array<{ pokemon: { name: string } }> }>(
            `/type/${activeType}`
          );
          matches = typeData.pokemon
            .map((entry) => entry.pokemon.name)
            .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()));
        } else {
          // Filter by search query against all Pokemon names
          const allNames = await getAllPokemonNames();
          matches = allNames
            .map((item) => item.name)
            .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (matches.length > 0) {
          const slicedMatches = matches.slice(0, initialLimit);
          const detailPromises = slicedMatches.map((name) => getPokemonByName(name));
          items = await Promise.all(detailPromises);
          total = matches.length;
          hasMore = initialLimit < matches.length;
        } else {
          searchError = true;
        }
      } catch {
        searchError = true;
      }
    }
  } else if (activeType) {
    // 2. Type Filter Handling
    const typeResponse = await getPokemonByType(activeType, initialLimit, 0);
    items = typeResponse.items;
    total = typeResponse.total;
    hasMore = typeResponse.hasMore;
  } else {
    // 3. Default Paginated List
    const listResponse = await getPokemonList({
      limit: initialLimit,
      offset: 0,
    });
    items = listResponse.items;
    total = listResponse.total;
    hasMore = listResponse.hasMore;
  }

  const containerKey = `${activeType}-${searchTerm}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <section className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Discover Pokemon
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Search for your favorite Pokemon, filter by type, and view detailed stats.
        </p>
      </section>

      {/* Controls: SearchBar, TypeFilterBar, and SortSelector */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div className="w-full md:max-w-xs">
          <SearchBar />
        </div>
        <div className="flex-1 min-w-0">
          <TypeFilterBar />
        </div>
        <div className="w-full md:w-48 shrink-0">
          <SortSelector />
        </div>
      </div>

      {/* Grid or Empty State */}
      {items.length > 0 ? (
        <PokemonListContainer
          key={containerKey}
          initialItems={items}
          initialTotal={total}
          initialHasMore={hasMore}
          search={searchTerm}
          type={activeType}
        />
      ) : (
        <EmptyState
          title={
            searchError || searchTerm
              ? `No Pokemon found matching "${searchTerm}"`
              : "No Pokemon match this filter"
          }
          message="Try checking the spelling, searching for a different name/ID, or resetting the type filter."
        />
      )}
    </div>
  );
}
