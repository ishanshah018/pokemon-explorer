import { CardSkeleton } from "@/components/feedback/CardSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="w-48 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        <div className="w-72 h-4 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
