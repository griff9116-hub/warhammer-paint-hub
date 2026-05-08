import { PrismaClient } from "@prisma/client";

type StepInput = {
  title: string;
  description: string;
  technique?: string;
  dilution?: string;
  duration?: string;
  paints: { brandSlug: string; paintSlug: string; role: string; dilution?: string }[];
};

type RecipeInput = {
  slug: string;
  title: string;
  description: string;
  factionSlug: string;
  difficulty: string;
  technique?: string;
  steps: StepInput[];
};

const FACTIONS = [
  { slug: "space-marines", name: "Space Marines", allegiance: "Imperium", sortOrder: 1 },
  { slug: "necrons", name: "Necrons", allegiance: "Xenos", sortOrder: 2 },
  { slug: "orks", name: "Orks", allegiance: "Xenos", sortOrder: 3 },
  { slug: "chaos-space-marines", name: "Chaos Space Marines", allegiance: "Chaos", sortOrder: 4 },
  { slug: "imperial-guard", name: "Imperial Guard", allegiance: "Imperium", sortOrder: 5 },
  { slug: "tyranids", name: "Tyranids", allegiance: "Xenos", sortOrder: 6 },
  { slug: "universal", name: "Universal Technique", allegiance: null, sortOrder: 10 },
];

const RECIPES: RecipeInput[] = [
  {
    slug: "ultramarines-blue-armour",
    title: "Ultramarines Blue Armour",
    description: "The iconic Ultramarines blue armour using the classic base-shade-highlight method. Perfect for beginners learning the fundamental three-stage painting technique.",
    factionSlug: "space-marines",
    difficulty: "BEGINNER",
    technique: "Base-Shade-Highlight",
    steps: [
      {
        title: "Prime the model",
        description: "Apply a thin, even coat of grey or white primer. Let dry fully (20 minutes). This gives paint something to grip.",
        technique: "Priming",
        duration: "5 min + 20 min drying",
        paints: [{ brandSlug: "citadel", paintSlug: "grey-seer", role: "primary" }],
      },
      {
        title: "Apply the base coat",
        description: "Basecoat all armour panels with Macragge Blue. Apply two thin coats rather than one thick one to avoid obscuring detail. Let each coat dry before applying the next.",
        technique: "Basecoat",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "macragge-blue", role: "primary" }],
      },
      {
        title: "Shade the recesses",
        description: "Apply Drakenhof Nightshade into the recesses and panel lines. Let it flow naturally into the gaps — don't overload the brush. Allow to fully dry.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "drakenhof-nightshade", role: "primary" }],
      },
      {
        title: "Layer the raised areas",
        description: "Apply Altdorf Guard Blue to the raised surfaces, leaving the darkened recesses visible. Avoid the lowest points of each panel.",
        technique: "Layering",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "altdorf-guard-blue", role: "primary" }],
      },
      {
        title: "Edge highlight",
        description: "Apply a thin line of Calgar Blue along the sharpest edges of each armour panel using the tip of your brush. Keep it thin — less is more.",
        technique: "Edge highlighting",
        duration: "15 min",
        paints: [{ brandSlug: "citadel", paintSlug: "calgar-blue", role: "primary" }],
      },
    ],
  },
  {
    slug: "necron-warriors-contrast",
    title: "Necron Warriors — Contrast Method",
    description: "A fast, effective Necron scheme using Contrast paints over a light base. Results in a weathered metallic warrior look in under an hour.",
    factionSlug: "necrons",
    difficulty: "BEGINNER",
    technique: "Contrast/Speedpaint",
    steps: [
      {
        title: "Prime with Wraithbone",
        description: "Apply Wraithbone spray or brush-on primer. This warm off-white base makes Contrast paints glow rather than sink into grey.",
        technique: "Priming",
        duration: "5 min + 20 min drying",
        paints: [{ brandSlug: "citadel", paintSlug: "wraithbone", role: "primary" }],
      },
      {
        title: "Apply Skeleton Horde to the body",
        description: "Cover the entire metallic body sections with Skeleton Horde Contrast. It will pool in recesses naturally, creating depth and a bone-like patina.",
        technique: "Contrast application",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "skeleton-horde", role: "primary" }],
      },
      {
        title: "Paint the rods with Tesseract Glow / Sybarite Green",
        description: "Apply Sybarite Green to all the gauss rods/tubes. Use two thin coats for full coverage. This creates the classic green energy effect.",
        technique: "Layering",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "sybarite-green", role: "primary" }],
      },
      {
        title: "Drybrush the metallic areas",
        description: "Drybrush Necron Compound lightly over the body surfaces. Use a wide, stiff brush with most of the paint removed. This creates a worn, metallic sheen.",
        technique: "Drybrushing",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "necron-compound", role: "primary" }],
      },
    ],
  },
  {
    slug: "blood-angels-red-armour",
    title: "Blood Angels Red Armour",
    description: "Rich, deep red armour for Blood Angels Space Marines. Achieves a vibrant result with smooth gradient using the wet-blend and glaze approach.",
    factionSlug: "space-marines",
    difficulty: "INTERMEDIATE",
    technique: "Layering + Glazing",
    steps: [
      {
        title: "Prime black",
        description: "Apply Abaddon Black as a basecoat. Black primer helps reds appear deeper and more saturated.",
        technique: "Priming/Basecoat",
        duration: "5 min",
        paints: [{ brandSlug: "citadel", paintSlug: "abaddon-black", role: "primary" }],
      },
      {
        title: "Basecoat with Mephiston Red",
        description: "Apply two thin coats of Mephiston Red over all armour panels. Coverage won't be perfect over black — that's fine, it adds depth.",
        technique: "Basecoat",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "mephiston-red", role: "primary" }],
      },
      {
        title: "Shade with Carroburg Crimson",
        description: "Wash Carroburg Crimson into the recesses and panel lines. Apply with a fine brush rather than flooding the whole model.",
        technique: "Targeted wash",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "carroburg-crimson", role: "primary" }],
      },
      {
        title: "Reapply Mephiston Red to raised areas",
        description: "Carefully re-layer Mephiston Red on the raised panels, leaving the recesses darker from the shade.",
        technique: "Layering",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "mephiston-red", role: "primary" }],
      },
      {
        title: "Layer Evil Sunz Scarlet",
        description: "Apply Evil Sunz Scarlet to the upper two-thirds of each armour panel, building brightness toward the edges.",
        technique: "Layering",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "evil-sunz-scarlet", role: "primary" }],
      },
      {
        title: "Highlight with Wild Rider Red",
        description: "Apply Wild Rider Red to the top edges and highest raised areas of each panel.",
        technique: "Highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "wild-rider-red", role: "primary" }],
      },
      {
        title: "Final edge highlight",
        description: "Use a fine line of Troll Slayer Orange on the absolute sharpest edges for a bright, hot reflection effect.",
        technique: "Edge highlighting",
        duration: "15 min",
        paints: [{ brandSlug: "citadel", paintSlug: "troll-slayer-orange", role: "primary" }],
      },
    ],
  },
  {
    slug: "ork-skin-traditional",
    title: "Ork Skin — Traditional Method",
    description: "Classic green Ork skin with a natural earthy tone. Fast and effective — perfect for batch-painting entire mobs.",
    factionSlug: "orks",
    difficulty: "BEGINNER",
    technique: "Base-Shade-Drybrush",
    steps: [
      {
        title: "Basecoat with Death World Forest",
        description: "Apply Death World Forest as a solid basecoat over all skin areas. Two thin coats gives a good, even tone.",
        technique: "Basecoat",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "death-world-forest", role: "primary" }],
      },
      {
        title: "Shade with Biel-Tan Green",
        description: "Apply Biel-Tan Green wash all over the skin. It will settle in the recesses and darken the tone considerably, adding great depth.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "biel-tan-green", role: "primary" }],
      },
      {
        title: "Layer with Skarsnik Green",
        description: "Drybrush or carefully layer Skarsnik Green on the raised muscles and prominent features.",
        technique: "Layering",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "skarsnik-green", role: "primary" }],
      },
      {
        title: "Final highlight with Kabalite Green",
        description: "Apply a final edge highlight or drybrush of Kabalite Green on the very highest points — knuckles, cheekbones, brow ridges.",
        technique: "Edge highlighting",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "kabalite-green", role: "primary" }],
      },
    ],
  },
  {
    slug: "death-guard-plague-marine",
    title: "Death Guard Plague Marine",
    description: "Grimy, diseased armour of the Death Guard. Uses multiple techniques including stippling and technical paints to create convincing rot and corrosion.",
    factionSlug: "chaos-space-marines",
    difficulty: "ADVANCED",
    technique: "Stippling + Technical Paints",
    steps: [
      {
        title: "Basecoat with Zandri Dust",
        description: "Apply two solid coats of Zandri Dust. This warm, dirty yellow-brown is the ideal starting point for Death Guard's diseased armour.",
        technique: "Basecoat",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "zandri-dust", role: "primary" }],
      },
      {
        title: "Shade with Agrax Earthshade",
        description: "Apply a heavy coat of Agrax Earthshade over the whole model. Really let it pool in every recess — Death Guard should look filthy.",
        technique: "Shade wash",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "agrax-earthshade", role: "primary" }],
      },
      {
        title: "Layer Ushabti Bone on raised areas",
        description: "Re-establish the raised areas with Ushabti Bone, leaving the shaded recesses dark.",
        technique: "Layering",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "ushabti-bone", role: "primary" }],
      },
      {
        title: "Apply Typhus Corrosion to damaged areas",
        description: "Dab Typhus Corrosion on bolt holes, joints, damage points, and areas where the armour would naturally corrode. Use a stippling motion with an old brush.",
        technique: "Stippling",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "typhus-corrosion", role: "primary" }],
      },
      {
        title: "Apply Nihilakh Oxide to metal trim",
        description: "Stipple or drybrush Nihilakh Oxide over any brass/bronze metal trim to simulate verdigris. Apply sparingly for a realistic corroded metal effect.",
        technique: "Technical paint application",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "nihilakh-oxide", role: "primary" }],
      },
      {
        title: "Drybrush Screaming Skull for highlights",
        description: "Lightly drybrush Screaming Skull over all armour surfaces to pick out detail and add an overall pallid highlight tone.",
        technique: "Drybrushing",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "screaming-skull", role: "primary" }],
      },
      {
        title: "Add Blood for the Blood God accents",
        description: "Carefully apply Blood for the Blood God to wounds, oozing sores, and any diseased flesh areas. Use sparingly — a little goes a long way.",
        technique: "Technical paint application",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "blood-for-the-blood-god", role: "primary" }],
      },
      {
        title: "Final rust streaks",
        description: "Mix Agrax Earthshade with a tiny amount of Typhus Corrosion and draw thin vertical streaks from bolts and joints downward, simulating rust run-off.",
        technique: "Rust streaking",
        duration: "10 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "agrax-earthshade", role: "primary" },
          { brandSlug: "citadel", paintSlug: "typhus-corrosion", role: "secondary", dilution: "Mixed 3:1 with Agrax" },
        ],
      },
      {
        title: "Paint the Nurgle symbol and details",
        description: "Paint any Nurgle icons with Retributor Armour, shade with Seraphim Sepia for an old tarnished gold look.",
        technique: "Detail painting",
        duration: "10 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "retributor-armour", role: "primary" },
          { brandSlug: "citadel", paintSlug: "seraphim-sepia", role: "shade" },
        ],
      },
    ],
  },
  {
    slug: "skeleton-bone-effect",
    title: "Skeleton / Bone Effect",
    description: "Classic bone and skeleton painting recipe that works for any undead, ancient, or bone-coloured surface. Three-stage method produces natural-looking results.",
    factionSlug: "universal",
    difficulty: "BEGINNER",
    technique: "Base-Shade-Highlight",
    steps: [
      {
        title: "Basecoat with Zandri Dust",
        description: "Apply two thin coats of Zandri Dust as a mid-tone base. This warm, sandy tone is the ideal starting point for bone.",
        technique: "Basecoat",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "zandri-dust", role: "primary" }],
      },
      {
        title: "Shade with Seraphim Sepia",
        description: "Apply Seraphim Sepia all over the bone. It produces a warm, amber-tinged shadow that looks naturally stained and old.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "seraphim-sepia", role: "primary" }],
      },
      {
        title: "Layer with Ushabti Bone",
        description: "Apply Ushabti Bone to the raised surfaces, leaving the recesses in the darker shaded tone.",
        technique: "Layering",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "ushabti-bone", role: "primary" }],
      },
      {
        title: "Final highlight with Screaming Skull",
        description: "Apply Screaming Skull to the very highest edges and most prominent raised details. This gives the bone a dried, sun-bleached look.",
        technique: "Edge highlighting",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "screaming-skull", role: "primary" }],
      },
    ],
  },
  {
    slug: "rusted-metal-effect",
    title: "Rusted Metal Effect",
    description: "Create convincing rust and oxidation on any metal surface. Ideal for Ork vehicles, ancient relics, or any weathered metallic component.",
    factionSlug: "universal",
    difficulty: "INTERMEDIATE",
    technique: "Weathering + Technical Paints",
    steps: [
      {
        title: "Basecoat with Rhinox Hide",
        description: "Paint the metal surface with Rhinox Hide. This dark brown underpins the rust effect and shows through the later metallic layers to represent deep rust.",
        technique: "Basecoat",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "rhinox-hide", role: "primary" }],
      },
      {
        title: "Drybrush with Leadbelcher / metallic",
        description: "Drybrush Runefang Steel heavily over the surface. The brown will show through in the recesses where rust would naturally form.",
        technique: "Drybrushing",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "runefang-steel", role: "primary" }],
      },
      {
        title: "Stipple rust colours",
        description: "Using an old, splayed brush, stipple a mix of Mournfang Brown and Jokaero Orange in irregular patches across the surface. Vary the ratio — more brown in deeper areas, more orange on surface rust.",
        technique: "Stippling",
        duration: "12 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "mournfang-brown", role: "primary" },
          { brandSlug: "citadel", paintSlug: "jokaero-orange", role: "secondary" },
        ],
      },
      {
        title: "Apply Typhus Corrosion",
        description: "Dab Typhus Corrosion into the worst rust patches for added texture and grit. This technical paint contains actual texture particles.",
        technique: "Technical paint",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "typhus-corrosion", role: "primary" }],
      },
      {
        title: "Shade with Agrax Earthshade",
        description: "Apply Agrax Earthshade into the rust patches and any recesses to blend the colours and add depth to the effect.",
        technique: "Targeted wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "agrax-earthshade", role: "primary" }],
      },
      {
        title: "Final metallic highlights",
        description: "Drybrush Stormhost Silver on the most raised metallic edges to add a bright, polished highlight that contrasts with the rust.",
        technique: "Drybrushing",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "stormhost-silver", role: "primary" }],
      },
    ],
  },
  {
    slug: "nmm-gold",
    title: "Non-Metallic Metal Gold (NMM)",
    description: "Paint convincing gold without metallic paints using NMM technique. Demanding but produces stunning results under any lighting — unlike real metallics which depend on light angle.",
    factionSlug: "universal",
    difficulty: "ADVANCED",
    technique: "Non-Metallic Metal (NMM)",
    steps: [
      {
        title: "Basecoat with Rhinox Hide",
        description: "Apply a solid basecoat of Rhinox Hide. In NMM, the darkest shadow is a deep brown, not black, as gold has a warm dark tone.",
        technique: "Basecoat",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "rhinox-hide", role: "shadow" }],
      },
      {
        title: "Apply first mid-tone: Mournfang Brown",
        description: "Block in the mid-tone with Mournfang Brown over the shadow areas, leaving Rhinox Hide only in the deepest shadows and recesses.",
        technique: "Layering",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "mournfang-brown", role: "mid-tone" }],
      },
      {
        title: "Build up with Averland Sunset",
        description: "Apply Averland Sunset over the mid-tones and lighter areas. Keep it away from the shadows. The coverage should begin to look like a gradient.",
        technique: "Layering",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "averland-sunset", role: "mid-tone" }],
      },
      {
        title: "Add bright highlight with Flash Gitz Yellow",
        description: "Apply Flash Gitz Yellow to the most raised, light-catching surfaces. In NMM, gold reads as pure bright yellow at its lightest points.",
        technique: "Highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "flash-gitz-yellow", role: "highlight" }],
      },
      {
        title: "Pure white at the very brightest point",
        description: "Apply a tiny dot or sliver of White Scar at the single brightest light-catching point. This creates the impression of a specular reflection.",
        technique: "Specular highlight",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "white-scar", role: "specular" }],
      },
      {
        title: "Glaze to blend transitions",
        description: "Thin Averland Sunset 1:4 with water (or medium) and glaze over any harsh transitions to smooth the gradient.",
        technique: "Glazing",
        dilution: "1:4 with water",
        duration: "10 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "averland-sunset", role: "glaze", dilution: "1:4 with water" },
        ],
      },
      {
        title: "Deepen shadows with thinned Rhinox Hide",
        description: "Apply very thinned Rhinox Hide into the deepest recesses to push the shadow contrast further.",
        technique: "Glazing",
        duration: "10 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "rhinox-hide", role: "glaze", dilution: "1:3 with water" },
        ],
      },
      {
        title: "Review and refine",
        description: "Step back and review the gradient. NMM works by having hard contrast between light and dark, with smooth transitions between them. Add more white highlights or deepen shadows as needed.",
        technique: "Refinement",
        duration: "15 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "white-scar", role: "highlight" },
          { brandSlug: "citadel", paintSlug: "rhinox-hide", role: "shadow" },
        ],
      },
    ],
  },
];

