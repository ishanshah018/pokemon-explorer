import { Ability } from "@/types/pokemon";
import { capitalize } from "@/lib/utils";
import { EyeOff } from "lucide-react";

interface AbilityListProps {
  abilities: Ability[];
}

export function AbilityList({ abilities }: AbilityListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
        Abilities
      </h3>
      <div className="flex flex-wrap gap-2">
        {abilities.map((ability) => (
          <span
            key={ability.name}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${
              ability.isHidden
                ? "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50"
                : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700/60"
            }`}
          >
            {capitalize(ability.name)}
            {ability.isHidden && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-normal opacity-80" title="Hidden Ability">
                <EyeOff className="w-3 h-3" />
                (Hidden)
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
