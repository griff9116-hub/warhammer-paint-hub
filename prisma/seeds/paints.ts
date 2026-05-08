import { PrismaClient } from "@prisma/client";
import { hexToLab } from "../../lib/paint-hub/color";

type PaintInput = {
  slug: string;
  name: string;
  hex: string;
  finish: string;
  category: string;
  range: string;
};

type BrandInput = {
  slug: string;
  name: string;
  website: string;
  paints: PaintInput[];
};

const BRANDS: BrandInput[] = [
  {
    slug: "citadel",
    name: "Citadel",
    website: "https://www.games-workshop.com",
    paints: [
      // Base
      { slug: "abaddon-black", name: "Abaddon Black", hex: "#231F20", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "mephiston-red", name: "Mephiston Red", hex: "#8C1515", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "macragge-blue", name: "Macragge Blue", hex: "#0D407F", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "caliban-green", name: "Caliban Green", hex: "#1A4A2E", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "averland-sunset", name: "Averland Sunset", hex: "#EFA120", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "zandri-dust", name: "Zandri Dust", hex: "#B5A96A", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "mechanicus-standard-grey", name: "Mechanicus Standard Grey", hex: "#595959", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "retributor-armour", name: "Retributor Armour", hex: "#B5933A", finish: "METALLIC", category: "BASE", range: "Base" },
      { slug: "corax-white", name: "Corax White", hex: "#E8E8E8", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "celestra-grey", name: "Celestra Grey", hex: "#9EAFA4", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "bugmans-glow", name: "Bugman's Glow", hex: "#7C4035", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "rakarth-flesh", name: "Rakarth Flesh", hex: "#B8A89A", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "jokaero-orange", name: "Jokaero Orange", hex: "#D6501A", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "screamer-pink", name: "Screamer Pink", hex: "#9C2A5C", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "naggaroth-night", name: "Naggaroth Night", hex: "#3D2B5E", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "kantor-blue", name: "Kantor Blue", hex: "#0B2D5F", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "incubi-darkness", name: "Incubi Darkness", hex: "#1C4A45", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "rhinox-hide", name: "Rhinox Hide", hex: "#4A2B1C", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "mournfang-brown", name: "Mournfang Brown", hex: "#6B2E15", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "steel-legion-drab", name: "Steel Legion Drab", hex: "#7A6E48", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "death-world-forest", name: "Death World Forest", hex: "#5C6B3D", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "grey-seer", name: "Grey Seer", hex: "#C8C8C8", finish: "MATTE", category: "BASE", range: "Base" },
      { slug: "wraithbone", name: "Wraithbone", hex: "#E8DCBE", finish: "MATTE", category: "BASE", range: "Base" },
      // Shade
      { slug: "nuln-oil", name: "Nuln Oil", hex: "#282828", finish: "SATIN", category: "SHADE", range: "Shade" },
      { slug: "agrax-earthshade", name: "Agrax Earthshade", hex: "#3D2B15", finish: "SATIN", category: "SHADE", range: "Shade" },
      { slug: "reikland-fleshshade", name: "Reikland Fleshshade", hex: "#A0542A", finish: "SATIN", category: "SHADE", range: "Shade" },
      { slug: "druchii-violet", name: "Druchii Violet", hex: "#5A3070", finish: "SATIN", category: "SHADE", range: "Shade" },
      { slug: "biel-tan-green", name: "Biel-Tan Green", hex: "#2D5A30", finish: "SATIN", category: "SHADE", range: "Shade" },
      { slug: "carroburg-crimson", name: "Carroburg Crimson", hex: "#6B1A2A", finish: "SATIN", category: "SHADE", range: "Shade" },
      { slug: "seraphim-sepia", name: "Seraphim Sepia", hex: "#8C6020", finish: "SATIN", category: "SHADE", range: "Shade" },
      { slug: "coelia-greenshade", name: "Coelia Greenshade", hex: "#285040", finish: "SATIN", category: "SHADE", range: "Shade" },
      { slug: "drakenhof-nightshade", name: "Drakenhof Nightshade", hex: "#1A2A5E", finish: "SATIN", category: "SHADE", range: "Shade" },
      { slug: "fuegan-orange", name: "Fuegan Orange", hex: "#8C3A10", finish: "SATIN", category: "SHADE", range: "Shade" },
      { slug: "athonian-camoshade", name: "Athonian Camoshade", hex: "#4A5A28", finish: "SATIN", category: "SHADE", range: "Shade" },
      { slug: "casandora-yellow", name: "Casandora Yellow", hex: "#C87A00", finish: "SATIN", category: "SHADE", range: "Shade" },
      // Layer
      { slug: "evil-sunz-scarlet", name: "Evil Sunz Scarlet", hex: "#C42024", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "wild-rider-red", name: "Wild Rider Red", hex: "#E03A18", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "skarsnik-green", name: "Skarsnik Green", hex: "#4E8C50", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "loren-forest", name: "Loren Forest", hex: "#3C6E3C", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "altdorf-guard-blue", name: "Altdorf Guard Blue", hex: "#2A4A90", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "calgar-blue", name: "Calgar Blue", hex: "#3A5FAA", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "ulthuan-grey", name: "Ulthuan Grey", hex: "#C8D8D8", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "ushabti-bone", name: "Ushabti Bone", hex: "#C8B878", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "screaming-skull", name: "Screaming Skull", hex: "#D8C890", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "auric-armour-gold", name: "Auric Armour Gold", hex: "#C89820", finish: "METALLIC", category: "LAYER", range: "Layer" },
      { slug: "runefang-steel", name: "Runefang Steel", hex: "#C0C8D0", finish: "METALLIC", category: "LAYER", range: "Layer" },
      { slug: "stormhost-silver", name: "Stormhost Silver", hex: "#D8E0E8", finish: "METALLIC", category: "LAYER", range: "Layer" },
      { slug: "liberator-gold", name: "Liberator Gold", hex: "#B8902A", finish: "METALLIC", category: "LAYER", range: "Layer" },
      { slug: "kabalite-green", name: "Kabalite Green", hex: "#288050", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "sybarite-green", name: "Sybarite Green", hex: "#38A862", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "xereus-purple", name: "Xereus Purple", hex: "#5A2878", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "genestealer-purple", name: "Genestealer Purple", hex: "#7A40A0", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "troll-slayer-orange", name: "Troll Slayer Orange", hex: "#E05010", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "flash-gitz-yellow", name: "Flash Gitz Yellow", hex: "#F0C800", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "yriel-yellow", name: "Yriel Yellow", hex: "#F0A800", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "dawnstone", name: "Dawnstone", hex: "#808080", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "administratum-grey", name: "Administratum Grey", hex: "#A0A8A8", finish: "MATTE", category: "LAYER", range: "Layer" },
      { slug: "white-scar", name: "White Scar", hex: "#F8F8F8", finish: "MATTE", category: "LAYER", range: "Layer" },
      // Contrast
      { slug: "black-templar", name: "Black Templar", hex: "#1A1A1A", finish: "CONTRAST", category: "CONTRAST", range: "Contrast" },
      { slug: "skeleton-horde", name: "Skeleton Horde", hex: "#C8A840", finish: "CONTRAST", category: "CONTRAST", range: "Contrast" },
      { slug: "nazdreg-yellow", name: "Nazdreg Yellow", hex: "#D89010", finish: "CONTRAST", category: "CONTRAST", range: "Contrast" },
      { slug: "gryph-charger-grey", name: "Gryph-charger Grey", hex: "#6A7A88", finish: "CONTRAST", category: "CONTRAST", range: "Contrast" },
      { slug: "magos-purple", name: "Magos Purple", hex: "#502870", finish: "CONTRAST", category: "CONTRAST", range: "Contrast" },
      { slug: "talassar-blue", name: "Talassar Blue", hex: "#1A3870", finish: "CONTRAST", category: "CONTRAST", range: "Contrast" },
      { slug: "militarum-green", name: "Militarum Green", hex: "#3A5830", finish: "CONTRAST", category: "CONTRAST", range: "Contrast" },
      { slug: "gore-grunta-fur", name: "Gore-grunta Fur", hex: "#7A4020", finish: "CONTRAST", category: "CONTRAST", range: "Contrast" },
      { slug: "blood-angels-red", name: "Blood Angels Red", hex: "#901010", finish: "CONTRAST", category: "CONTRAST", range: "Contrast" },
      { slug: "ultramarines-blue", name: "Ultramarines Blue", hex: "#0A2890", finish: "CONTRAST", category: "CONTRAST", range: "Contrast" },
      { slug: "ork-flesh", name: "Ork Flesh", hex: "#406030", finish: "CONTRAST", category: "CONTRAST", range: "Contrast" },
      { slug: "cygor-brown", name: "Cygor Brown", hex: "#502010", finish: "CONTRAST", category: "CONTRAST", range: "Contrast" },
      // Technical
      { slug: "nihilakh-oxide", name: "Nihilakh Oxide", hex: "#70B0A0", finish: "TECHNICAL", category: "TECHNICAL", range: "Technical" },
      { slug: "typhus-corrosion", name: "Typhus Corrosion", hex: "#3A3020", finish: "TECHNICAL", category: "TECHNICAL", range: "Technical" },
      { slug: "blood-for-the-blood-god", name: "Blood for the Blood God", hex: "#800010", finish: "TECHNICAL", category: "TECHNICAL", range: "Technical" },
      { slug: "ardcoat", name: "Ardcoat", hex: "#F0F0F0", finish: "SATIN", category: "TECHNICAL", range: "Technical" },
      { slug: "agrellan-earth", name: "Agrellan Earth", hex: "#9A8060", finish: "MATTE", category: "TECHNICAL", range: "Technical" },
      // Dry
      { slug: "praxeti-white", name: "Praxeti White", hex: "#F0F0F0", finish: "MATTE", category: "DRY", range: "Dry" },
      { slug: "longbeard-grey", name: "Longbeard Grey", hex: "#B8B8B8", finish: "MATTE", category: "DRY", range: "Dry" },
      { slug: "necron-compound", name: "Necron Compound", hex: "#A0A8B0", finish: "MATTE", category: "DRY", range: "Dry" },
      { slug: "tyrant-skull", name: "Tyrant Skull", hex: "#D0C898", finish: "MATTE", category: "DRY", range: "Dry" },
    ],
  },
  {
    slug: "vallejo",
    name: "Vallejo Model Color",
    website: "https://www.acrylicosvallejo.com",
    paints: [
      { slug: "flat-black", name: "Flat Black", hex: "#1A1A1A", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "white", name: "White", hex: "#F5F5F5", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "german-grey", name: "German Grey", hex: "#3A3A3A", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "us-field-drab", name: "US Field Drab", hex: "#7A6840", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "russian-uniform", name: "Russian Uniform", hex: "#5A6840", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "khaki", name: "Khaki", hex: "#C0A860", finish: "MATTE", category: "LAYER", range: "Model Color" },
      { slug: "ivory", name: "Ivory", hex: "#F0E8C0", finish: "MATTE", category: "LAYER", range: "Model Color" },
      { slug: "basic-skin-tone", name: "Basic Skin Tone", hex: "#D8A880", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "sky-grey", name: "Sky Grey", hex: "#9AB0C0", finish: "MATTE", category: "LAYER", range: "Model Color" },
      { slug: "scarlet", name: "Scarlet", hex: "#C01818", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "deep-sky-blue", name: "Deep Sky Blue", hex: "#1868B8", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "medium-sea-grey", name: "Medium Sea Grey", hex: "#688088", finish: "MATTE", category: "LAYER", range: "Model Color" },
      { slug: "chocolate-brown", name: "Chocolate Brown", hex: "#502018", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "gold", name: "Gold", hex: "#C8981A", finish: "METALLIC", category: "LAYER", range: "Model Color" },
      { slug: "silver", name: "Silver", hex: "#C0C8D0", finish: "METALLIC", category: "LAYER", range: "Model Color" },
      { slug: "green-ochre", name: "Green Ochre", hex: "#909050", finish: "MATTE", category: "LAYER", range: "Model Color" },
      { slug: "buff", name: "Buff", hex: "#D8C098", finish: "MATTE", category: "LAYER", range: "Model Color" },
      { slug: "tan-yellow", name: "Tan Yellow", hex: "#C8A048", finish: "MATTE", category: "LAYER", range: "Model Color" },
      { slug: "prussian-blue", name: "Prussian Blue", hex: "#0A2040", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "dark-green", name: "Dark Green", hex: "#183818", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "flat-red", name: "Flat Red", hex: "#B01010", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "orange", name: "Orange", hex: "#D86010", finish: "MATTE", category: "LAYER", range: "Model Color" },
      { slug: "dark-prussian-blue", name: "Dark Prussian Blue", hex: "#081830", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "pale-sand", name: "Pale Sand", hex: "#E0D0A8", finish: "MATTE", category: "LAYER", range: "Model Color" },
      { slug: "yellow", name: "Yellow", hex: "#F0C000", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "medium-grey", name: "Medium Grey", hex: "#808080", finish: "MATTE", category: "LAYER", range: "Model Color" },
      { slug: "dark-sea-grey", name: "Dark Sea Grey", hex: "#506870", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "bronze", name: "Bronze", hex: "#A06820", finish: "METALLIC", category: "LAYER", range: "Model Color" },
      { slug: "gunmetal", name: "Gunmetal", hex: "#505870", finish: "METALLIC", category: "BASE", range: "Model Color" },
      { slug: "purple", name: "Purple", hex: "#602878", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "rose", name: "Rose", hex: "#D86080", finish: "MATTE", category: "LAYER", range: "Model Color" },
      { slug: "flat-earth", name: "Flat Earth", hex: "#7A5838", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "oily-steel", name: "Oily Steel", hex: "#6870A0", finish: "METALLIC", category: "LAYER", range: "Model Color" },
      { slug: "dark-rubber", name: "Dark Rubber", hex: "#282828", finish: "MATTE", category: "BASE", range: "Model Color" },
      { slug: "beige-brown", name: "Beige Brown", hex: "#A88058", finish: "MATTE", category: "LAYER", range: "Model Color" },
    ],
  },
  {
    slug: "army-painter",
    name: "Army Painter",
    website: "https://www.thearmypainter.com",
    paints: [
      // Speedpaint 2.0
      { slug: "grim-black", name: "Grim Black", hex: "#181818", finish: "CONTRAST", category: "CONTRAST", range: "Speedpaint 2.0" },
      { slug: "crusader-skin", name: "Crusader Skin", hex: "#C89068", finish: "CONTRAST", category: "CONTRAST", range: "Speedpaint 2.0" },
      { slug: "holy-white", name: "Holy White", hex: "#DCDCDC", finish: "CONTRAST", category: "CONTRAST", range: "Speedpaint 2.0" },
      { slug: "wizard-grey", name: "Wizard Grey", hex: "#707880", finish: "CONTRAST", category: "CONTRAST", range: "Speedpaint 2.0" },
      { slug: "hardened-leather", name: "Hardened Leather", hex: "#8A5830", finish: "CONTRAST", category: "CONTRAST", range: "Speedpaint 2.0" },
      { slug: "battleground-brown", name: "Battleground Brown", hex: "#5A3818", finish: "CONTRAST", category: "CONTRAST", range: "Speedpaint 2.0" },
      { slug: "runic-grey", name: "Runic Grey", hex: "#505860", finish: "CONTRAST", category: "CONTRAST", range: "Speedpaint 2.0" },
      { slug: "swamp-goblin-green", name: "Swamp Goblin Green", hex: "#3A6030", finish: "CONTRAST", category: "CONTRAST", range: "Speedpaint 2.0" },
      { slug: "cloudburst-blue", name: "Cloudburst Blue", hex: "#1A3870", finish: "CONTRAST", category: "CONTRAST", range: "Speedpaint 2.0" },
      { slug: "bony-matter", name: "Bony Matter", hex: "#C8A860", finish: "CONTRAST", category: "CONTRAST", range: "Speedpaint 2.0" },
      { slug: "burning-corruption", name: "Burning Corruption", hex: "#702010", finish: "CONTRAST", category: "CONTRAST", range: "Speedpaint 2.0" },
      { slug: "slaughter-red", name: "Slaughter Red", hex: "#980818", finish: "CONTRAST", category: "CONTRAST", range: "Speedpaint 2.0" },
      // Warpaints
      { slug: "matt-black", name: "Matt Black", hex: "#1E1E1E", finish: "MATTE", category: "BASE", range: "Warpaints" },
      { slug: "pure-red", name: "Pure Red", hex: "#C01010", finish: "MATTE", category: "BASE", range: "Warpaints" },
      { slug: "uniform-grey", name: "Uniform Grey", hex: "#606060", finish: "MATTE", category: "BASE", range: "Warpaints" },
      { slug: "oak-brown", name: "Oak Brown", hex: "#6A3A18", finish: "MATTE", category: "BASE", range: "Warpaints" },
      { slug: "army-green", name: "Army Green", hex: "#386030", finish: "MATTE", category: "BASE", range: "Warpaints" },
      { slug: "matt-white", name: "Matt White", hex: "#F0F0F0", finish: "MATTE", category: "BASE", range: "Warpaints" },
      { slug: "dark-tone-ink", name: "Dark Tone Ink", hex: "#242424", finish: "SATIN", category: "SHADE", range: "Warpaints" },
      { slug: "strong-tone-ink", name: "Strong Tone Ink", hex: "#3A2808", finish: "SATIN", category: "SHADE", range: "Warpaints" },
      { slug: "soft-tone-ink", name: "Soft Tone Ink", hex: "#9A6020", finish: "SATIN", category: "SHADE", range: "Warpaints" },
      { slug: "blue-tone-ink", name: "Blue Tone Ink", hex: "#1A2A60", finish: "SATIN", category: "SHADE", range: "Warpaints" },
      { slug: "green-tone-ink", name: "Green Tone Ink", hex: "#1A3820", finish: "SATIN", category: "SHADE", range: "Warpaints" },
      { slug: "red-tone-ink", name: "Red Tone Ink", hex: "#601018", finish: "SATIN", category: "SHADE", range: "Warpaints" },
      { slug: "mithril-silver", name: "Mithril Silver", hex: "#C0C8D0", finish: "METALLIC", category: "LAYER", range: "Warpaints" },
      { slug: "shining-silver", name: "Shining Silver", hex: "#D0D8E0", finish: "METALLIC", category: "LAYER", range: "Warpaints" },
      { slug: "weapon-bronze", name: "Weapon Bronze", hex: "#9A6818", finish: "METALLIC", category: "LAYER", range: "Warpaints" },
      { slug: "greedy-gold", name: "Greedy Gold", hex: "#C09010", finish: "METALLIC", category: "LAYER", range: "Warpaints" },
      { slug: "wolf-grey", name: "Wolf Grey", hex: "#8898A8", finish: "MATTE", category: "LAYER", range: "Warpaints" },
      { slug: "skeleton-bone", name: "Skeleton Bone", hex: "#D0C088", finish: "MATTE", category: "LAYER", range: "Warpaints" },
    ],
  },
];

