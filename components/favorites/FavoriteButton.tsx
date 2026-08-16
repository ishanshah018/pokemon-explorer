"use client";

import { useFavoritesStore } from "@/lib/store/favorites-store";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  id: number;
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({
  id,
  className,
  size = "sm",
}: FavoriteButtonProps) {
  const mounted = useIsMounted();
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const isFav = mounted && favorites.includes(id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <div className="relative inline-flex group/fav">
      <button
        type="button"
        onClick={handleClick}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        className={cn(
          "rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer",
          isFav
            ? "bg-rose-50 dark:bg-rose-950/40 text-rose-500 hover:scale-110"
            : "bg-white/80 dark:bg-zinc-800/80 text-zinc-400 hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-800",
          className
        )}
      >
        <Heart
          className={cn(
            "transition-all duration-200",
            size === "sm" ? "w-4 h-4" : "w-5 h-5",
            isFav ? "fill-rose-500 text-rose-500 scale-105" : "fill-none"
          )}
        />
      </button>

      {/* Tooltip */}
      <span className="pointer-events-none absolute top-full right-0 mt-2 whitespace-nowrap rounded-lg bg-zinc-950 dark:bg-zinc-850 text-[10px] font-extrabold text-white px-2.5 py-1 opacity-0 group-hover/fav:opacity-100 transition-opacity duration-200 shadow-md border border-zinc-800/80 dark:border-zinc-750 z-30">
        {isFav ? "Remove Favorite" : "Favorite"}
      </span>
    </div>
  );
}
