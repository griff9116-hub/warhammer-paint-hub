import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hexToLab, deltaE2000 } from "@/lib/paint-hub/color";

export async function GET(req: NextRequest) {
  const hex = req.nextUrl.searchParams.get("hex");
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "3", 10), 10);

  if (!hex || !/^[0-9a-fA-F]{6}$/.test(hex)) {
    return NextResponse.json({ error: "Invalid hex" }, { status: 400 });
  }

  const targetLab = hexToLab(hex);
  const paints = await prisma.paint.findMany({
    where: { isActive: true },
    select: { id: true, name: true, hex: true, finish: true, labL: true, labA: true, labB: true, brand: { select: { name: true } } },
  });

  const scored = paints
    .map((p) => ({
      id: p.id,
      name: p.name,
      hex: p.hex,
      finish: p.finish,
      brandName: p.brand.name,
      deltaE: deltaE2000(targetLab, { L: p.labL, a: p.labA, b: p.labB }),
    }))
    .sort((a, b) => a.deltaE - b.deltaE)
    .slice(0, limit);

  return NextResponse.json(scored);
}
