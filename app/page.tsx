import Link from "next/link";
import { prisma } from "@/lib/db";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warhammer Paint Hub",
  description: "Find paint equivalents across all major brands and browse step-by-step Warhammer 40k painting recipes.",
};

export default async function PaintHubHomePage() {
  const [paintCount, brandCount, recipeCount, featuredRecipes] = await Promise.all([
    prisma.paint.count({ where: { isActive: true } }),
    prisma.paintBrand.count(),
    prisma.recipe.count({ where: { status: "PUBLISHED" } }),
    prisma.recipe.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { viewCount: "desc" },
      take: 4,
      include: { faction: true, steps: { select: { id: true } } },
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blood-600/20 border border-blood-600/40 text-blood-400 text-xs px-3 py-1 rounded-full mb-4">
          <span>⬡</span>
          <span>Warhammer 40,000 Hobby Tools</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-bone-200 mb-4">
          The Right Paint, Every Time
        </h1>
        <p className="text-iron-300 text-lg max-w-2xl mx-auto">
          Find cross-brand paint equivalents using perceptual colour matching. Browse step-by-step recipes for every faction. Track your collection.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { value: paintCount, label: "Paints indexed" },
          { value: brandCount, label: "Brands" },
          { value: recipeCount, label: "Recipes" },
        ].map(({ value, label }) => (
          <div key={label} className="bg-iron-800 border border-iron-700 rounded-lg p-4 text-center">
            <p className="text-bone-200 text-2xl font-mono font-bold">{value}</p>
            <p className="text-iron-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-16">
        <Link
          href="/convert"
          className="group bg-iron-800 border border-iron-700 hover:border-blood-500 rounded-xl p-6 transition-colors"
        >
          <div className="text-3xl mb-3">🎨</div>
          <h2 className="text-bone-200 font-display text-xl mb-2">Paint Converter</h2>
          <p className="text-iron-400 text-sm">
            Don&apos;t have the exact Citadel paint? Find the closest equivalent from Vallejo, Army Painter, and more — ranked by perceptual colour similarity using Delta-E 2000.
          </p>
          <span className="mt-4 inline-block text-blood-400 text-sm group-hover:underline">
            Find equivalents →
          </span>
        </Link>

        <Link
          href="/recipes"
          className="group bg-iron-800 border border-iron-700 hover:border-blood-500 rounded-xl p-6 transition-colors"
        >
          <div className="text-3xl mb-3">📋</div>
          <h2 className="text-bone-200 font-display text-xl mb-2">Recipe Browser</h2>
          <p className="text-iron-400 text-sm">
            Step-by-step painting guides for every major faction — from Ultramarines blue armour to Death Guard corrosion effects. Filter by faction and difficulty.
          </p>
          <span className="mt-4 inline-block text-blood-400 text-sm group-hover:underline">
            Browse recipes →
          </span>
        </Link>

        <Link
          href="/paints"
          className="group bg-iron-800 border border-iron-700 hover:border-blood-500 rounded-xl p-6 transition-colors"
        >
          <div className="text-3xl mb-3">🔍</div>
          <h2 className="text-bone-200 font-display text-xl mb-2">Paint Database</h2>
          <p className="text-iron-400 text-sm">
            Browse and search {paintCount} paints across {brandCount} brands. Filter by finish type, category, or colour range.
          </p>
          <span className="mt-4 inline-block text-blood-400 text-sm group-hover:underline">
            Browse paints →
          </span>
        </Link>

        <Link
          href="/inventory"
          className="group bg-iron-800 border border-iron-700 hover:border-blood-500 rounded-xl p-6 transition-colors"
        >
          <div className="text-3xl mb-3">🗃️</div>
          <h2 className="text-bone-200 font-display text-xl mb-2">My Collection</h2>
          <p className="text-iron-400 text-sm">
            Mark the paints you own and see which recipe steps you can already complete. No account needed — stored locally in your browser.
          </p>
          <span className="mt-4 inline-block text-blood-400 text-sm group-hover:underline">
            Manage collection →
          </span>
        </Link>
      </div>

      {/* Featured recipes */}
      {featuredRecipes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-bone-200 font-display text-2xl">Popular Recipes</h2>
            <Link href="/recipes" className="text-iron-400 hover:text-iron-200 text-sm transition-colors">
              All recipes →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featuredRecipes.map((r) => (
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
        </div>
      )}
    </div>
  );
}
