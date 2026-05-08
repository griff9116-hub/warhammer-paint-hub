import Link from "next/link";
import { prisma } from "@/lib/db";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Palette, BookOpen, Search, Package } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Battle Palette",
  description: "Find paint equivalents across all major brands and browse step-by-step Warhammer 40k painting recipes.",
};

// Actual hobby paint colours — purely decorative motif
const PAINT_SWATCHES = [
  "#3D7A3D","#1A3A6A","#8A1C1C","#C49A24",
  "#8A3DC4","#C47A3D","#3DC4B8","#6A6A5A",
];

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

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-5 gap-12 mb-16 pb-16 border-b border-iron-700 items-end">

        {/* Left — editorial headline */}
        <div className="md:col-span-3">
          {/* Paint swatch strip */}
          <div className="flex gap-1.5 mb-6">
            {PAINT_SWATCHES.map((c) => (
              <div key={c} className="w-5 h-5 rounded-sm opacity-80" style={{ backgroundColor: c }} />
            ))}
          </div>

          <p className="text-xs tracking-[0.18em] uppercase text-blood-400 mb-4 font-medium">
            Warhammer 40,000 Hobby Tools
          </p>

          <h1 className="font-display text-5xl md:text-[4.5rem] text-bone-200 leading-[1.05] mb-6">
            The Right<br />Paint,<br />Every Time.
          </h1>

          <p className="text-iron-200 text-base leading-relaxed max-w-md mb-8">
            Cross-brand paint equivalents via perceptual colour matching.
            Step-by-step recipes for every faction. Your collection, tracked.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/convert"
              className="bg-blood-500 hover:bg-blood-400 text-bone-100 px-5 py-2.5 text-sm font-medium transition-colors rounded-sm"
            >
              Open Converter →
            </Link>
            <Link
              href="/recipes"
              className="border border-iron-600 hover:border-iron-400 text-iron-200 hover:text-bone-200 px-5 py-2.5 text-sm font-medium transition-colors rounded-sm"
            >
              Browse Recipes
            </Link>
          </div>
        </div>

        {/* Right — stats column */}
        <div className="md:col-span-2 md:border-l border-iron-700 md:pl-10 space-y-8">
          {[
            { value: paintCount, label: "Paints indexed", sub: "across all major brands" },
            { value: brandCount, label: "Brands", sub: "Citadel, Vallejo, Army Painter & more" },
            { value: recipeCount, label: "Published recipes", sub: "step-by-step painting guides" },
          ].map(({ value, label, sub }) => (
            <div key={label}>
              <p className="text-4xl font-mono font-bold text-bone-100 tabular-nums">
                {value.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-blood-400 mt-1">{label}</p>
              <p className="text-xs text-iron-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature grid ─────────────────────────────────────── */}
      <div className="mb-20">
        <p className="text-xs tracking-[0.18em] uppercase text-iron-400 mb-5 font-medium">Tools</p>

        {/*
          Flush divider grid: gap-px + bg-iron-700 creates 1-px lines between
          cells without explicit borders. Desktop layout:
            Col 1 (row-span-2): Converter
            Col 2 row 1: Recipes   Col 3 row 1: Database
            Col 2-3 row 2: Collection
        */}
        <div className="grid md:grid-cols-3 md:grid-rows-2 gap-px bg-iron-700 rounded-xl overflow-hidden">

          {/* Converter — large, spans 2 rows */}
          <Link
            href="/convert"
            className="group md:row-span-2 bg-iron-900 hover:bg-iron-800 p-8 flex flex-col justify-between transition-colors min-h-[280px]"
          >
            <div>
              <div className="w-10 h-10 bg-blood-600/25 rounded flex items-center justify-center mb-6">
                <Palette className="w-5 h-5 text-blood-400" />
              </div>
              <h2 className="font-display text-2xl text-bone-200 mb-3">Paint Converter</h2>
              <p className="text-iron-400 text-sm leading-relaxed">
                Missing a Citadel pot? Find the closest equivalent from Vallejo, Army Painter,
                Scale75 and more — ranked by Delta-E 2000 perceptual colour distance.
              </p>
            </div>
            <span className="text-blood-400 text-sm group-hover:underline mt-6 block">
              Find equivalents →
            </span>
          </Link>

          {/* Recipes */}
          <Link
            href="/recipes"
            className="group bg-iron-900 hover:bg-iron-800 p-6 flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="w-8 h-8 bg-blood-600/25 rounded flex items-center justify-center mb-4">
                <BookOpen className="w-4 h-4 text-blood-400" />
              </div>
              <h2 className="font-display text-lg text-bone-200 mb-2">Recipe Browser</h2>
              <p className="text-iron-400 text-sm leading-relaxed">
                Step-by-step guides from Ultramarines blue to Death Guard corrosion.
                Filter by faction and difficulty.
              </p>
            </div>
            <span className="text-blood-400 text-sm group-hover:underline mt-4 block">Browse recipes →</span>
          </Link>

          {/* Paint database */}
          <Link
            href="/paints"
            className="group bg-iron-900 hover:bg-iron-800 p-6 flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="w-8 h-8 bg-blood-600/25 rounded flex items-center justify-center mb-4">
                <Search className="w-4 h-4 text-blood-400" />
              </div>
              <h2 className="font-display text-lg text-bone-200 mb-2">Paint Database</h2>
              <p className="text-iron-400 text-sm leading-relaxed">
                Search {paintCount} paints across {brandCount} brands.
                Filter by finish, category, or colour range.
              </p>
            </div>
            <span className="text-blood-400 text-sm group-hover:underline mt-4 block">Browse paints →</span>
          </Link>

          {/* Collection — spans 2 cols on desktop */}
          <Link
            href="/inventory"
            className="group md:col-span-2 bg-iron-900 hover:bg-iron-800 p-6 flex items-center gap-8 transition-colors"
          >
            <div className="w-10 h-10 bg-blood-600/25 rounded flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-blood-400" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-lg text-bone-200 mb-1">My Collection</h2>
              <p className="text-iron-400 text-sm leading-relaxed">
                Mark paints you own and instantly see which recipe steps you can already complete.
                No account required — stored in your browser.
              </p>
              <span className="text-blood-400 text-sm group-hover:underline mt-2 block">
                Manage collection →
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Popular recipes ───────────────────────────────────── */}
      {featuredRecipes.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-5">
            <p className="text-xs tracking-[0.18em] uppercase text-iron-400 font-medium">Popular Recipes</p>
            <Link href="/recipes" className="text-iron-400 hover:text-iron-200 text-xs transition-colors">
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
