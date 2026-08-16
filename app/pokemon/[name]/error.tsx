"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/feedback/ErrorState";

export default function DetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Details page error:", error);
  }, [error]);

  return (
    <div className="py-12">
      <ErrorState
        title="Could not load Pokemon details"
        message="An unexpected error occurred while fetching details for this Pokemon."
        onRetry={() => reset()}
      />
    </div>
  );
}
