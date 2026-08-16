"use client";

import { motion } from "motion/react";
import { STAT_LABELS, MAX_STAT_BASE } from "@/lib/pokemon/constants";
import { Stat } from "@/types/pokemon";

interface StatBarProps {
  stat: Stat;
  index: number;
}

export function StatBar({ stat, index }: StatBarProps) {
  const percentage = Math.min(100, Math.max(4, (stat.base / MAX_STAT_BASE) * 100));
  const label = STAT_LABELS[stat.name] || stat.name.toUpperCase();

  let barColor = "bg-amber-500 dark:bg-amber-400";
  if (stat.base >= 90) {
    barColor = "bg-emerald-500 dark:bg-emerald-400";
  } else if (stat.base < 50) {
    barColor = "bg-rose-500 dark:bg-rose-400";
  }

  return (
    <div className="flex items-center gap-3 text-sm font-medium">
      <span className="w-16 text-xs text-zinc-500 dark:text-zinc-400 font-mono tracking-tight shrink-0">
        {label}
      </span>

      <span className="w-8 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
        {stat.base}
      </span>

      <div className="flex-1 h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.6,
            delay: index * 0.05,
            ease: "easeOut",
          }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
    </div>
  );
}
