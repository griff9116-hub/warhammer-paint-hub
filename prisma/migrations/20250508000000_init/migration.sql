-- CreateTable
CREATE TABLE "PaintBrand" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaintBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paint" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hex" TEXT NOT NULL,
    "finish" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "range" TEXT,
    "labL" DOUBLE PRECISION NOT NULL,
    "labA" DOUBLE PRECISION NOT NULL,
    "labB" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaintEquivalent" (
    "id" TEXT NOT NULL,
    "fromPaintId" TEXT NOT NULL,
    "toPaintId" TEXT NOT NULL,
    "deltaE" DOUBLE PRECISION NOT NULL,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PaintEquivalent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faction" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "allegiance" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Faction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "factionId" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "technique" TEXT,
    "authorName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeStep" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "technique" TEXT,
    "duration" TEXT,

    CONSTRAINT "RecipeStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeStepPaint" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "paintId" TEXT NOT NULL,
    "role" TEXT,
    "dilution" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RecipeStepPaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaintBrand_slug_key" ON "PaintBrand"("slug");

-- CreateIndex
CREATE INDEX "Paint_labL_labA_labB_idx" ON "Paint"("labL", "labA", "labB");

-- CreateIndex
CREATE UNIQUE INDEX "Paint_brandId_slug_key" ON "Paint"("brandId", "slug");

-- CreateIndex
CREATE INDEX "PaintEquivalent_fromPaintId_deltaE_idx" ON "PaintEquivalent"("fromPaintId", "deltaE");

-- CreateIndex
CREATE UNIQUE INDEX "PaintEquivalent_fromPaintId_toPaintId_key" ON "PaintEquivalent"("fromPaintId", "toPaintId");

-- CreateIndex
CREATE UNIQUE INDEX "Faction_slug_key" ON "Faction"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_slug_key" ON "Recipe"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeStep_recipeId_stepNumber_key" ON "RecipeStep"("recipeId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeStepPaint_stepId_paintId_key" ON "RecipeStepPaint"("stepId", "paintId");

-- AddForeignKey
ALTER TABLE "Paint" ADD CONSTRAINT "Paint_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "PaintBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintEquivalent" ADD CONSTRAINT "PaintEquivalent_fromPaintId_fkey" FOREIGN KEY ("fromPaintId") REFERENCES "Paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintEquivalent" ADD CONSTRAINT "PaintEquivalent_toPaintId_fkey" FOREIGN KEY ("toPaintId") REFERENCES "Paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStepPaint" ADD CONSTRAINT "RecipeStepPaint_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "RecipeStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStepPaint" ADD CONSTRAINT "RecipeStepPaint_paintId_fkey" FOREIGN KEY ("paintId") REFERENCES "Paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
