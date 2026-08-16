import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { FavoritesDrawer } from "@/components/favorites/FavoritesDrawer";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center group focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-1"
        >
          <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50 block leading-none">
            PokeExplorer
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <FavoritesDrawer />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
