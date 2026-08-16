export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export interface Stat {
  name: string;
  base: number;
}

export interface Ability {
  name: string;
  isHidden: boolean;
}

export interface Move {
  name: string;
}

export interface PokemonListItem {
  id: number;
  name: string;
  types: PokemonType[];
  sprite: string;
  stats?: Stat[];
}

export interface Pokemon extends PokemonListItem {
  artwork: string;
  height: number;
  weight: number;
  stats: Stat[];
  abilities: Ability[];
  moves: Move[];
}

export type ApiError =
  | { kind: "not-found"; message: string }
  | { kind: "network"; message: string }
  | { kind: "unknown"; status?: number; message: string };
