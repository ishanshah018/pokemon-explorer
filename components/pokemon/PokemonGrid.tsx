import { PokemonListItem } from "@/types/pokemon";
import { PokemonCard } from "./PokemonCard";

interface PokemonGridProps {
  items: PokemonListItem[];
}

export function PokemonGrid({ items }: PokemonGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
      {items.map((pokemon, index) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          priority={index < 8}
        />
      ))}
    </div>
  );
}
