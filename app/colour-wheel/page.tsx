import type { Metadata } from "next";
import { ColourWheelClient } from "@/components/colour-wheel/ColourWheelClient";

export const metadata: Metadata = {
  title: "Colour Wheel — Battle Palette",
  description: "Interactive colour harmony tool. Pick any hue and find complementary, triadic, analogous and tetradic colours — each matched to real Warhammer paints.",
};

export default function ColourWheelPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-bone-200 font-display text-3xl mb-2">Colour Wheel</h1>
        <p className="text-iron-400 text-sm max-w-2xl">
          Drag the wheel to choose a base hue, then pick a harmony type. Each colour point is matched to the closest
          real paint in the database using perceptual ΔE colour difference.
        </p>
      </div>
      <ColourWheelClient />
    </div>
  );
}
