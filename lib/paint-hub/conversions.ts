import { prisma } from "@/lib/db";
import { deltaE2000, type LabColor } from "./color";

export interface ConversionResult {
  paint: {
    id: string;
    slug: string;
    name: string;
    hex: string;
    finish: string;
    category: string;
    range: string | null;
    brandSlug: string;
    brandName: string;
  };
  deltaE: number;
  isOfficial: boolean;
}

export async function findConversions(
  sourcePaintId: string,
  options: { brands?: string[]; maxResults?: number; maxDeltaE?: number } = {}
): Promise<ConversionResult[]> {
  const { maxResults = 15, maxDeltaE = 25 } = options;

  const source = await prisma.paint.findUnique({
    where: { id: sourcePaintId },
    include: { brand: true },
  });
  if (!source) return [];

  const sourceLab: LabColor = { L: source.labL, a: source.labA, b: source.labB };

  const candidates = await prisma.paint.findMany({
    where: {
      isActive: true,
      brandId: { not: source.brandId },
      ...(options.brands?.length ? { brand: { slug: { in: options.brands } } } : {}),
    },
    include: { brand: true },
  });

  const officialSet = new Set<string>();
  const officials = await prisma.paintEquivalent.findMany({ where: { fromPaintId: sourcePaintId } });
  officials.forEach((e) => officialSet.add(e.toPaintId));

  return candidates
    .map((p) => ({
      paint: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        hex: p.hex,
        finish: p.finish,
        category: p.category,
        range: p.range,
        brandSlug: p.brand.slug,
        brandName: p.brand.name,
      },
      deltaE: deltaE2000(sourceLab, { L: p.labL, a: p.labA, b: p.labB }),
      isOfficial: officialSet.has(p.id),
    }))
    .filter((r) => r.deltaE <= maxDeltaE)
    .sort((a, b) => a.deltaE - b.deltaE)
    .slice(0, maxResults);
}
