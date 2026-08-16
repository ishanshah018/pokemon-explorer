import Link from "next/link";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-12 flex flex-col items-center">
      <EmptyState
        title="Pokemon Not Found"
        message="We checked the Pokedex, but could not find a Pokemon matching that name or ID. Try searching for a classic like Pikachu or Charizard."
        icon={<SearchX className="w-8 h-8 text-amber-500" />}
        action={
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home Explorer
          </Link>
        }
      />
    </div>
  );
}
