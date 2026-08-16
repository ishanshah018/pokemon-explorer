import { Pokemon, PokemonListItem, PokemonType } from "@/types/pokemon";
import { fetchJson } from "./client";
import {
  RawPokemonResponse,
  transformToPokemon,
  transformToPokemonListItem,
} from "./transform";

interface RawApiListResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

interface RawTypeResponse {
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }>;
}

export interface PokemonListResponse {
  items: PokemonListItem[];
  total: number;
  hasMore: boolean;
}

export async function getPokemonList({
  limit = 20,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}): Promise<PokemonListResponse> {
  const listData = await fetchJson<RawApiListResult>(
    `/pokemon?limit=${limit}&offset=${offset}`
  );

  const detailPromises = listData.results.map((item) =>
    fetchJson<RawPokemonResponse>(`/pokemon/${item.name}`)
  );

  const rawDetails = await Promise.all(detailPromises);
  const items = rawDetails.map(transformToPokemonListItem);

  return {
    items,
    total: listData.count,
    hasMore: offset + limit < listData.count,
  };
}

export async function getPokemonByName(nameOrId: string | number): Promise<Pokemon> {
  const normalized = String(nameOrId).trim().toLowerCase();
  const raw = await fetchJson<RawPokemonResponse>(`/pokemon/${normalized}`);
  return transformToPokemon(raw);
}

export async function getPokemonByType(
  type: PokemonType,
  limit = 20,
  offset = 0
): Promise<PokemonListResponse> {
  const typeData = await fetchJson<RawTypeResponse>(`/type/${type}`);
  const total = typeData.pokemon.length;
  const sliced = typeData.pokemon.slice(offset, offset + limit);

  const detailPromises = sliced.map((entry) =>
    fetchJson<RawPokemonResponse>(`/pokemon/${entry.pokemon.name}`)
  );

  const rawDetails = await Promise.all(detailPromises);
  const items = rawDetails.map(transformToPokemonListItem);

  return {
    items,
    total,
    hasMore: offset + limit < total,
  };
}

export interface NameIndexItem {
  id: number;
  name: string;
}

export async function getAllPokemonNames(): Promise<NameIndexItem[]> {
  const listData = await fetchJson<RawApiListResult>(
    "/pokemon?limit=1300",
    86400
  );

  return listData.results.map((item) => {
    const segments = item.url.split("/").filter(Boolean);
    const id = parseInt(segments[segments.length - 1], 10) || 0;
    return { id, name: item.name };
  });
}
