export function DetailsSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-shimmer">
      {/* Top back button skeleton */}
      <div className="w-24 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

      {/* Main detail card container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        {/* Left Column: Image placeholder */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-100/60 dark:bg-zinc-800/40 rounded-2xl">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
        </div>

        {/* Right Column: Info & Stats placeholders */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="w-16 h-4 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="w-48 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="flex gap-2">
              <div className="w-20 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-20 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            </div>
          </div>

          {/* Stats block placeholder */}
          <div className="space-y-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800">
            <div className="w-32 h-5 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-16 h-4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="w-8 h-4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="flex-1 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
