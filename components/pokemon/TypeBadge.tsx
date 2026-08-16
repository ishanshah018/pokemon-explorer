import { PokemonType } from "@/types/pokemon";
import { TYPE_COLORS } from "@/lib/pokemon/constants";
import { capitalize, cn } from "@/lib/utils";

interface TypeBadgeProps {
  type: PokemonType;
  size?: "sm" | "md";
  className?: string;
}

export function TypeBadge({ type, size = "sm", className }: TypeBadgeProps) {
  const theme = TYPE_COLORS[type] || TYPE_COLORS.normal;

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full tracking-wide shadow-xs transition-colors",
        theme.bg,
        theme.text,
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3.5 py-1 text-xs",
        className
      )}
    >
      {capitalize(type)}
    </span>
  );
}
