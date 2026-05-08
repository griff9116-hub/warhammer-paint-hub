import { NextRequest, NextResponse } from "next/server";
import { findConversions } from "@/lib/paint-hub/conversions";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = req.nextUrl;
  const brands = searchParams.getAll("brand");
  const maxResults = parseInt(searchParams.get("limit") ?? "15");
  const conversions = await findConversions(id, { brands: brands.length > 0 ? brands : undefined, maxResults });
  return NextResponse.json({ conversions });
}
