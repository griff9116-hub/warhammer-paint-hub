import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { seedPaints } from "@/prisma/seeds/paints";
import { seedRecipes } from "@/prisma/seeds/recipes";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SEED_SECRET = process.env.SEED_SECRET;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!SEED_SECRET || secret !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = new PrismaClient();
  try {
    await seedPaints(prisma);
    await seedRecipes(prisma);
    return NextResponse.json({ ok: true, message: "Seed complete" });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
