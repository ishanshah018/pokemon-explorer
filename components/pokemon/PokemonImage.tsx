"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PokemonImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function PokemonImage({
  src,
  alt,
  width = 475,
  height = 475,
  className,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
}: PokemonImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const imageSrc = error || !src ? "/placeholder-pokemon.png" : src;

  return (
    <div className={cn("relative overflow-hidden flex items-center justify-center w-full h-full", className)}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse rounded-xl" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className={cn(
          "w-full h-auto object-contain transition-all duration-300 drop-shadow-md",
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      />
    </div>
  );
}
