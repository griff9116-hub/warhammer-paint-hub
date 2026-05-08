import { prisma } from "@/lib/db";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Recipe Browser" };

const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

interface Props {
  searchParams: Promise<{ faction?: string; difficulty?: string; q?: string }>;
}

export default async function RecipesPage({ searchParams }: Props) {
  const { faction, difficulty, q } = await searchParams;

  const [factions, recipes] = await Promise.all([
    prisma.faction.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.recipe.findMany({
      where: {
        status: "PUBLISHED",
        ...(faction ? { faction: { slug: faction } } : {}),
        ...(difficulty ? { difficulty } : {}),
        ...(q ? { title: { contains: q } } : {}),
      },
      include: { faction: true, steps: { select: { id: true } } },
      orderBy: [{ viewCount: "desc" }, { title: "asc" }],
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-bone-200 font-display text-3xl mb-1">Recipe Browser</h1>
          <p className="text-iron-400 text-sm">{recipes.length} recipe{recipes.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/recipes/submit"
          className="text-sm bg-blood-600/20 border border-blood-600/40 text-blood-400 hover:bg-blood-600/30 px-4 py-2 rounded-lg transition-colors"
        >
          + Submit Recipe
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-iron-800 border border-iron-700 rounded-xl p-4 mb-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/recipes"
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${!faction ? "bg-blood-600/30 border-blood-500 text-blood-300" : "border-iron-600 text-iron-400 hover:border-iron-400 hover:text-iron-200"}`}
          >
            All Factions
          </Link>
          {factions.map((f) => (
            <Link
              key={f.slug}
              href={`/recipes?${new URLSearchParams({ ...(faction === f.slug ? {} : { faction: f.slug }), ...(difficulty ? { difficulty } : {}) }).toString()}`}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${faction === f.slug ? "bg-blood-600/30 border-blood-500 text-blood-300" : "border-iron-600 text-iron-400 hover:border-iron-400 hover:text-iron-200"}`}
            >
              {f.name}
            </Link>
          ))}
        </div>

        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <Link
              key={d}
              href={`/recipes?${new URLSearchParams({ ...(faction ? { faction } : {}), ...(difficulty === d ? {} : { difficulty: d }) }).toString()}`}
              className={`text-xs px-3 py-1 rounded border transition-colors ${difficulty === d ? "bg-blood-600/30 border-blood-500 text-blood-300" : "border-iron-600 text-iron-500 hover:border-iron-400 hover:text-iron-300"}`}
            >
              {d.charAt(0) + d.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      {/* Recipe grid */}
      {recipes.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={{
                slug: r.slug,
                title: r.title,
                factionName: r.faction.name,
                factionSlug: r.faction.slug,
                difficulty: r.difficulty,
                technique: r.technique,
                stepCount: r.steps.length,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-iron-500">
          <p className="text-lg mb-2">No recipes found</p>
          <Link href="/recipes" className="text-sm text-iron-400 hover:text-iron-200">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}
