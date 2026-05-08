import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") ?? undefined;
  const brand = searchParams.get("brand") ?? undefined;
  const finish = searchParams.get("finish") ?? undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "100"), 500);

  const paints = await prisma.paint.findMany({
    where: {
      isActive: true,
      ...(q ? { name: { contains: q } } : {}),
      ...(brand ? { brand: { slug: brand } } : {}),
      ...(finish ? { finish } : {}),
    },
    include: { brand: true },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
    take: limit,
  });

  return NextResponse.json({
    paints: paints.map((p) => ({
      id: p.id, slug: p.slug, name: p.name, hex: p.hex,
      finish: p.finish, category: p.category, range: p.range,
      brandName: p.brand.name, brandSlug: p.brand.slug,
    })),
    total: paints.length,
  });
}
