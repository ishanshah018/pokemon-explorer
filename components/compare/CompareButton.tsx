"use client";

import { useCompareStore, CompareItem } from "@/lib/store/compare-store";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompareButtonProps {
  id: number;
  name: string;
  sprite: string;
  className?: string;
  size?: "sm" | "md";
}

export function CompareButton({
  id,
  name,
  sprite,
  className,
  size = "sm",
}: CompareButtonProps) {
  const mounted = useIsMounted();
  const selected = useCompareStore((state) => state.selected);
  const toggleCompare = useCompareStore((state) => state.toggleCompare);

  const isSelected = mounted && selected.some((x) => x.id === id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const item: CompareItem = { id, name, sprite };
    toggleCompare(item);
  };

  return (
    <div className="relative inline-flex group/comp">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isSelected ? "Remove from comparison" : "Add to comparison"}
        className={cn(
          "rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer",
          isSelected
            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-500 hover:scale-110"
            : "bg-white/80 dark:bg-zinc-800/80 text-zinc-400 hover:text-blue-500 hover:bg-white dark:hover:bg-zinc-800",
          className
        )}
      >
        <ArrowLeftRight
          className={cn(
            "transition-all duration-200",
            size === "sm" ? "w-4 h-4" : "w-5 h-5",
            isSelected ? "scale-105" : "fill-none"
          )}
        />
      </button>

      {/* Tooltip */}
      <span className="pointer-events-none absolute top-full right-0 mt-2 whitespace-nowrap rounded-lg bg-zinc-950 dark:bg-zinc-850 text-[10px] font-extrabold text-white px-2.5 py-1 opacity-0 group-hover/comp:opacity-100 transition-opacity duration-200 shadow-md border border-zinc-800/80 dark:border-zinc-750 z-30">
        {isSelected ? "Remove Compare" : "Compare"}
      </span>
    </div>
  );
}
