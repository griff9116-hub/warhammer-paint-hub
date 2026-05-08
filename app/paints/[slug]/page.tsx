import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { findConversions } from "@/lib/paint-hub/conversions";
import { PaintSwatch } from "@/components/paints/PaintSwatch";
import { PaintFinishBadge } from "@/components/paints/PaintFinishBadge";
import { ConversionResult } from "@/components/paints/ConversionResult";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const paint = await prisma.paint.findFirst({
    where: { slug },
    include: { brand: true },
  });
  if (!paint) return {};
  return { title: `${paint.name} — ${paint.brand.name}` };
}

export default async function PaintDetailPage({ params }: Props) {
  const { slug } = await params;
  const paint = await prisma.paint.findFirst({
    where: { slug, isActive: true },
    include: { brand: true },
  });
  if (!paint) notFound();

  const conversions = await findConversions(paint.id, { maxResults: 12 });
  const official = conversions.filter((c) => c.isOfficial);
  const algorithmic = conversions.filter((c) => !c.isOfficial);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Paint header */}
      <div className="bg-iron-800 border border-iron-700 rounded-xl p-6 mb-8 flex items-center gap-6">
        <PaintSwatch hex={paint.hex} finish={paint.finish} size="lg" />
        <div>
          <h1 className="text-bone-200 font-display text-3xl">{paint.name}</h1>
          <p className="text-iron-400 mt-1">{paint.brand.name}{paint.range ? ` · ${paint.range}` : ""}</p>
          <div className="flex items-center gap-2 mt-2">
            <PaintFinishBadge finish={paint.finish} />
            <span className="text-iron-500 text-sm capitalize">{paint.category.toLowerCase()}</span>
            <span className="text-iron-600 font-mono text-sm">{paint.hex.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <h2 className="text-bone-200 font-display text-2xl mb-4">Paint Conversions</h2>

      {official.length > 0 && (
        <div className="mb-6">
          <h3 className="text-iron-400 text-xs uppercase tracking-wider mb-2">Official Equivalents</h3>
          <div className="space-y-2">
            {official.map((r) => (
              <ConversionResult key={r.paint.id} result={r} />
            ))}
          </div>
        </div>
      )}

      {algorithmic.length > 0 && (
        <div>
          <h3 className="text-iron-400 text-xs uppercase tracking-wider mb-2">Colour-Matched Alternatives</h3>
          <p className="text-iron-500 text-xs mb-3">Ranked by Delta-E 2000 perceptual colour distance — lower is closer.</p>
          <div className="space-y-2">
            {algorithmic.map((r) => (
              <ConversionResult key={r.paint.id} result={r} />
            ))}
          </div>
        </div>
      )}

      {conversions.length === 0 && (
        <p className="text-iron-500 text-center py-8">No conversions found for this paint.</p>
      )}
    </div>
  );
}
