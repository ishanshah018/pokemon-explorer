import Link from "next/link";
import { PokemonListItem } from "@/types/pokemon";
import { TYPE_COLORS } from "@/lib/pokemon/constants";
import { capitalize, formatPokemonId } from "@/lib/utils";
import { TypeBadge } from "./TypeBadge";
import { PokemonImage } from "./PokemonImage";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { CompareButton } from "@/components/compare/CompareButton";

interface PokemonCardProps {
  pokemon: PokemonListItem;
  priority?: boolean;
}

export function PokemonCard({ pokemon, priority = false }: PokemonCardProps) {
  const primaryType = pokemon.types[0] || "normal";
  const typeTheme = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;

  return (
    <Link
      href={`/pokemon/${pokemon.name}`}
      className="group relative flex flex-col justify-between rounded-2xl p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50 overflow-hidden"
    >
      {/* Background Soft Type Tint */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-8 -mt-8 opacity-20 dark:opacity-10 blur-xl pointer-events-none transition-opacity group-hover:opacity-30 ${typeTheme.bg}`}
      />

      {/* Card Header: ID & Action Buttons */}
      <div className="flex items-center justify-between z-20">
        <span className="text-xs font-mono font-semibold text-zinc-400 dark:text-zinc-500">
          {formatPokemonId(pokemon.id)}
        </span>
        <div className="flex items-center gap-1">
          <CompareButton id={pokemon.id} name={pokemon.name} sprite={pokemon.sprite} />
          <FavoriteButton id={pokemon.id} />
        </div>
      </div>

      {/* Artwork */}
      <div className="my-3 z-10 group-hover:scale-105 transition-transform duration-300">
        <PokemonImage
          src={pokemon.sprite}
          alt={`${capitalize(pokemon.name)} artwork`}
          priority={priority}
        />
      </div>

      {/* Footer Details: Name and Type Badges */}
      <div className="mt-auto pt-2 z-10 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-col gap-2">
        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
          {capitalize(pokemon.name)}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} size="sm" />
          ))}
        </div>
      </div>
    </Link>
  );
}
