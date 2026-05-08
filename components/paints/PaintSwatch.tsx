interface Props {
  hex: string;
  finish: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  xs: "w-5 h-5",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-20 h-20",
};

export function PaintSwatch({ hex, finish, size = "md", className = "" }: Props) {
  const isMetallic = finish === "METALLIC";

  return (
    <div
      className={`rounded-full border border-white/10 flex-shrink-0 ${sizes[size]} ${className}`}
      style={{
        backgroundColor: hex,
        background: isMetallic
          ? `radial-gradient(circle at 35% 35%, ${lightenHex(hex, 40)}, ${hex} 55%, ${darkenHex(hex, 20)} 100%)`
          : hex,
      }}
      aria-label={`Paint swatch ${hex}`}
    />
  );
}

function hexToRgb(hex: string) {
  const c = hex.replace("#", "");
  return {
    r: parseInt(c.substring(0, 2), 16),
    g: parseInt(c.substring(2, 4), 16),
    b: parseInt(c.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}

function lightenHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + amount, g + amount, b + amount);
}

function darkenHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r - amount, g - amount, b - amount);
}
