import { prisma } from "@/lib/db";
import { PaintCard } from "@/components/paints/PaintCard";
import { PaintSearchBar } from "@/components/paints/PaintSearchBar";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Paint Database" };

const FINISHES = ["MATTE", "SATIN", "METALLIC", "CONTRAST", "TECHNICAL"];

interface Props {
  searchParams: Promise<{ q?: string; brand?: string; finish?: string; category?: string }>;
}

export default async function PaintsPage({ searchParams }: Props) {
  const { q, brand, finish, category } = await searchParams;

  const [brands, paints] = await Promise.all([
    prisma.paintBrand.findMany({ orderBy: { name: "asc" } }),
    prisma.paint.findMany({
      where: {
        isActive: true,
        ...(q ? { name: { contains: q } } : {}),
        ...(brand ? { brand: { slug: brand } } : {}),
        ...(finish ? { finish } : {}),
        ...(category ? { category } : {}),
      },
      include: { brand: true },
      orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
      take: 200,
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-bone-200 font-display text-3xl mb-1">Paint Database</h1>
        <p className="text-iron-400 text-sm">{paints.length} paints{q ? ` matching "${q}"` : ""}</p>
      </div>

      {/* Search + filters */}
      <div className="bg-iron-800 border border-iron-700 rounded-xl p-4 mb-6 space-y-3">
        <PaintSearchBar defaultValue={q} />

        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/paints?${new URLSearchParams({ ...(q ? { q } : {}), ...(brand === b.slug ? {} : { brand: b.slug }), ...(finish ? { finish } : {}), ...(category ? { category } : {}) }).toString()}`}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${brand === b.slug ? "bg-blood-600/30 border-blood-500 text-blood-300" : "border-iron-600 text-iron-400 hover:border-iron-400 hover:text-iron-200"}`}
            >
              {b.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {FINISHES.map((f) => (
            <Link
              key={f}
              href={`/paints?${new URLSearchParams({ ...(q ? { q } : {}), ...(brand ? { brand } : {}), ...(finish === f ? {} : { finish: f }), ...(category ? { category } : {}) }).toString()}`}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${finish === f ? "bg-blood-600/30 border-blood-500 text-blood-300" : "border-iron-600 text-iron-500 hover:border-iron-400 hover:text-iron-300"}`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      {/* Paint grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {paints.map((p) => (
          <PaintCard
            key={p.id}
            paint={{
              id: p.id,
              slug: p.slug,
              name: p.name,
              hex: p.hex,
              finish: p.finish,
              category: p.category,
              range: p.range,
              brandSlug: p.brand.slug,
              brandName: p.brand.name,
            }}
          />
        ))}
      </div>

      {paints.length === 0 && (
        <div className="text-center py-16 text-iron-500">
          <p className="text-lg">No paints found</p>
          <Link href="/paints" className="text-sm text-iron-400 hover:text-iron-200 mt-2 inline-block">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}
