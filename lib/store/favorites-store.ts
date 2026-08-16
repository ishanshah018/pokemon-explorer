import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (id: number) => {
        const current = get().favorites;
        // Normalize any legacy object items to numbers to prevent runtime type errors
        const normalized = current
          .map((x) =>
            typeof x === "number"
              ? x
              : x && typeof x === "object" && "id" in x
              ? (x as { id: number }).id
              : null
          )
          .filter((x): x is number => x !== null);

        if (normalized.includes(id)) {
          set({ favorites: normalized.filter((favId) => favId !== id) });
        } else {
          set({ favorites: [...normalized, id] });
        }
      },
      isFavorite: (id: number) => {
        const current = get().favorites;
        return current.some((x) =>
          typeof x === "number"
            ? x === id
            : x && typeof x === "object" && "id" in x
            ? (x as { id: number }).id === id
            : false
        );
      },
    }),
    {
      name: "poke-explorer-favorites",
    }
  )
);