// Official cross-brand equivalents (fromSlug => toSlug)
type EquivInput = { from: [string, string]; to: [string, string] };
const OFFICIAL_EQUIVALENTS: EquivInput[] = [
  { from: ["citadel", "abaddon-black"],       to: ["vallejo", "flat-black"] },
  { from: ["citadel", "abaddon-black"],       to: ["army-painter", "matt-black"] },
  { from: ["citadel", "mephiston-red"],       to: ["vallejo", "scarlet"] },
  { from: ["citadel", "mephiston-red"],       to: ["army-painter", "pure-red"] },
  { from: ["citadel", "corax-white"],         to: ["vallejo", "white"] },
  { from: ["citadel", "corax-white"],         to: ["army-painter", "matt-white"] },
  { from: ["citadel", "mechanicus-standard-grey"], to: ["vallejo", "german-grey"] },
  { from: ["citadel", "mechanicus-standard-grey"], to: ["army-painter", "uniform-grey"] },
  { from: ["citadel", "agrax-earthshade"],    to: ["army-painter", "strong-tone-ink"] },
  { from: ["citadel", "nuln-oil"],            to: ["army-painter", "dark-tone-ink"] },
  { from: ["citadel", "reikland-fleshshade"], to: ["army-painter", "soft-tone-ink"] },
  { from: ["citadel", "macragge-blue"],       to: ["vallejo", "prussian-blue"] },
  { from: ["citadel", "retributor-armour"],   to: ["vallejo", "gold"] },
  { from: ["citadel", "retributor-armour"],   to: ["army-painter", "greedy-gold"] },
  { from: ["citadel", "runefang-steel"],      to: ["vallejo", "silver"] },
  { from: ["citadel", "runefang-steel"],      to: ["army-painter", "mithril-silver"] },
  { from: ["citadel", "rhinox-hide"],         to: ["vallejo", "chocolate-brown"] },
  { from: ["citadel", "mournfang-brown"],     to: ["vallejo", "flat-earth"] },
  { from: ["citadel", "zandri-dust"],         to: ["vallejo", "buff"] },
  { from: ["citadel", "averland-sunset"],     to: ["vallejo", "yellow"] },
  { from: ["citadel", "caliban-green"],       to: ["vallejo", "dark-green"] },
  { from: ["citadel", "naggaroth-night"],     to: ["vallejo", "purple"] },
  { from: ["citadel", "dawnstone"],          to: ["vallejo", "medium-grey"] },
  { from: ["citadel", "screaming-skull"],     to: ["vallejo", "ivory"] },
  { from: ["citadel", "ushabti-bone"],        to: ["vallejo", "pale-sand"] },
];

