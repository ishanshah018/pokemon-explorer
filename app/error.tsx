"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/feedback/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught application error:", error);
  }, [error]);

  return (
    <div className="py-12">
      <ErrorState
        title="Unable to load Pokemon explorer"
        message="A network or system error occurred while contacting PokeAPI. Please verify your internet connection and try again."
        onRetry={() => reset()}
      />
    </div>
  );
}
