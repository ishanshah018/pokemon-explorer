export function CardSkeleton() {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs h-[230px] animate-shimmer overflow-hidden">
      {/* Top ID placeholder */}
      <div className="w-12 h-4 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

      {/* Center Sprite placeholder */}
      <div className="my-auto mx-auto w-24 h-24 rounded-full bg-zinc-200/70 dark:bg-zinc-800/70 animate-pulse" />

      {/* Bottom Name & Badges placeholder */}
      <div className="mt-auto pt-2 space-y-2 border-t border-zinc-100 dark:border-zinc-800/60">
        <div className="w-24 h-5 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        <div className="flex gap-1.5">
          <div className="w-14 h-5 rounded-full bg-zinc-200/70 dark:bg-zinc-800/70 animate-pulse" />
          <div className="w-14 h-5 rounded-full bg-zinc-200/70 dark:bg-zinc-800/70 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
