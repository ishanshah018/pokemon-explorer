"use server";

import {
  getPokemonByName,
  getPokemonByType,
  getPokemonList,
  getAllPokemonNames,
  PokemonListResponse,
} from "./queries";
import { fetchJson } from "./client";
import { PokemonType, Pokemon } from "@/types/pokemon";

interface FetchMoreParams {
  search?: string;
  type?: PokemonType | "";
  offset: number;
  limit?: number;
}

export async function fetchMorePokemon({
  search = "",
  type = "",
  offset,
  limit = 20,
}: FetchMoreParams): Promise<PokemonListResponse> {
  const searchTerm = search.trim();
  const activeType = type;

  if (searchTerm) {
    try {
      // Direct name check first (if offset is 0, we might match single exact)
      if (offset === 0) {
        try {
          const singlePokemon = await getPokemonByName(searchTerm);
          if (!activeType || singlePokemon.types.includes(activeType)) {
            return {
              items: [singlePokemon],
              total: 1,
              hasMore: false,
            };
          }
        } catch {
          // Fall through to substring index search
        }
      }

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
        const slicedMatches = matches.slice(offset, offset + limit);
        const detailPromises = slicedMatches.map((name) => getPokemonByName(name));
        const items = await Promise.all(detailPromises);

        return {
          items,
          total: matches.length,
          hasMore: offset + limit < matches.length,
        };
      }
      return { items: [], total: 0, hasMore: false };
    } catch {
      return { items: [], total: 0, hasMore: false };
    }
  } else if (activeType) {
    return getPokemonByType(activeType, limit, offset);
  } else {
    return getPokemonList({ limit, offset });
  }
}

export async function getPokemonDetailsForCompare(
  ids: number[]
): Promise<Pokemon[]> {
  const detailPromises = ids.map((id) => getPokemonByName(id));
  return Promise.all(detailPromises);
}

