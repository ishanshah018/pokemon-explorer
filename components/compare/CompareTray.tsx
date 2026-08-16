"use client";

import { useState } from "react";
import { useCompareStore } from "@/lib/store/compare-store";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";
import { CompareModal } from "./CompareModal";
import { ArrowLeftRight, X } from "lucide-react";
import { capitalize } from "@/lib/utils";

export function CompareTray() {
  const [modalOpen, setModalOpen] = useState(false);
  const mounted = useIsMounted();
  const selected = useCompareStore((state) => state.selected);
  const toggleCompare = useCompareStore((state) => state.toggleCompare);
  const clearCompare = useCompareStore((state) => state.clearCompare);

  const count = mounted ? selected.length : 0;

  if (count === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 animate-in slide-in-from-bottom duration-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-zinc-900/95 dark:bg-zinc-950/95 text-white shadow-2xl border border-zinc-800/80 backdrop-blur-md">
          {/* Left: Previews */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0">
              <ArrowLeftRight className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-2">
              {selected.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-800 border border-zinc-700/60"
                >
                  {/* Thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.sprite}
                    alt={item.name}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-[11px] font-bold max-w-[80px] truncate">
                    {capitalize(item.name)}
                  </span>
                  <button
                    onClick={() => toggleCompare(item)}
                    aria-label={`Remove ${item.name} from comparison`}
                    className="p-0.5 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {count < 2 && (
                <span className="text-[11px] text-zinc-400 font-semibold italic animate-pulse">
                  Select 1 more Pokemon...
                </span>
              )}
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={clearCompare}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-700 cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => setModalOpen(true)}
              disabled={count < 2}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 text-white transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            >
              Compare Now
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <CompareModal
          ids={selected.map((x) => x.id)}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
