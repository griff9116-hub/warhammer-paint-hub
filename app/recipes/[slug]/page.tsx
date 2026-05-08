import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { RecipeStepCard } from "@/components/recipes/RecipeStepCard";
import { InventoryPanel } from "@/components/recipes/InventoryPanel";
import type { Metadata } from "next";
import type { RecipeStepData } from "@/types/paint-hub";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { slug } });
  if (!recipe) return {};
  return { title: recipe.title };
}

const DIFFICULTY_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const DIFFICULTY_STYLES: Record<string, string> = {
  BEGINNER:     "bg-green-900/50 text-green-300",
  INTERMEDIATE: "bg-amber-900/50 text-amber-300",
  ADVANCED:     "bg-red-900/50 text-red-300",
};

export default async function RecipeDetailPage({ params }: Props) {
  const { slug } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      faction: true,
      steps: {
        orderBy: { stepNumber: "asc" },
        include: {
          paints: {
            orderBy: { sortOrder: "asc" },
            include: { paint: { include: { brand: true } } },
          },
        },
      },
    },
  });

  if (!recipe) notFound();

  // Increment viewCount (fire and forget)
  prisma.recipe.update({ where: { id: recipe.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  const steps: RecipeStepData[] = recipe.steps.map((s) => ({
    id: s.id,
    stepNumber: s.stepNumber,
    title: s.title,
    description: s.description,
    technique: s.technique,
    duration: s.duration,
    paints: s.paints.map((sp) => ({
      paintId: sp.paint.id,
      name: sp.paint.name,
      hex: sp.paint.hex,
      finish: sp.paint.finish,
      brandName: sp.paint.brand.name,
      role: sp.role,
      dilution: sp.dilution,
      sortOrder: sp.sortOrder,
    })),
  }));

  const allRequiredPaints = [
    ...new Map(
      steps.flatMap((s) =>
        s.paints.map((p) => [p.paintId, { paintId: p.paintId, name: p.name, hex: p.hex }])
      )
    ).values(),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-iron-500 text-sm mb-3">
          <Link href="/recipes" className="hover:text-iron-300 transition-colors">Recipes</Link>
          <span>›</span>
          <span>{recipe.faction.name}</span>
        </div>
        <div className="flex items-start gap-4 flex-wrap">
          <h1 className="text-bone-200 font-display text-3xl flex-1">{recipe.title}</h1>
          <span className={`text-sm px-3 py-1 rounded-full ${DIFFICULTY_STYLES[recipe.difficulty] ?? "bg-iron-700 text-iron-300"}`}>
            {DIFFICULTY_LABELS[recipe.difficulty] ?? recipe.difficulty}
          </span>
        </div>
        {recipe.description && (
          <p className="text-iron-300 mt-3 max-w-3xl">{recipe.description}</p>
        )}
        <div className="flex items-center gap-4 mt-3 text-sm text-iron-500">
          <span>{recipe.faction.name}</span>
          {recipe.technique && <span>· {recipe.technique}</span>}
          {recipe.authorName && <span>· by {recipe.authorName}</span>}
          <span>· {steps.length} steps</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_220px] gap-6">
        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <RecipeStepCard key={step.id} step={step} />
          ))}
        </div>

        {/* Inventory sidebar */}
        <div>
          <InventoryPanel requiredPaints={allRequiredPaints} />
        </div>
      </div>
    </div>
  );
}
