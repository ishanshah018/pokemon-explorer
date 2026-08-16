"use client";

import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  pageSize?: number;
}

export function LoadMoreButton({
  onLoadMore,
  isLoading,
  hasMore,
  pageSize = 20,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="text-center py-6 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
        You have reached the end of the list.
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span>Loading Pokemon...</span>
          </>
        ) : (
          <span>Load {pageSize} More</span>
        )}
      </button>
    </div>
  );
}
