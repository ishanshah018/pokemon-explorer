import { Stat } from "@/types/pokemon";
import { StatBar } from "./StatBar";

interface StatBlockProps {
  stats: Stat[];
}

export function StatBlock({ stats }: StatBlockProps) {
  const totalStats = stats.reduce((acc, s) => acc + s.base, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-2">
        <h3 className="text-sm font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
          Base Stats
        </h3>
        <span className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
          Total: <strong className="text-zinc-900 dark:text-zinc-100">{totalStats}</strong>
        </span>
      </div>

      <div className="space-y-2.5">
        {stats.map((stat, idx) => (
          <StatBar key={stat.name} stat={stat} index={idx} />
        ))}
      </div>
    </div>
  );
}
