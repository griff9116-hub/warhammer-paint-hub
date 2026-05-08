import Link from "next/link";
import { prisma } from "@/lib/db";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Palette, BookOpen, Search, Package } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Battle Palette",
  description: "Find paint equivalents across all major brands and browse step-by-step Warhammer 40k painting recipes.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
      <div className="relative text-center mb-12 rounded-2xl overflow-hidden py-16 px-6">
        {/* Atmospheric background */}
        <div className="absolute inset-0 bg-iron-800 rounded-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(153,27,27,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(153,27,27,0.08),transparent)]" />

        {/* Decorative hex grid — top right */}
        <svg
          className="absolute top-0 right-0 w-72 h-72 opacity-5 text-bone-200"
          viewBox="0 0 200 200"
          fill="currentColor"
          aria-hidden="true"
        >
          {[
            [30,20],[80,20],[130,20],[180,20],
            [55,62],[105,62],[155,62],
            [30,104],[80,104],[130,104],[180,104],
            [55,146],[105,146],[155,146],
            [30,188],[80,188],[130,188],[180,188],
          ].map(([cx, cy], i) => (
            <polygon
              key={i}
              points={`${cx},${cy! - 18} ${cx! + 16},${cy! - 9} ${cx! + 16},${cy! + 9} ${cx},${cy! + 18} ${cx! - 16},${cy! + 9} ${cx! - 16},${cy! - 9}`}
            />
          ))}
        </svg>

        {/* Decorative paint drops — bottom left */}
        <svg
          className="absolute bottom-0 left-0 w-48 h-48 opacity-10"
          viewBox="0 0 120 120"
          aria-hidden="true"
        >
          <circle cx="20" cy="90" r="18" fill="#9B1C1C" />
          <circle cx="50" cy="100" r="10" fill="#9B1C1C" opacity="0.6" />
          <circle cx="10" cy="65" r="7" fill="#9B1C1C" opacity="0.4" />
          <ellipse cx="35" cy="108" rx="22" ry="8" fill="#9B1C1C" opacity="0.3" />
        </svg>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-blood-600/20 border border-blood-600/40 text-blood-400 text-xs px-3 py-1 rounded-full mb-4">
            <Palette className="w-3 h-3" />
            <span>Warhammer 40,000 Hobby Tools</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-bone-200 mb-4">
            The Right Paint,<br className="hidden sm:block" /> Every Time
          </h1>
          <p className="text-iron-300 text-lg max-w-2xl mx-auto">
            Find cross-brand paint equivalents using perceptual colour matching. Browse step-by-step recipes for every faction. Track your collection.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/convert" className="bg-blood-600 hover:bg-blood-500 text-bone-100 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Try the Converter
            </Link>
            <Link href="/recipes" className="bg-iron-700 hover:bg-iron-600 text-bone-200 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Browse Recipes
            </Link>
          </div>
        </div>
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
        {[
          {
            href: "/convert",
            icon: <Palette className="w-6 h-6 text-blood-400" />,
            title: "Paint Converter",
            body: `Don't have the exact Citadel paint? Find the closest equivalent from Vallejo, Army Painter, and more — ranked by perceptual colour similarity using Delta-E 2000.`,
            cta: "Find equivalents",
          },
          {
            href: "/recipes",
            icon: <BookOpen className="w-6 h-6 text-blood-400" />,
            title: "Recipe Browser",
            body: "Step-by-step painting guides for every major faction — from Ultramarines blue armour to Death Guard corrosion effects. Filter by faction and difficulty.",
            cta: "Browse recipes",
          },
          {
            href: "/paints",
            icon: <Search className="w-6 h-6 text-blood-400" />,
            title: "Paint Database",
            body: `Browse and search ${paintCount} paints across ${brandCount} brands. Filter by finish type, category, or colour range.`,
            cta: "Browse paints",
          },
          {
            href: "/inventory",
            icon: <Package className="w-6 h-6 text-blood-400" />,
            title: "My Collection",
            body: "Mark the paints you own and see which recipe steps you can already complete. No account needed — stored locally in your browser.",
            cta: "Manage collection",
          },
        ].map(({ href, icon, title, body, cta }) => (
          <Link
            key={href}
            href={href}
            className="group relative bg-iron-800 border border-iron-700 hover:border-blood-600/60 rounded-xl p-6 transition-all hover:bg-iron-800/80 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_0%,rgba(153,27,27,0.08),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-10 h-10 bg-iron-700 rounded-lg flex items-center justify-center mb-4">
                {icon}
              </div>
              <h2 className="text-bone-200 font-display text-xl mb-2">{title}</h2>
              <p className="text-iron-400 text-sm leading-relaxed">{body}</p>
              <span className="mt-4 inline-block text-blood-400 text-sm group-hover:underline">
                {cta} →
              </span>
            </div>
          </Link>
        ))}
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
