export type PaintFinish = "MATTE" | "SATIN" | "METALLIC" | "CONTRAST" | "TECHNICAL";
export type PaintCategory = "BASE" | "LAYER" | "SHADE" | "CONTRAST" | "TECHNICAL" | "DRY" | "TEXTURE";
export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type RecipeStatus = "PENDING" | "PUBLISHED" | "REJECTED";

export interface PaintCardData {
  id: string;
  slug: string;
  name: string;
  hex: string;
  finish: string;
  category: string;
  range: string | null;
  brandSlug: string;
  brandName: string;
}

export interface RecipeCardData {
  slug: string;
  title: string;
  factionName: string;
  factionSlug: string;
  difficulty: string;
  technique: string | null;
  stepCount: number;
}

export interface RecipeStepData {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  technique: string | null;
  duration: string | null;
  paints: {
    paintId: string;
    name: string;
    hex: string;
    finish: string;
    brandName: string;
    role: string | null;
    dilution: string | null;
    sortOrder: number;
  }[];
}
