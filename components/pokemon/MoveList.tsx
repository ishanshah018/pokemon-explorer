import { Move } from "@/types/pokemon";
import { capitalize } from "@/lib/utils";

interface MoveListProps {
  moves: Move[];
}

export function MoveList({ moves }: MoveListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
        Moves ({moves.length})
      </h3>
      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
        {moves.map((move) => (
          <span
            key={move.name}
            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/40"
          >
            {capitalize(move.name)}
          </span>
        ))}
      </div>
    </div>
  );
}
