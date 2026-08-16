"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Loader2, Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({
  placeholder = "Search Pokemon by name or ID...",
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const [prevSearch, setPrevSearch] = useState(currentSearch);
  const [text, setText] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();

  if (currentSearch !== prevSearch) {
    setPrevSearch(currentSearch);
    setText(currentSearch);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (text === currentSearch) return;

      const params = new URLSearchParams(searchParams.toString());
      params.delete("limit");
      if (text.trim()) {
        params.set("search", text.trim().toLowerCase());
      } else {
        params.delete("search");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [text, currentSearch, pathname, router, searchParams]);

  const handleClear = () => {
    setText("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("limit");
    params.delete("search");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="pokemon-search" className="sr-only">
        Search Pokemon by name or ID
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none">
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          id="pokemon-search"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />

        {text && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search query"
            className="absolute right-3 p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
