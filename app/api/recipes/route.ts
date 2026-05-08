import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const faction = searchParams.get("faction") ?? undefined;
  const difficulty = searchParams.get("difficulty") ?? undefined;

  const recipes = await prisma.recipe.findMany({
    where: {
      status: "PUBLISHED",
      ...(faction ? { faction: { slug: faction } } : {}),
      ...(difficulty ? { difficulty } : {}),
    },
    include: { faction: true, steps: { select: { id: true } } },
    orderBy: [{ viewCount: "desc" }, { title: "asc" }],
  });

  return NextResponse.json({ recipes });
}

const stepSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  technique: z.string().max(100).optional(),
  duration: z.string().max(50).optional(),
});

const submitSchema = z.object({
  title: z.string().min(2).max(200),
  factionSlug: z.string().min(1),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  technique: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  authorName: z.string().max(100).optional(),
  steps: z.array(stepSchema).min(1).max(20),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const { title, factionSlug, difficulty, technique, description, authorName, steps } = parsed.data;

  const faction = await prisma.faction.findUnique({ where: { slug: factionSlug } });
  if (!faction) {
    return NextResponse.json({ error: "Unknown faction" }, { status: 422 });
  }

  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80) +
    "-" +
    Date.now().toString(36);

  const recipe = await prisma.recipe.create({
    data: {
      slug,
      title,
      factionId: faction.id,
      difficulty,
      technique: technique ?? null,
      description: description ?? null,
      authorName: authorName ?? null,
      status: "PENDING",
      steps: {
        create: steps.map((s, i) => ({
          stepNumber: i + 1,
          title: s.title,
          description: s.description,
          technique: s.technique ?? null,
          duration: s.duration ?? null,
        })),
      },
    },
    select: { id: true, slug: true },
  });

  return NextResponse.json({ id: recipe.id, slug: recipe.slug }, { status: 201 });
}
