import { create } from "zustand";

export interface CompareItem {
  id: number;
  name: string;
  sprite: string;
}

interface CompareState {
  selected: CompareItem[];
  toggleCompare: (item: CompareItem) => void;
  clearCompare: () => void;
  isComparing: (id: number) => boolean;
}

export const useCompareStore = create<CompareState>()((set, get) => ({
  selected: [],
  toggleCompare: (item: CompareItem) => {
    const current = get().selected;
    const exists = current.some((x) => x.id === item.id);

    if (exists) {
      set({ selected: current.filter((x) => x.id !== item.id) });
    } else {
      if (current.length >= 2) {
        // Capped at maximum of 2 elements, replace the second one or do nothing
        // Let's replace the second element or just ignore it
        return;
      }
      set({ selected: [...current, item] });
    }
  },
  clearCompare: () => set({ selected: [] }),
  isComparing: (id: number) => get().selected.some((x) => x.id === id),
}));
