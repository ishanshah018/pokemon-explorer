import {
  Ability,
  Move,
  Pokemon,
  PokemonListItem,
  PokemonType,
  Stat,
} from "@/types/pokemon";

interface RawTypeEntry {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface RawStatEntry {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface RawAbilityEntry {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

interface RawMoveEntry {
  move: {
    name: string;
    url: string;
  };
}

export interface RawPokemonResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default?: string | null;
      };
      home?: {
        front_default?: string | null;
      };
    };
  };
  types: RawTypeEntry[];
  stats: RawStatEntry[];
  abilities: RawAbilityEntry[];
  moves: RawMoveEntry[];
}

export function transformToPokemonListItem(
  raw: RawPokemonResponse
): PokemonListItem {
  const sprite =
    raw.sprites.other?.["official-artwork"]?.front_default ||
    raw.sprites.front_default ||
    "/placeholder-pokemon.png";

  const types = raw.types.map((t) => t.type.name as PokemonType);

  const stats: Stat[] = raw.stats.map((s) => ({
    name: s.stat.name,
    base: s.base_stat,
  }));

  return {
    id: raw.id,
    name: raw.name,
    types,
    sprite,
    stats,
  };
}

export function transformToPokemon(raw: RawPokemonResponse): Pokemon {
  const listItem = transformToPokemonListItem(raw);

  const artwork =
    raw.sprites.other?.["official-artwork"]?.front_default ||
    raw.sprites.other?.home?.front_default ||
    raw.sprites.front_default ||
    "/placeholder-pokemon.png";

  const abilities: Ability[] = raw.abilities.map((a) => ({
    name: a.ability.name,
    isHidden: a.is_hidden,
  }));

  const moves: Move[] = raw.moves.slice(0, 24).map((m) => ({
    name: m.move.name,
  }));

  return {
    ...listItem,
    stats: listItem.stats || [],
    artwork,
    height: raw.height,
    weight: raw.weight,
    abilities,
    moves,
  };
}
