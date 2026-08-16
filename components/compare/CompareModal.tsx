"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getPokemonDetailsForCompare } from "@/lib/pokemon/actions";
import { Pokemon } from "@/types/pokemon";
import { STAT_LABELS } from "@/lib/pokemon/constants";
import { capitalize, formatPokemonId } from "@/lib/utils";
import { Loader2, X, Trophy } from "lucide-react";
import { PokemonImage } from "../pokemon/PokemonImage";
import { TypeBadge } from "../pokemon/TypeBadge";

interface CompareModalProps {
  ids: number[];
  onClose: () => void;
}

export function CompareModal({ ids, onClose }: CompareModalProps) {
  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetails() {
      try {
        const data = await getPokemonDetailsForCompare(ids);
        setPokemonList(data as Pokemon[]);
      } catch {
        setError("Failed to load details for comparison. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [ids]);

  if (loading) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Comparing stats...
          </span>
        </div>
      </div>,
      document.body
    );
  }

  if (error || pokemonList.length < 2) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-sm text-center space-y-4">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {error || "An error occurred during comparison."}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>,
      document.body
    );
  }

  const [poke1, poke2] = pokemonList;

  // Retrieve stat value helper
  const getStatVal = (poke: Pokemon, statName: string) => {
    return poke.stats.find((s) => s.name === statName)?.base || 0;
  };

  const statNames = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-8 flex flex-col justify-between shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">
          <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
            Stats Comparison
          </h2>
          <button
            onClick={onClose}
            aria-label="Close comparison modal"
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6">
          {/* Header Row: Avatars & Names */}
          <div className="grid grid-cols-3 gap-2 items-center text-center pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
            {/* Pokemon 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl p-2 border border-zinc-100 dark:border-zinc-800">
                <PokemonImage src={poke1.artwork} alt={poke1.name} />
              </div>
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-semibold mt-2">
                {formatPokemonId(poke1.id)}
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 tracking-tight truncate w-full">
                {capitalize(poke1.name)}
              </h3>
              <div className="flex justify-center gap-1 mt-1 flex-wrap">
                {poke1.types.slice(0, 1).map((type) => (
                  <TypeBadge key={type} type={type} size="sm" />
                ))}
              </div>
            </div>

            {/* VS Middle Badge */}
            <div className="flex justify-center">
              <span className="px-3 py-1.5 rounded-full text-xs font-black bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 tracking-wider">
                VS
              </span>
            </div>

            {/* Pokemon 2 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl p-2 border border-zinc-100 dark:border-zinc-800">
                <PokemonImage src={poke2.artwork} alt={poke2.name} />
              </div>
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-semibold mt-2">
                {formatPokemonId(poke2.id)}
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 tracking-tight truncate w-full">
                {capitalize(poke2.name)}
              </h3>
              <div className="flex justify-center gap-1 mt-1 flex-wrap">
                {poke2.types.slice(0, 1).map((type) => (
                  <TypeBadge key={type} type={type} size="sm" />
                ))}
              </div>
            </div>
          </div>

          {/* Stats Matrix Grid */}
          <div className="space-y-3">
            {statNames.map((statName) => {
              const val1 = getStatVal(poke1, statName);
              const val2 = getStatVal(poke2, statName);
              const label = STAT_LABELS[statName] || statName.toUpperCase();

              const poke1Wins = val1 > val2;
              const poke2Wins = val2 > val1;

              return (
                <div
                  key={statName}
                  className="grid grid-cols-3 gap-2 items-center text-center p-2 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800/50"
                >
                  {/* Stat Value 1 */}
                  <div className="flex items-center justify-center gap-1 font-mono">
                    <span
                      className={`text-sm font-bold ${
                        poke1Wins
                          ? "text-emerald-600 dark:text-emerald-400"
                          : poke2Wins
                          ? "text-zinc-400 dark:text-zinc-500"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {val1}
                    </span>
                    {poke1Wins && (
                      <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>

                  {/* Stat Name */}
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {label}
                  </span>

                  {/* Stat Value 2 */}
                  <div className="flex items-center justify-center gap-1 font-mono">
                    {poke2Wins && (
                      <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                    <span
                      className={`text-sm font-bold ${
                        poke2Wins
                          ? "text-emerald-600 dark:text-emerald-400"
                          : poke1Wins
                          ? "text-zinc-400 dark:text-zinc-500"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {val2}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer shadow-xs"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