export async function seedRecipes(prisma: PrismaClient) {
  console.log("  Seeding factions...");
  const factionIdMap = new Map<string, string>();

  for (const faction of FACTIONS) {
    const f = await prisma.faction.upsert({
      where: { slug: faction.slug },
      update: { name: faction.name, allegiance: faction.allegiance, sortOrder: faction.sortOrder },
      create: faction,
    });
    factionIdMap.set(faction.slug, f.id);
  }
  console.log(`    ✓ ${FACTIONS.length} factions`);

  // Get brand IDs for paint lookups
  const brands = await prisma.paintBrand.findMany();
  const brandIdMap = new Map(brands.map((b) => [b.slug, b.id]));

  console.log("  Seeding recipes...");
  for (const recipe of RECIPES) {
    const factionId = factionIdMap.get(recipe.factionSlug);
    if (!factionId) {
      console.warn(`    ! Faction not found: ${recipe.factionSlug}`);
      continue;
    }

    const r = await prisma.recipe.upsert({
      where: { slug: recipe.slug },
      update: {
        title: recipe.title,
        description: recipe.description,
        factionId,
        difficulty: recipe.difficulty,
        technique: recipe.technique ?? null,
        status: "PUBLISHED",
      },
      create: {
        slug: recipe.slug,
        title: recipe.title,
        description: recipe.description,
        factionId,
        difficulty: recipe.difficulty,
        technique: recipe.technique ?? null,
        status: "PUBLISHED",
      },
    });

    // Delete existing steps to re-seed cleanly
    await prisma.recipeStep.deleteMany({ where: { recipeId: r.id } });

    for (let i = 0; i < recipe.steps.length; i++) {
      const step = recipe.steps[i];
      const rs = await prisma.recipeStep.create({
        data: {
          recipeId: r.id,
          stepNumber: i + 1,
          title: step.title,
          description: step.description,
          technique: step.technique ?? null,
          duration: step.duration ?? null,
        },
      });

      for (let j = 0; j < step.paints.length; j++) {
        const sp = step.paints[j];
        const brandId = brandIdMap.get(sp.brandSlug);
        if (!brandId) continue;

        const paint = await prisma.paint.findUnique({
          where: { brandId_slug: { brandId, slug: sp.paintSlug } },
        });
        if (!paint) {
          console.warn(`    ! Paint not found: ${sp.brandSlug}/${sp.paintSlug}`);
          continue;
        }

        await prisma.recipeStepPaint.create({
          data: {
            stepId: rs.id,
            paintId: paint.id,
            role: sp.role,
            dilution: sp.dilution ?? null,
            sortOrder: j,
          },
        });
      }
    }

    console.log(`    ✓ ${recipe.title}`);
  }
}
