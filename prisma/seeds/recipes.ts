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
  { slug: "space-marines",       name: "Space Marines",       allegiance: "Imperium", sortOrder: 1  },
  { slug: "necrons",             name: "Necrons",             allegiance: "Xenos",    sortOrder: 2  },
  { slug: "orks",                name: "Orks",                allegiance: "Xenos",    sortOrder: 3  },
  { slug: "chaos-space-marines", name: "Chaos Space Marines", allegiance: "Chaos",    sortOrder: 4  },
  { slug: "imperial-guard",      name: "Imperial Guard",      allegiance: "Imperium", sortOrder: 5  },
  { slug: "tyranids",            name: "Tyranids",            allegiance: "Xenos",    sortOrder: 6  },
  { slug: "tau",                 name: "T'au Empire",         allegiance: "Xenos",    sortOrder: 7  },
  { slug: "aeldari",             name: "Aeldari",             allegiance: "Xenos",    sortOrder: 8  },
  { slug: "adeptus-mechanicus",  name: "Adeptus Mechanicus",  allegiance: "Imperium", sortOrder: 9  },
  { slug: "chaos-daemons",       name: "Chaos Daemons",       allegiance: "Chaos",    sortOrder: 11 },
  { slug: "drukhari",            name: "Drukhari",            allegiance: "Xenos",    sortOrder: 12 },
  { slug: "thousand-sons",       name: "Thousand Sons",       allegiance: "Chaos",    sortOrder: 13 },
  { slug: "world-eaters",        name: "World Eaters",        allegiance: "Chaos",    sortOrder: 14 },
  { slug: "sisters-of-battle",   name: "Adepta Sororitas",    allegiance: "Imperium", sortOrder: 15 },
  { slug: "grey-knights",        name: "Grey Knights",        allegiance: "Imperium", sortOrder: 16 },
  { slug: "universal",           name: "Universal Technique", allegiance: null,       sortOrder: 20 },
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

  // ─── Space Marines — additional chapters ───────────────────────────────────
  {
    slug: "space-wolves-grey-armour",
    title: "Space Wolves Grey Armour",
    description: "The frost-grey armour of the Space Wolves using the Contrast method. Quick to execute and ideal for painting entire packs of Fenrisian warriors.",
    factionSlug: "space-marines",
    difficulty: "BEGINNER",
    technique: "Contrast/Speedpaint",
    steps: [
      {
        title: "Prime with Grey Seer",
        description: "Apply a thin, even coat of Grey Seer. The light grey base maximises how the Space Wolves Grey Contrast pools in recesses.",
        technique: "Priming",
        duration: "5 min + 20 min drying",
        paints: [{ brandSlug: "citadel", paintSlug: "grey-seer", role: "primary" }],
      },
      {
        title: "Apply Space Wolves Grey Contrast",
        description: "Coat all armour panels with Space Wolves Grey in one smooth pass. Let it flow into rivets and joints naturally.",
        technique: "Contrast application",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "space-wolves-grey", role: "primary" }],
      },
      {
        title: "Drybrush Etherium Blue",
        description: "Lightly drybrush Etherium Blue over the raised armour edges to simulate the cold, icy glint of Fenrisian steel.",
        technique: "Drybrushing",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "etherium-blue", role: "primary" }],
      },
      {
        title: "Edge highlight with Fenrisian Grey",
        description: "Draw a thin edge highlight of Fenrisian Grey along the sharpest panel edges and armour rims for definition.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "fenrisian-grey", role: "primary" }],
      },
    ],
  },
  {
    slug: "dark-angels-green-armour",
    title: "Dark Angels Green Armour",
    description: "The secretive, deep green of the Dark Angels chapter — brooding and precise. Uses the Contrast method for speed without sacrificing depth.",
    factionSlug: "space-marines",
    difficulty: "BEGINNER",
    technique: "Contrast/Speedpaint",
    steps: [
      {
        title: "Prime with Wraithbone",
        description: "Apply Wraithbone primer. The warm off-white base makes the Dark Angels Green Contrast richer and deeper than a grey base would.",
        technique: "Priming",
        duration: "5 min + 20 min drying",
        paints: [{ brandSlug: "citadel", paintSlug: "wraithbone", role: "primary" }],
      },
      {
        title: "Apply Dark Angels Green Contrast",
        description: "Apply a single generous coat of Dark Angels Green over all armour areas. Work quickly in sections to avoid tide marks.",
        technique: "Contrast application",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "dark-angels-green", role: "primary" }],
      },
      {
        title: "Layer raised panels with Caliban Green",
        description: "Apply Caliban Green carefully to the flat raised areas of each armour panel, leaving the recesses dark from the Contrast paint.",
        technique: "Layering",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "caliban-green", role: "primary" }],
      },
      {
        title: "Edge highlight with Warpstone Glow",
        description: "Apply a fine highlight of Warpstone Glow along all armour edges, suggesting reflected light on the glossy ceramite.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "warpstone-glow", role: "primary" }],
      },
    ],
  },
  {
    slug: "black-templars-crusader",
    title: "Black Templars Crusader",
    description: "The stark black and white of the Black Templars Chapter — uncompromising and dramatic. Quick to paint and striking on the tabletop.",
    factionSlug: "space-marines",
    difficulty: "BEGINNER",
    technique: "Contrast + Edge Highlighting",
    steps: [
      {
        title: "Prime with Grey Seer",
        description: "Apply a Grey Seer basecoat. This gives the Black Templar Contrast something to grab and creates subtle variation under the black.",
        technique: "Priming",
        duration: "5 min + 20 min drying",
        paints: [{ brandSlug: "citadel", paintSlug: "grey-seer", role: "primary" }],
      },
      {
        title: "Apply Black Templar Contrast",
        description: "Apply Black Templar Contrast over all armour. The Contrast formula creates a naturally shaded, semi-gloss black with depth in the recesses.",
        technique: "Contrast application",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "black-templar", role: "primary" }],
      },
      {
        title: "Edge highlight with Corvus Black",
        description: "Apply a fine highlight of Corvus Black along all raised armour edges. This separates panels without using bright colours.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "corvus-black", role: "primary" }],
      },
      {
        title: "Paint chapter iconography white",
        description: "Apply Corax White to the white shoulder trim, tabards, and Templar cross iconography. Apply two thin coats for solid coverage.",
        technique: "Basecoat",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "corax-white", role: "primary" }],
      },
      {
        title: "Highlight white with White Scar",
        description: "Highlight the white areas with White Scar on the topmost edges and most raised details.",
        technique: "Edge highlighting",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "white-scar", role: "primary" }],
      },
    ],
  },

  // ─── Imperial Guard ────────────────────────────────────────────────────────
  {
    slug: "cadian-shock-trooper",
    title: "Cadian Shock Trooper",
    description: "The grim soldiery of the Cadian Gate in their iconic olive-green fatigues. Fast batch-painting technique ideal for painting entire squads.",
    factionSlug: "imperial-guard",
    difficulty: "BEGINNER",
    technique: "Base-Shade-Highlight",
    steps: [
      {
        title: "Basecoat fatigues with Death World Forest",
        description: "Apply two thin coats of Death World Forest over all cloth/uniform areas. This earthy green matches the classic Cadian colour scheme.",
        technique: "Basecoat",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "death-world-forest", role: "primary" }],
      },
      {
        title: "Basecoat armour with Steel Legion Drab",
        description: "Apply Steel Legion Drab to all flak armour plates. This khaki-tan creates a believable contrast against the green fatigues.",
        technique: "Basecoat",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "steel-legion-drab", role: "primary" }],
      },
      {
        title: "Wash with Agrax Earthshade",
        description: "Apply Agrax Earthshade over the entire model. It ties the colours together and adds instant depth to every recess.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "agrax-earthshade", role: "primary" }],
      },
      {
        title: "Re-layer fatigues",
        description: "Carefully re-apply Death World Forest to the raised areas of the cloth, leaving the shaded recesses darker.",
        technique: "Layering",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "death-world-forest", role: "primary" }],
      },
      {
        title: "Highlight armour with Zandri Dust",
        description: "Apply Zandri Dust to the raised edges and most prominent surfaces of the flak armour plates.",
        technique: "Highlighting",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "zandri-dust", role: "primary" }],
      },
    ],
  },
  {
    slug: "death-korps-grenadier",
    title: "Death Korps of Krieg Grenadier",
    description: "The grim, gas-masked soldiers of Krieg in their characteristic grey greatcoats. A palette of cold greys and browns that evokes the misery of the trenches.",
    factionSlug: "imperial-guard",
    difficulty: "INTERMEDIATE",
    technique: "Layering + Weathering",
    steps: [
      {
        title: "Basecoat greatcoat with Mechanicus Standard Grey",
        description: "Apply two thin coats of Mechanicus Standard Grey over all coat and uniform areas. This mid-grey is the anchor of the entire colour scheme.",
        technique: "Basecoat",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "mechanicus-standard-grey", role: "primary" }],
      },
      {
        title: "Wash with Nuln Oil",
        description: "Apply Nuln Oil over the coat and all metallic areas. Allow to fully dry before proceeding.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "nuln-oil", role: "primary" }],
      },
      {
        title: "Layer with Dawnstone",
        description: "Apply Dawnstone to the raised folds and surfaces of the coat, leaving the darkened recesses from the wash.",
        technique: "Layering",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "dawnstone", role: "primary" }],
      },
      {
        title: "Highlight with Administratum Grey",
        description: "Apply a finer highlight of Administratum Grey to the uppermost edges of coat folds, collar, and cuffs.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "administratum-grey", role: "primary" }],
      },
      {
        title: "Paint leather with Rhinox Hide",
        description: "Basecoat the leather gas mask straps and satchels with Rhinox Hide, then wash with Agrax Earthshade for a worn leather look.",
        technique: "Basecoat + Wash",
        duration: "10 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "rhinox-hide", role: "primary" },
          { brandSlug: "citadel", paintSlug: "agrax-earthshade", role: "shade" },
        ],
      },
      {
        title: "Drybrush metals with Ironbreaker",
        description: "Drybrush all metal parts (helmet fittings, rifle, mask) with Ironbreaker over the Nuln Oil wash for a worn, dark metallic look.",
        technique: "Drybrushing",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "ironbreaker", role: "primary" }],
      },
    ],
  },

  // ─── Tyranids ──────────────────────────────────────────────────────────────
  {
    slug: "hive-fleet-leviathan-warrior",
    title: "Hive Fleet Leviathan — Tyranid Warrior",
    description: "The iconic white and purple colour scheme of Hive Fleet Leviathan. Uses Contrast paints for rapid chitin and flesh coverage.",
    factionSlug: "tyranids",
    difficulty: "INTERMEDIATE",
    technique: "Contrast + Layering",
    steps: [
      {
        title: "Prime with Wraithbone",
        description: "Apply Wraithbone as the base — it makes both the purple chitin and flesh tones appear saturated and vivid.",
        technique: "Priming",
        duration: "5 min + 20 min drying",
        paints: [{ brandSlug: "citadel", paintSlug: "wraithbone", role: "primary" }],
      },
      {
        title: "Apply Leviathan Purple to chitin",
        description: "Apply Leviathan Purple Contrast to all carapace and chitin areas in a single coat. Let it flow into recesses and bone-plate textures.",
        technique: "Contrast application",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "leviathan-purple", role: "primary" }],
      },
      {
        title: "Apply Guilliman Flesh to body",
        description: "Apply Guilliman Flesh Contrast to all fleshy, non-chitin areas — the belly, inner limbs, and head membrane.",
        technique: "Contrast application",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "guilliman-flesh", role: "primary" }],
      },
      {
        title: "Highlight chitin with Genestealer Purple",
        description: "Layer Genestealer Purple on the raised edges and ridges of each carapace plate, leaving the recesses in the deep Contrast tone.",
        technique: "Layering",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "genestealer-purple", role: "primary" }],
      },
      {
        title: "Edge highlight with Slaanesh Grey",
        description: "Apply a fine edge highlight of Slaanesh Grey on the sharpest edges of the carapace for a cool, pale reflected light effect.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "slaanesh-grey", role: "primary" }],
      },
      {
        title: "Paint claws and talons",
        description: "Basecoat claws with Rhinox Hide, layer with Ushabti Bone toward the tips, and finish with a fine Screaming Skull highlight at the very tip.",
        technique: "Layering",
        duration: "12 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "rhinox-hide", role: "shadow" },
          { brandSlug: "citadel", paintSlug: "ushabti-bone", role: "mid-tone" },
          { brandSlug: "citadel", paintSlug: "screaming-skull", role: "highlight" },
        ],
      },
    ],
  },
  {
    slug: "hive-fleet-kraken-gaunt",
    title: "Hive Fleet Kraken — Termagant",
    description: "The red and bone colour scheme of Hive Fleet Kraken. Fast to execute using Contrast paints — ideal for painting swarms of Termagants and Hormogaunts.",
    factionSlug: "tyranids",
    difficulty: "BEGINNER",
    technique: "Contrast/Speedpaint",
    steps: [
      {
        title: "Prime with Wraithbone",
        description: "Apply Wraithbone primer. The warm cream base makes the Blood Angels Red Contrast appear vivid and deep.",
        technique: "Priming",
        duration: "5 min + 20 min drying",
        paints: [{ brandSlug: "citadel", paintSlug: "wraithbone", role: "primary" }],
      },
      {
        title: "Apply Blood Angels Red to chitin",
        description: "Apply Blood Angels Red Contrast to all carapace plates. Work in sections and let it pool naturally.",
        technique: "Contrast application",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "blood-angels-red", role: "primary" }],
      },
      {
        title: "Apply Skeleton Horde to flesh",
        description: "Apply Skeleton Horde Contrast to the flesh and body areas. This warm, yellow-bone tone complements the red chitin perfectly.",
        technique: "Contrast application",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "skeleton-horde", role: "primary" }],
      },
      {
        title: "Drybrush Screaming Skull on flesh",
        description: "Lightly drybrush Screaming Skull over the flesh areas to pick up raised detail and add highlights.",
        technique: "Drybrushing",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "screaming-skull", role: "primary" }],
      },
    ],
  },

  // ─── T'au Empire ────────────────────────────────────────────────────────────
  {
    slug: "tau-fire-warrior",
    title: "T'au Fire Warrior",
    description: "The clean, tech-aesthetic armour of the T'au in a classic grey-white scheme. Smooth gradients and crisp edge highlights reward a careful, methodical approach.",
    factionSlug: "tau",
    difficulty: "BEGINNER",
    technique: "Base-Shade-Highlight",
    steps: [
      {
        title: "Basecoat armour with Celestra Grey",
        description: "Apply two thin coats of Celestra Grey over all armour panels. This blue-grey is the classic T'au armour base colour.",
        technique: "Basecoat",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "celestra-grey", role: "primary" }],
      },
      {
        title: "Shade with Nuln Oil",
        description: "Apply Nuln Oil into all recesses and panel lines. Use a fine brush to keep it controlled and avoid flooding the raised surfaces.",
        technique: "Targeted wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "nuln-oil", role: "primary" }],
      },
      {
        title: "Re-layer with Celestra Grey",
        description: "Re-apply Celestra Grey to the raised panel surfaces, leaving the darker recesses visible.",
        technique: "Layering",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "celestra-grey", role: "primary" }],
      },
      {
        title: "Highlight with Ulthuan Grey",
        description: "Apply Ulthuan Grey to the most raised areas of each armour panel — the flat surfaces that would catch the most light.",
        technique: "Highlighting",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "ulthuan-grey", role: "primary" }],
      },
      {
        title: "Edge highlight with White Scar",
        description: "Apply a fine edge highlight of White Scar along the sharpest armour edges. T'au armour has very clean, precise lines — keep them tight.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "white-scar", role: "primary" }],
      },
    ],
  },

  // ─── Aeldari ────────────────────────────────────────────────────────────────
  {
    slug: "ulthwe-black-guardian",
    title: "Ulthwé Black Guardian",
    description: "The sombre, jet-black armour of the Ulthwé craftworld with bone-white spirit stones and glowing gem details. Elegant and striking.",
    factionSlug: "aeldari",
    difficulty: "INTERMEDIATE",
    technique: "Layering + Gem Effects",
    steps: [
      {
        title: "Basecoat with Abaddon Black",
        description: "Apply two thin coats of Abaddon Black over all armour. Aeldari armour is sleek and smooth — avoid thick coats that will fill the delicate details.",
        technique: "Basecoat",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "abaddon-black", role: "primary" }],
      },
      {
        title: "Edge highlight with Dawnstone",
        description: "Apply a medium-width highlight of Dawnstone on raised armour edges. Aeldari armour has pronounced curves — follow them carefully.",
        technique: "Edge highlighting",
        duration: "15 min",
        paints: [{ brandSlug: "citadel", paintSlug: "dawnstone", role: "primary" }],
      },
      {
        title: "Fine highlight with Administratum Grey",
        description: "Apply a thinner, brighter line of Administratum Grey directly on top of the Dawnstone highlight on the sharpest edges.",
        technique: "Edge highlighting",
        duration: "15 min",
        paints: [{ brandSlug: "citadel", paintSlug: "administratum-grey", role: "primary" }],
      },
      {
        title: "Paint bone details with Ushabti Bone",
        description: "Apply Ushabti Bone to all bone-white elements — helmet crests, rune engravings, staff tops. Two thin coats for full coverage.",
        technique: "Basecoat",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "ushabti-bone", role: "primary" }],
      },
      {
        title: "Paint spirit stones with Waystone Green",
        description: "Apply Waystone Green Technical paint to all spirit stones and gems. It has a natural translucency that mimics the look of a gemstone without any blending.",
        technique: "Technical paint",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "waystone-green", role: "primary" }],
      },
    ],
  },
  {
    slug: "iyanden-yellow-wraithguard",
    title: "Iyanden Yellow Wraithguard",
    description: "The golden-yellow armour of Craftworld Iyanden — the ghost-light of a dying people. Contrast over a bright base gives rich results quickly.",
    factionSlug: "aeldari",
    difficulty: "INTERMEDIATE",
    technique: "Contrast + Layering",
    steps: [
      {
        title: "Prime with Wraithbone",
        description: "Apply Wraithbone as the base. This warm off-white maximises the depth and saturation of the yellow Contrast paint.",
        technique: "Priming",
        duration: "5 min + 20 min drying",
        paints: [{ brandSlug: "citadel", paintSlug: "wraithbone", role: "primary" }],
      },
      {
        title: "Apply Iyanden Yellow Contrast",
        description: "Apply Iyanden Yellow Contrast over all yellow armour areas in smooth, confident strokes. Avoid going back over areas that are starting to dry.",
        technique: "Contrast application",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "iyanden-yellow", role: "primary" }],
      },
      {
        title: "Shade recesses with Casandora Yellow",
        description: "Carefully apply Casandora Yellow into the deepest recesses only to push down the shadow areas further.",
        technique: "Targeted wash",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "casandora-yellow", role: "primary" }],
      },
      {
        title: "Layer raised areas with Averland Sunset",
        description: "Apply Averland Sunset to the raised panel surfaces to recover brightness after the wash.",
        technique: "Layering",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "averland-sunset", role: "primary" }],
      },
      {
        title: "Highlight with Yriel Yellow",
        description: "Apply Yriel Yellow to the very highest edges and corners of each armour panel for a bright, clean finish.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "yriel-yellow", role: "primary" }],
      },
      {
        title: "Final highlight with Flash Gitz Yellow",
        description: "Apply a fine specular highlight of Flash Gitz Yellow on the absolute topmost edges and corners.",
        technique: "Edge highlighting",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "flash-gitz-yellow", role: "primary" }],
      },
    ],
  },

  // ─── Adeptus Mechanicus ────────────────────────────────────────────────────
  {
    slug: "skitarii-rangers",
    title: "Skitarii Rangers",
    description: "The crimson robes and steel-grey armour of the Adeptus Mechanicus. Blending religious red with cold, industrial metallics.",
    factionSlug: "adeptus-mechanicus",
    difficulty: "INTERMEDIATE",
    technique: "Base-Shade-Highlight",
    steps: [
      {
        title: "Basecoat robes with Mephiston Red",
        description: "Apply two thin coats of Mephiston Red over all fabric and robe areas. The robes are the focal point of the model.",
        technique: "Basecoat",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "mephiston-red", role: "primary" }],
      },
      {
        title: "Shade robes with Carroburg Crimson",
        description: "Wash Carroburg Crimson into the robe folds and recesses for a deep, saturated shadow.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "carroburg-crimson", role: "primary" }],
      },
      {
        title: "Highlight robes with Evil Sunz Scarlet",
        description: "Layer Evil Sunz Scarlet on the raised robe surfaces, building up from the Mephiston Red base toward the edges.",
        technique: "Layering",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "evil-sunz-scarlet", role: "primary" }],
      },
      {
        title: "Basecoat armour with Mechanicus Standard Grey",
        description: "Apply Mechanicus Standard Grey to all the armour plates — cowls, vambraces, and any augmetic components.",
        technique: "Basecoat",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "mechanicus-standard-grey", role: "primary" }],
      },
      {
        title: "Shade armour with Nuln Oil",
        description: "Wash Nuln Oil over all armour and metallic parts. Keep it away from the red fabric.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "nuln-oil", role: "primary" }],
      },
      {
        title: "Highlight armour with Dawnstone",
        description: "Layer Dawnstone on the raised armour edges. Then apply a finer Administratum Grey highlight on the sharpest edges.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "dawnstone", role: "primary" },
          { brandSlug: "citadel", paintSlug: "administratum-grey", role: "secondary" },
        ],
      },
    ],
  },

  // ─── Chaos Daemons ──────────────────────────────────────────────────────────
  {
    slug: "bloodletters-of-khorne",
    title: "Bloodletters of Khorne",
    description: "The crimson lesser daemons of the Blood God — blood-red skin, obsidian horns, and brass hellblades. Fast and brutal to paint.",
    factionSlug: "chaos-daemons",
    difficulty: "BEGINNER",
    technique: "Base-Shade-Highlight",
    steps: [
      {
        title: "Prime black",
        description: "Apply Abaddon Black as a basecoat. Red over black is deeper and more menacing — perfect for daemons of Khorne.",
        technique: "Priming/Basecoat",
        duration: "5 min",
        paints: [{ brandSlug: "citadel", paintSlug: "abaddon-black", role: "primary" }],
      },
      {
        title: "Basecoat skin with Mephiston Red",
        description: "Apply two thin coats of Mephiston Red over all the skin. The black will show through slightly — this adds depth.",
        technique: "Basecoat",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "mephiston-red", role: "primary" }],
      },
      {
        title: "Shade with Carroburg Crimson",
        description: "Wash Carroburg Crimson into all the muscle definition and recesses. Let it pool deeply in the bodily textures.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "carroburg-crimson", role: "primary" }],
      },
      {
        title: "Layer with Evil Sunz Scarlet",
        description: "Apply Evil Sunz Scarlet to the raised muscle surfaces, building brightness toward the edges and knuckles.",
        technique: "Layering",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "evil-sunz-scarlet", role: "primary" }],
      },
      {
        title: "Highlight with Wild Rider Red",
        description: "Apply Wild Rider Red as a bright highlight on the very tips of muscles, fingers, and facial horns.",
        technique: "Highlighting",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "wild-rider-red", role: "primary" }],
      },
      {
        title: "Add gore with Blood for the Blood God",
        description: "Apply Blood for the Blood God to the hellblade, clawed hands, and any wounds for a freshly-blooded effect.",
        technique: "Technical paint",
        duration: "5 min",
        paints: [{ brandSlug: "citadel", paintSlug: "blood-for-the-blood-god", role: "primary" }],
      },
    ],
  },
  {
    slug: "plaguebearers-of-nurgle",
    title: "Plaguebearers of Nurgle",
    description: "The bloated, festering lesser daemons of Nurgle. Uses Contrast paint for the diseased skin and technical paints for convincing rot effects.",
    factionSlug: "chaos-daemons",
    difficulty: "BEGINNER",
    technique: "Contrast + Technical Paints",
    steps: [
      {
        title: "Prime with Wraithbone",
        description: "Apply Wraithbone as a base. The warm off-white underpins the yellow-green Contrast skin perfectly.",
        technique: "Priming",
        duration: "5 min + 20 min drying",
        paints: [{ brandSlug: "citadel", paintSlug: "wraithbone", role: "primary" }],
      },
      {
        title: "Apply Death Guard Green to skin",
        description: "Apply Death Guard Green Contrast over all the skin. It will pool magnificently in all the pustule recesses and wrinkles.",
        technique: "Contrast application",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "death-guard-green", role: "primary" }],
      },
      {
        title: "Shade with Athonian Camoshade",
        description: "Wash Athonian Camoshade into the deepest folds and recesses to push down the shadow areas and add a sickly green tint.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "athonian-camoshade", role: "primary" }],
      },
      {
        title: "Drybrush with Ushabti Bone",
        description: "Lightly drybrush Ushabti Bone over the entire skin surface to pick out the raised detail and suggest a sickly, pale cast.",
        technique: "Drybrushing",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "ushabti-bone", role: "primary" }],
      },
      {
        title: "Apply Nurgle's Rot to open wounds",
        description: "Dab Nurgle's Rot into all the open sores, sword wound, and any oozing orifices. This technical paint is self-shading and looks immediately convincing.",
        technique: "Technical paint",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "nurgles-rot", role: "primary" }],
      },
    ],
  },

  // ─── Drukhari ──────────────────────────────────────────────────────────────
  {
    slug: "kabalite-warriors",
    title: "Drukhari Kabalite Warriors",
    description: "The sinister dark eldar in their teal-black void armour. Striking colour scheme achieved through careful layering from dark to light.",
    factionSlug: "drukhari",
    difficulty: "INTERMEDIATE",
    technique: "Layering",
    steps: [
      {
        title: "Basecoat with Incubi Darkness",
        description: "Apply two thin coats of Incubi Darkness over all armour. This deep teal-black is the classic Kabalite armour colour.",
        technique: "Basecoat",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "incubi-darkness", role: "primary" }],
      },
      {
        title: "Shade with Nuln Oil",
        description: "Apply Nuln Oil into all the armour recesses and panel lines. This pushes the shadows very dark and makes the subsequent highlights pop.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "nuln-oil", role: "primary" }],
      },
      {
        title: "Layer with Kabalite Green",
        description: "Apply Kabalite Green to the upper surfaces of each armour panel, leaving the recesses in the darker Incubi Darkness tone.",
        technique: "Layering",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "kabalite-green", role: "primary" }],
      },
      {
        title: "Highlight with Sybarite Green",
        description: "Apply Sybarite Green to the raised edges and most prominent features of each armour panel.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "sybarite-green", role: "primary" }],
      },
      {
        title: "Paint skin with Pallid Wych Flesh",
        description: "Basecoat any exposed skin with Pallid Wych Flesh. Wash with Druchii Violet for a cold, undead-pale skin tone.",
        technique: "Basecoat + Wash",
        duration: "10 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "pallid-wych-flesh", role: "primary" },
          { brandSlug: "citadel", paintSlug: "druchii-violet", role: "shade" },
        ],
      },
    ],
  },

  // ─── Thousand Sons ──────────────────────────────────────────────────────────
  {
    slug: "thousand-sons-rubric-marine",
    title: "Thousand Sons Rubric Marine",
    description: "The ornate, automaton warriors of the Thousand Sons — rich cobalt blue armour with gleaming gold trim. One of the most visually striking schemes in 40k.",
    factionSlug: "thousand-sons",
    difficulty: "INTERMEDIATE",
    technique: "Base-Shade-Highlight",
    steps: [
      {
        title: "Prime black",
        description: "Apply Abaddon Black as a basecoat. Blue over black has more depth and jewel-like quality than blue over white.",
        technique: "Priming/Basecoat",
        duration: "5 min",
        paints: [{ brandSlug: "citadel", paintSlug: "abaddon-black", role: "primary" }],
      },
      {
        title: "Basecoat with Macragge Blue",
        description: "Apply two careful coats of Macragge Blue over all armour panels. Take your time — Thousand Sons marines are ornate and have many surfaces.",
        technique: "Basecoat",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "macragge-blue", role: "primary" }],
      },
      {
        title: "Shade with Drakenhof Nightshade",
        description: "Wash Drakenhof Nightshade into all the recesses. It deepens the blue toward indigo in the shadows, which is authentic to the Thousand Sons look.",
        technique: "Shade wash",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "drakenhof-nightshade", role: "primary" }],
      },
      {
        title: "Layer with Altdorf Guard Blue",
        description: "Re-establish the mid-tone by applying Altdorf Guard Blue to raised panel surfaces.",
        technique: "Layering",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "altdorf-guard-blue", role: "primary" }],
      },
      {
        title: "Edge highlight with Calgar Blue",
        description: "Apply Calgar Blue along all the sharp armour edges and panel lines for a crisp highlight.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "calgar-blue", role: "primary" }],
      },
      {
        title: "Paint gold trim with Retributor Armour",
        description: "Carefully apply Retributor Armour to all the extensive gold trim, scrollwork, and icons. The gold is what makes Thousand Sons look magnificent.",
        technique: "Detail painting",
        duration: "15 min",
        paints: [{ brandSlug: "citadel", paintSlug: "retributor-armour", role: "primary" }],
      },
      {
        title: "Shade gold with Seraphim Sepia",
        description: "Wash Seraphim Sepia into the gold trim recesses for a warm, antique gold look befitting ancient sorcerers.",
        technique: "Targeted wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "seraphim-sepia", role: "primary" }],
      },
    ],
  },

  // ─── World Eaters ──────────────────────────────────────────────────────────
  {
    slug: "world-eaters-berserker",
    title: "World Eaters Berserker",
    description: "The maddened warriors of Khorne's own Legion — white and blue armour perpetually drenched in crimson gore. Deliberately frenzied and brutal.",
    factionSlug: "world-eaters",
    difficulty: "BEGINNER",
    technique: "Contrast + Technical Paints",
    steps: [
      {
        title: "Prime with Grey Seer",
        description: "Apply a Grey Seer basecoat. The World Eaters' white armour starts with a light grey base for better contrast with the blue panels.",
        technique: "Priming",
        duration: "5 min + 20 min drying",
        paints: [{ brandSlug: "citadel", paintSlug: "grey-seer", role: "primary" }],
      },
      {
        title: "Apply Apothecary White to armour panels",
        description: "Apply Apothecary White Contrast to all the white armour areas. It creates a naturally shaded, battle-worn white in a single coat.",
        technique: "Contrast application",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "apothecary-white", role: "primary" }],
      },
      {
        title: "Paint blue trim panels",
        description: "Basecoat the blue trim panels with Macragge Blue, then apply a targeted shade of Drakenhof Nightshade into the recesses.",
        technique: "Basecoat + Shade",
        duration: "12 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "macragge-blue", role: "primary" },
          { brandSlug: "citadel", paintSlug: "drakenhof-nightshade", role: "shade" },
        ],
      },
      {
        title: "Add Blood for the Blood God liberally",
        description: "Apply Blood for the Blood God across the entire model — armour, chainaxes, chain teeth, and the base. World Eaters are never clean. Be generous.",
        technique: "Technical paint",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "blood-for-the-blood-god", role: "primary" }],
      },
    ],
  },

  // ─── Adepta Sororitas ──────────────────────────────────────────────────────
  {
    slug: "battle-sisters-armour",
    title: "Adepta Sororitas Battle Sister",
    description: "The power-armoured warriors of the Ecclesiarchy in their iconic red and black with gold iconography — faith made manifest in ceramite.",
    factionSlug: "sisters-of-battle",
    difficulty: "INTERMEDIATE",
    technique: "Base-Shade-Highlight",
    steps: [
      {
        title: "Basecoat armour with Mephiston Red",
        description: "Apply two thin coats of Mephiston Red over all armour panels. The red armour is the primary visual element of the Battle Sister.",
        technique: "Basecoat",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "mephiston-red", role: "primary" }],
      },
      {
        title: "Shade with Carroburg Crimson",
        description: "Wash Carroburg Crimson into all armour recesses and panel lines. Let it flow into every joint and seam.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "carroburg-crimson", role: "primary" }],
      },
      {
        title: "Layer with Evil Sunz Scarlet",
        description: "Apply Evil Sunz Scarlet to the raised armour surfaces, recovering the brightness that the shade reduced.",
        technique: "Layering",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "evil-sunz-scarlet", role: "primary" }],
      },
      {
        title: "Paint cloth and tabard with Abaddon Black",
        description: "Apply Abaddon Black to the cloth under-armour, tabards, and any fabric elements. The black provides strong contrast against the red.",
        technique: "Basecoat",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "abaddon-black", role: "primary" }],
      },
      {
        title: "Paint iconography with Retributor Armour",
        description: "Carefully apply Retributor Armour to all the Ecclesiarchy symbols, fleur-de-lis, scrollwork, and decorative trim. The gold is what elevates the model.",
        technique: "Detail painting",
        duration: "15 min",
        paints: [{ brandSlug: "citadel", paintSlug: "retributor-armour", role: "primary" }],
      },
      {
        title: "Shade gold with Seraphim Sepia",
        description: "Wash Seraphim Sepia into the gold detail recesses to add warmth and definition.",
        technique: "Targeted wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "seraphim-sepia", role: "primary" }],
      },
      {
        title: "Edge highlight red with Wild Rider Red",
        description: "Apply Wild Rider Red as a final edge highlight on the sharpest armour edges for a blazing, hot highlight.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "wild-rider-red", role: "primary" }],
      },
    ],
  },

  // ─── Grey Knights ──────────────────────────────────────────────────────────
  {
    slug: "grey-knights-strike-marine",
    title: "Grey Knights Strike Marine",
    description: "The silver-armoured daemon hunters of the Ordo Malleus. Achieving convincing silver power armour with depth and light requires careful layering.",
    factionSlug: "grey-knights",
    difficulty: "INTERMEDIATE",
    technique: "Layering + Drybrushing",
    steps: [
      {
        title: "Prime black",
        description: "Apply Abaddon Black as a basecoat. Metal over black has much more depth than metal over grey.",
        technique: "Priming/Basecoat",
        duration: "5 min",
        paints: [{ brandSlug: "citadel", paintSlug: "abaddon-black", role: "primary" }],
      },
      {
        title: "Drybrush Mechanicus Standard Grey",
        description: "Drybrush Mechanicus Standard Grey over all armour surfaces with a wide, stiff brush. This forms the primary grey tone.",
        technique: "Drybrushing",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "mechanicus-standard-grey", role: "primary" }],
      },
      {
        title: "Drybrush Ironbreaker",
        description: "Drybrush Ironbreaker metallic paint over the armour. Use moderate pressure to pick up the raised areas and edges.",
        technique: "Drybrushing",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "ironbreaker", role: "primary" }],
      },
      {
        title: "Shade with Nuln Oil",
        description: "Apply Nuln Oil into all recesses, panel lines, and joints. This pulls the armour back to a cool, steely tone.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "nuln-oil", role: "primary" }],
      },
      {
        title: "Highlight with Runefang Steel",
        description: "Apply Runefang Steel as bright highlights on the sharpest armour edges, crests, and raised detail.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "runefang-steel", role: "primary" }],
      },
      {
        title: "Final highlight with Stormhost Silver",
        description: "Apply a bright, fine line of Stormhost Silver on the absolute sharpest armour edges — knee caps, shoulder rims, and weapon edges.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "stormhost-silver", role: "primary" }],
      },
      {
        title: "Paint force sword",
        description: "Basecoat the force sword with Corax White, then apply Aethermatic Blue Contrast over it for an instant glowing blade effect.",
        technique: "Contrast application",
        duration: "8 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "corax-white", role: "primary" },
          { brandSlug: "citadel", paintSlug: "aethermatic-blue", role: "secondary" },
        ],
      },
    ],
  },

  // ─── Orks — advanced scheme ────────────────────────────────────────────────
  {
    slug: "ork-warboss-armour",
    title: "Ork Warboss — Looted Armour",
    description: "A heavily weathered, scrappy Warboss in salvaged metal armour — the Ork aesthetic of brutal improvisation rendered in paint.",
    factionSlug: "orks",
    difficulty: "INTERMEDIATE",
    technique: "Weathering + Technical Paints",
    steps: [
      {
        title: "Ork skin with Ork Flesh Contrast",
        description: "Apply Ork Flesh Contrast over a Wraithbone basecoat for fast, effective green skin coverage across the Warboss's exposed muscle.",
        technique: "Contrast application",
        duration: "10 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "wraithbone", role: "primary" },
          { brandSlug: "citadel", paintSlug: "ork-flesh", role: "secondary" },
        ],
      },
      {
        title: "Drybrush skin with Skarsnik Green",
        description: "Drybrush Skarsnik Green over the skin to pick out muscles, tusks, and prominent facial features.",
        technique: "Drybrushing",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "skarsnik-green", role: "primary" }],
      },
      {
        title: "Basecoat armour plates with Ironbreaker",
        description: "Apply Ironbreaker to all the salvaged armour plates. Ork armour is mismatched scrap metal — varied coverage is fine.",
        technique: "Basecoat",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "ironbreaker", role: "primary" }],
      },
      {
        title: "Shade with Nuln Oil",
        description: "Heavily wash Nuln Oil over all the metal armour. Ork armour is grimy and dark — don't hold back.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "nuln-oil", role: "primary" }],
      },
      {
        title: "Stipple rust patches",
        description: "Using an old, splayed brush, stipple a mix of Mournfang Brown and Jokaero Orange rust patches across the armour. More rust than you'd think looks right.",
        technique: "Stippling",
        duration: "12 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "mournfang-brown", role: "primary" },
          { brandSlug: "citadel", paintSlug: "jokaero-orange", role: "secondary" },
        ],
      },
      {
        title: "Apply Typhus Corrosion to damage",
        description: "Dab Typhus Corrosion over bullet holes, dents, and damage points for added gritty texture.",
        technique: "Technical paint",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "typhus-corrosion", role: "primary" }],
      },
      {
        title: "Bright metallic edge chipping",
        description: "Drybrush Runefang Steel on the edges and raised areas of armour plates to suggest chipped, bare metal on the most-used surfaces.",
        technique: "Drybrushing",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "runefang-steel", role: "primary" }],
      },
    ],
  },

  // ─── Chaos Space Marines — Iron Warriors ──────────────────────────────────
  {
    slug: "iron-warriors-legionnaire",
    title: "Iron Warriors Legionnaire",
    description: "The merciless siege specialists of the IV Legion in their cold, burnished iron armour with hazard stripe accents. Minimal colour, maximum impact.",
    factionSlug: "chaos-space-marines",
    difficulty: "INTERMEDIATE",
    technique: "Layering + Weathering",
    steps: [
      {
        title: "Prime black",
        description: "Apply Abaddon Black as a basecoat. All that iron will need a dark foundation for maximum metallic depth.",
        technique: "Priming/Basecoat",
        duration: "5 min",
        paints: [{ brandSlug: "citadel", paintSlug: "abaddon-black", role: "primary" }],
      },
      {
        title: "Drybrush Ironbreaker over armour",
        description: "Drybrush Ironbreaker heavily over all armour surfaces. Use a broad brush and keep plenty of paint loaded for the first pass.",
        technique: "Drybrushing",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "ironbreaker", role: "primary" }],
      },
      {
        title: "Shade with Nuln Oil",
        description: "Apply Nuln Oil into all recesses, rivets, and panel lines. Allow the excess to pool in the deepest areas.",
        technique: "Shade wash",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "nuln-oil", role: "primary" }],
      },
      {
        title: "Layer raised armour with Dawnstone",
        description: "Layer Dawnstone on the flat raised panels, slightly darkening the metallic sheen to a cold iron tone.",
        technique: "Layering",
        duration: "10 min",
        paints: [{ brandSlug: "citadel", paintSlug: "dawnstone", role: "primary" }],
      },
      {
        title: "Bright highlight with Stormhost Silver",
        description: "Apply Stormhost Silver as an edge highlight on all sharpest edges — shoulder rims, knee pads, and weapon casings.",
        technique: "Edge highlighting",
        duration: "12 min",
        paints: [{ brandSlug: "citadel", paintSlug: "stormhost-silver", role: "primary" }],
      },
      {
        title: "Paint hazard stripes",
        description: "Apply Averland Sunset to the stripe area, then carefully paint Abaddon Black diagonal stripes over it once dry for the classic Iron Warriors hazard markings.",
        technique: "Freehand",
        duration: "15 min",
        paints: [
          { brandSlug: "citadel", paintSlug: "averland-sunset", role: "primary" },
          { brandSlug: "citadel", paintSlug: "abaddon-black", role: "secondary" },
        ],
      },
      {
        title: "Weather with Typhus Corrosion",
        description: "Stipple Typhus Corrosion into dents and damage areas. Iron Warriors armour is ancient and battered from ten thousand years of siege warfare.",
        technique: "Weathering",
        duration: "8 min",
        paints: [{ brandSlug: "citadel", paintSlug: "typhus-corrosion", role: "primary" }],
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