export async function seedPaints(prisma: PrismaClient) {
  console.log("  Seeding paint brands and paints...");

  const brandIdMap = new Map<string, string>();

  for (const brand of BRANDS) {
    const b = await prisma.paintBrand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name, website: brand.website },
      create: { slug: brand.slug, name: brand.name, website: brand.website },
    });
    brandIdMap.set(brand.slug, b.id);

    for (const paint of brand.paints) {
      const lab = hexToLab(paint.hex);
      await prisma.paint.upsert({
        where: { brandId_slug: { brandId: b.id, slug: paint.slug } },
        update: {
          name: paint.name,
          hex: paint.hex,
          finish: paint.finish,
          category: paint.category,
          range: paint.range,
          labL: lab.L,
          labA: lab.a,
          labB: lab.b,
        },
        create: {
          brandId: b.id,
          slug: paint.slug,
          name: paint.name,
          hex: paint.hex,
          finish: paint.finish,
          category: paint.category,
          range: paint.range,
          labL: lab.L,
          labA: lab.a,
          labB: lab.b,
        },
      });
    }
    console.log(`    ✓ ${brand.name} (${brand.paints.length} paints)`);
  }

  // Seed official equivalents
  console.log("  Seeding official paint equivalents...");
  for (const eq of OFFICIAL_EQUIVALENTS) {
    const [fromBrandSlug, fromPaintSlug] = eq.from;
    const [toBrandSlug, toPaintSlug] = eq.to;

    const fromBrandId = brandIdMap.get(fromBrandSlug);
    const toBrandId = brandIdMap.get(toBrandSlug);
    if (!fromBrandId || !toBrandId) continue;

    const fromPaint = await prisma.paint.findUnique({
      where: { brandId_slug: { brandId: fromBrandId, slug: fromPaintSlug } },
    });
    const toPaint = await prisma.paint.findUnique({
      where: { brandId_slug: { brandId: toBrandId, slug: toPaintSlug } },
    });
    if (!fromPaint || !toPaint) continue;

    // Compute actual deltaE for the stored equivalent
    const { deltaE2000: dE } = await import("../../lib/paint-hub/color");
    const de = dE(
      { L: fromPaint.labL, a: fromPaint.labA, b: fromPaint.labB },
      { L: toPaint.labL, a: toPaint.labA, b: toPaint.labB }
    );

    await prisma.paintEquivalent.upsert({
      where: { fromPaintId_toPaintId: { fromPaintId: fromPaint.id, toPaintId: toPaint.id } },
      update: { deltaE: de, isOfficial: true },
      create: { fromPaintId: fromPaint.id, toPaintId: toPaint.id, deltaE: de, isOfficial: true },
    });
  }
  console.log(`    ✓ ${OFFICIAL_EQUIVALENTS.length} official equivalents seeded`);
}
