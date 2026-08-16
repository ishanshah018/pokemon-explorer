"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";
import { formatPokemonId } from "@/lib/utils";
import { Heart, X } from "lucide-react";

export function FavoritesDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useIsMounted();
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const count = mounted ? favorites.length : 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label={`View ${count} favorited Pokemon`}
        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer"
      >
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
        <span className="hidden sm:inline">Saved</span>
        {count > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
            {count}
          </span>
        )}
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
          {/* Overlay backdrop to close drawer on click */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-sm h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    Favorites ({count})
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close favorites panel"
                  className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {count === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    No favorite Pokemon saved yet.
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Click the heart icon on any card to save your favorite Pokemon here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
                  {favorites.map((fav) => {
                    const id =
                      typeof fav === "number"
                        ? fav
                        : fav && typeof fav === "object" && "id" in fav
                        ? (fav as { id: number }).id
                        : null;

                    if (id === null) return null;

                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50"
                      >
                        <Link
                          href={`/pokemon/${id}`}
                          onClick={() => setIsOpen(false)}
                          className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Pokemon {formatPokemonId(id)}
                        </Link>

                        <button
                          onClick={() => toggleFavorite(id)}
                          aria-label={`Remove Pokemon ${id} from favorites`}
                          className="p-1 text-zinc-400 hover:text-rose-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Favorites automatically persist in local storage.
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
