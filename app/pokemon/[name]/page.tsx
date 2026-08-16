import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPokemonByName } from "@/lib/pokemon/queries";
import { TYPE_COLORS } from "@/lib/pokemon/constants";
import { capitalize, formatPokemonId } from "@/lib/utils";
import { PokemonImage } from "@/components/pokemon/PokemonImage";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { StatBlock } from "@/components/pokemon/StatBlock";
import { AbilityList } from "@/components/pokemon/AbilityList";
import { MoveList } from "@/components/pokemon/MoveList";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { CompareButton } from "@/components/compare/CompareButton";
import { ArrowLeft } from "lucide-react";

interface DetailsPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({
  params,
}: DetailsPageProps): Promise<Metadata> {
  const { name } = await params;

  try {
    const pokemon = await getPokemonByName(name);
    const typesStr = pokemon.types.map(capitalize).join(", ");
    return {
      title: `${capitalize(pokemon.name)} (${formatPokemonId(
        pokemon.id
      )}) | Pokemon Explorer`,
      description: `${capitalize(
        pokemon.name
      )} is a ${typesStr} type Pokemon. View base stats, abilities, weight, height, and moves list.`,
      openGraph: {
        title: `${capitalize(pokemon.name)}, Pokemon Details`,
        description: `${typesStr} type Pokemon with base stats and abilities.`,
        images: [{ url: pokemon.artwork }],
      },
    };
  } catch {
    return {
      title: "Pokemon Not Found | Pokemon Explorer",
    };
  }
}

export default async function PokemonDetailsPage({ params }: DetailsPageProps) {
  const { name } = await params;

  let pokemon;
  try {
    pokemon = await getPokemonByName(name);
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "kind" in err &&
      (err as { kind: string }).kind === "not-found"
    ) {
      notFound();
    }
    throw err;
  }

  const primaryType = pokemon.types[0] || "normal";
  const theme = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      {/* Main details card container */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 lg:p-10 shadow-sm">
        {/* Soft type backdrop glow */}
        <div
          className={`absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-25 dark:opacity-15 blur-3xl pointer-events-none ${theme.bg}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image and Physical Attributes */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div className="w-full max-w-[340px] aspect-square flex items-center justify-center">
              <PokemonImage
                src={pokemon.artwork}
                alt={`${capitalize(pokemon.name)} official artwork`}
                priority
                className="w-full h-full"
              />
            </div>

            {/* Height & Weight specs */}
            <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-700/60 text-center">
              <div className="p-2 rounded-xl bg-white dark:bg-zinc-900/60">
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase block">
                  Height
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {(pokemon.height / 10).toFixed(1)} m
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-zinc-900/60">
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase block">
                  Weight
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {(pokemon.weight / 10).toFixed(1)} kg
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Name, Types, Stats, Abilities, Moves */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                  {formatPokemonId(pokemon.id)}
                </span>
                <div className="flex items-center gap-1.5">
                  <CompareButton id={pokemon.id} name={pokemon.name} sprite={pokemon.sprite} size="md" />
                  <FavoriteButton id={pokemon.id} size="md" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                {capitalize(pokemon.name)}
              </h1>
              <div className="flex flex-wrap gap-2 pt-1">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} size="md" />
                ))}
              </div>
            </div>

            {/* Stats Block */}
            <StatBlock stats={pokemon.stats} />

            {/* Abilities */}
            <AbilityList abilities={pokemon.abilities} />

            {/* Moves */}
            {pokemon.moves.length > 0 && <MoveList moves={pokemon.moves} />}
          </div>
        </div>
      </div>
    </div>
  );
}
