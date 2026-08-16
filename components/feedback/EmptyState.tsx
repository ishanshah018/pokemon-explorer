import { ReactNode } from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title = "No Pokemon found",
  message = "We could not find any Pokemon matching your search or filter criteria. Try adjusting your search query or clearing type filters.",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 my-6">
      <div className="w-14 h-14 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center mb-4">
        {icon || <SearchX className="w-7 h-7" />}
      </div>

      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        {title}
      </h2>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {action && <div>{action}</div>}
    </div>
  );
}
