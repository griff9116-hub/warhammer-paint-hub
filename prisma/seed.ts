import { PrismaClient } from "@prisma/client";
import { seedPaints } from "./seeds/paints";
import { seedRecipes } from "./seeds/recipes";

const prisma = new PrismaClient();

async function main() {
  console.log("🎨 Seeding Warhammer Paint Hub...");
  await seedPaints(prisma);
  await seedRecipes(prisma);
  console.log("✅ Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
