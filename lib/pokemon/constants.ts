import { PokemonType } from "@/types/pokemon";

export const PAGE_SIZE = 20;
export const MAX_STAT_BASE = 255;

export interface TypeTheme {
  bg: string;
  text: string;
  ring: string;
  border: string;
  lightBg: string;
}

export const TYPE_COLORS: Record<PokemonType, TypeTheme> = {
  normal: {
    bg: "bg-amber-700/80",
    text: "text-amber-100",
    ring: "ring-amber-500/50",
    border: "border-amber-400/40",
    lightBg: "bg-amber-50 dark:bg-amber-950/20",
  },
  fire: {
    bg: "bg-orange-600",
    text: "text-orange-50",
    ring: "ring-orange-500/50",
    border: "border-orange-400/40",
    lightBg: "bg-orange-50 dark:bg-orange-950/20",
  },
  water: {
    bg: "bg-blue-600",
    text: "text-blue-50",
    ring: "ring-blue-500/50",
    border: "border-blue-400/40",
    lightBg: "bg-blue-50 dark:bg-blue-950/20",
  },
  electric: {
    bg: "bg-yellow-500",
    text: "text-yellow-950",
    ring: "ring-yellow-400/50",
    border: "border-yellow-400/40",
    lightBg: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  grass: {
    bg: "bg-emerald-600",
    text: "text-emerald-50",
    ring: "ring-emerald-500/50",
    border: "border-emerald-400/40",
    lightBg: "bg-emerald-50 dark:bg-emerald-950/20",
  },
  ice: {
    bg: "bg-cyan-500",
    text: "text-cyan-950",
    ring: "ring-cyan-400/50",
    border: "border-cyan-400/40",
    lightBg: "bg-cyan-50 dark:bg-cyan-950/20",
  },
  fighting: {
    bg: "bg-red-700",
    text: "text-red-50",
    ring: "ring-red-500/50",
    border: "border-red-400/40",
    lightBg: "bg-red-50 dark:bg-red-950/20",
  },
  poison: {
    bg: "bg-purple-600",
    text: "text-purple-50",
    ring: "ring-purple-500/50",
    border: "border-purple-400/40",
    lightBg: "bg-purple-50 dark:bg-purple-950/20",
  },
  ground: {
    bg: "bg-amber-600",
    text: "text-amber-50",
    ring: "ring-amber-500/50",
    border: "border-amber-400/40",
    lightBg: "bg-amber-50 dark:bg-amber-950/20",
  },
  flying: {
    bg: "bg-indigo-500",
    text: "text-indigo-50",
    ring: "ring-indigo-400/50",
    border: "border-indigo-400/40",
    lightBg: "bg-indigo-50 dark:bg-indigo-950/20",
  },
  psychic: {
    bg: "bg-pink-600",
    text: "text-pink-50",
    ring: "ring-pink-500/50",
    border: "border-pink-400/40",
    lightBg: "bg-pink-50 dark:bg-pink-950/20",
  },
  bug: {
    bg: "bg-lime-600",
    text: "text-lime-50",
    ring: "ring-lime-500/50",
    border: "border-lime-400/40",
    lightBg: "bg-lime-50 dark:bg-lime-950/20",
  },
  rock: {
    bg: "bg-stone-600",
    text: "text-stone-50",
    ring: "ring-stone-500/50",
    border: "border-stone-400/40",
    lightBg: "bg-stone-50 dark:bg-stone-950/20",
  },
  ghost: {
    bg: "bg-violet-700",
    text: "text-violet-50",
    ring: "ring-violet-500/50",
    border: "border-violet-400/40",
    lightBg: "bg-violet-50 dark:bg-violet-950/20",
  },
  dragon: {
    bg: "bg-sky-700",
    text: "text-sky-50",
    ring: "ring-sky-500/50",
    border: "border-sky-400/40",
    lightBg: "bg-sky-50 dark:bg-sky-950/20",
  },
  dark: {
    bg: "bg-slate-800",
    text: "text-slate-100",
    ring: "ring-slate-600/50",
    border: "border-slate-500/40",
    lightBg: "bg-slate-100 dark:bg-slate-900/40",
  },
  steel: {
    bg: "bg-slate-500",
    text: "text-slate-50",
    ring: "ring-slate-400/50",
    border: "border-slate-400/40",
    lightBg: "bg-slate-50 dark:bg-slate-900/20",
  },
  fairy: {
    bg: "bg-rose-400",
    text: "text-rose-950",
    ring: "ring-rose-400/50",
    border: "border-rose-400/40",
    lightBg: "bg-rose-50 dark:bg-rose-950/20",
  },
};

export const ALL_POKEMON_TYPES: PokemonType[] = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "Sp. ATK",
  "special-defense": "Sp. DEF",
  speed: "SPD",
};
