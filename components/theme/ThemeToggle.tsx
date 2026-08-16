"use client";

import { useTheme } from "next-themes";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
      )}
    </button>
  );
}
