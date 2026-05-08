import Link from "next/link";
import type { RecipeCardData } from "@/types/paint-hub";

const DIFFICULTY_STYLES: Record<string, string> = {
  BEGINNER:     "bg-green-900/50 text-green-300",
  INTERMEDIATE: "bg-amber-900/50 text-amber-300",
  ADVANCED:     "bg-red-900/50 text-red-300",
};

const FACTION_ACCENTS: Record<string, string> = {
  "space-marines":       "bg-blue-600",
  "necrons":             "bg-green-600",
  "orks":                "bg-green-800",
  "chaos-space-marines": "bg-red-800",
  "imperial-guard":      "bg-amber-700",
  "tyranids":            "bg-purple-700",
  "universal":           "bg-iron-600",
};

export function RecipeCard({ recipe }: { recipe: RecipeCardData }) {
  const diffStyle = DIFFICULTY_STYLES[recipe.difficulty] ?? "bg-iron-700 text-iron-300";
  const accent = FACTION_ACCENTS[recipe.factionSlug] ?? "bg-iron-600";

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="block bg-iron-800 border border-iron-700 rounded-lg overflow-hidden hover:border-iron-500 transition-colors group"
    >
      <div className={`h-1 ${accent}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-iron-100 font-medium text-sm leading-snug group-hover:text-bone-200 transition-colors">
            {recipe.title}
          </h3>
          <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${diffStyle}`}>
            {recipe.difficulty.charAt(0) + recipe.difficulty.slice(1).toLowerCase()}
          </span>
        </div>
        <p className="text-iron-400 text-xs mt-1">{recipe.factionName}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-iron-500">
          <span>{recipe.stepCount} steps</span>
          {recipe.technique && <span>· {recipe.technique}</span>}
        </div>
      </div>
    </Link>
  );
}
