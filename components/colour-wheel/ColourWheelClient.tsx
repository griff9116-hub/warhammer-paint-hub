"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface PaintMatch {
  id: string;
  name: string;
  hex: string;
  finish: string;
  brandName: string;
  deltaE: number;
}

interface HarmonyPoint {
  hue: number;
  hex: string;
  label: string;
  matches: PaintMatch[];
}

type HarmonyType = "complementary" | "triadic" | "analogous" | "split" | "tetradic";

const HARMONY_OFFSETS: Record<HarmonyType, number[]> = {
  complementary:  [180],
  triadic:        [120, 240],
  analogous:      [-30, 30],
  split:          [150, 210],
  tetradic:       [90, 180, 270],
};

const HARMONY_LABELS: Record<HarmonyType, string> = {
  complementary: "Complementary",
  triadic:       "Triadic",
  analogous:     "Analogous",
  split:         "Split-Complementary",
  tetradic:      "Tetradic",
};

function hslToHex(h: number, s = 80, l = 45): string {
  const sN = s / 100;
  const lN = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n: number) => lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);
  return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

const OUTER_R = 120;
const INNER_R = 80;
const SIZE = 260;
const CX = SIZE / 2;
const CY = SIZE / 2;

function drawWheel(ctx: CanvasRenderingContext2D) {
  for (let deg = 0; deg < 360; deg++) {
    const start = ((deg - 1) * Math.PI) / 180;
    const end = ((deg + 1) * Math.PI) / 180;
    const grad = ctx.createRadialGradient(CX, CY, INNER_R, CX, CY, OUTER_R);
    grad.addColorStop(0, `hsla(${deg},0%,50%,0)`);
    grad.addColorStop(1, `hsl(${deg},80%,45%)`);
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, OUTER_R, start, end);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

function hueToPoint(hue: number, r: number) {
  const rad = ((hue - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function xyToHue(x: number, y: number) {
  const dx = x - CX;
  const dy = y - CY;
  return mod(Math.atan2(dy, dx) * (180 / Math.PI) + 90, 360);
}

function drawMarker(ctx: CanvasRenderingContext2D, hue: number, r: number, hex: string, isMain: boolean) {
  const { x, y } = hueToPoint(hue, r);
  ctx.beginPath();
  ctx.arc(x, y, isMain ? 10 : 8, 0, Math.PI * 2);
  ctx.fillStyle = `#${hex}`;
  ctx.fill();
  ctx.strokeStyle = isMain ? "#fff" : "rgba(255,255,255,0.6)";
  ctx.lineWidth = isMain ? 2.5 : 1.5;
  ctx.stroke();
}

async function fetchMatches(hex: string): Promise<PaintMatch[]> {
  try {
    const res = await fetch(`/api/paints/closest?hex=${hex}&limit=3`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function deltaEColor(d: number) {
  if (d < 2)  return "text-green-400";
  if (d < 5)  return "text-lime-400";
  if (d < 10) return "text-amber-400";
  return "text-orange-400";
}

export function ColourWheelClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [primaryHue, setPrimaryHue] = useState(200);
  const [harmonyType, setHarmonyType] = useState<HarmonyType>("complementary");
  const [points, setPoints] = useState<HarmonyPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const dragging = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Draw wheel + markers whenever hue or harmony changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);
    drawWheel(ctx);

    // Draw inner circle (primary colour fill)
    ctx.beginPath();
    ctx.arc(CX, CY, INNER_R - 2, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${primaryHue},80%,45%)`;
    ctx.fill();

    const markerR = (OUTER_R + INNER_R) / 2;
    const offsets = HARMONY_OFFSETS[harmonyType];
    offsets.forEach((off) => {
      const h = mod(primaryHue + off, 360);
      drawMarker(ctx, h, markerR, hslToHex(h), false);
    });
    drawMarker(ctx, primaryHue, markerR, hslToHex(primaryHue), true);
  }, [primaryHue, harmonyType]);

  // Fetch paint matches (debounced)
  const fetchAllMatches = useCallback(
    (hue: number, type: HarmonyType) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        setLoading(true);
        const offsets = HARMONY_OFFSETS[type];
        const allHues = [hue, ...offsets.map((o) => mod(hue + o, 360))];
        const labels = ["Primary", ...offsets.map((o) => {
          const sign = o < 0 ? "" : "+";
          return `${sign}${o}°`;
        })];

        const results = await Promise.all(
          allHues.map(async (h, i) => {
            const hex = hslToHex(h);
            const matches = await fetchMatches(hex);
            return { hue: h, hex, label: labels[i], matches } as HarmonyPoint;
          })
        );
        setPoints(results);
        setLoading(false);
      }, 400);
    },
    []
  );

  useEffect(() => {
    fetchAllMatches(primaryHue, harmonyType);
  }, [primaryHue, harmonyType, fetchAllMatches]);

  function handlePointer(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const dx = x - CX;
    const dy = y - CY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist >= INNER_R && dist <= OUTER_R + 12) {
      setPrimaryHue(Math.round(xyToHue(x, y)));
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Wheel + controls */}
      <div className="flex flex-col items-center gap-4 flex-shrink-0">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="cursor-crosshair touch-none rounded-full"
          onMouseDown={(e) => { dragging.current = true; handlePointer(e.clientX, e.clientY); }}
          onMouseMove={(e) => { if (dragging.current) handlePointer(e.clientX, e.clientY); }}
          onMouseUp={() => { dragging.current = false; }}
          onMouseLeave={() => { dragging.current = false; }}
          onTouchStart={(e) => { dragging.current = true; handlePointer(e.touches[0].clientX, e.touches[0].clientY); }}
          onTouchMove={(e) => { if (dragging.current) handlePointer(e.touches[0].clientX, e.touches[0].clientY); }}
          onTouchEnd={() => { dragging.current = false; }}
        />

        {/* Hue readout */}
        <div className="text-iron-400 text-xs font-mono">
          Base hue: <span className="text-bone-200">{primaryHue}°</span>
        </div>

        {/* Harmony selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {(Object.keys(HARMONY_LABELS) as HarmonyType[]).map((type) => (
            <button
              key={type}
              onClick={() => setHarmonyType(type)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                harmonyType === type
                  ? "bg-blood-700 border-blood-500 text-bone-100"
                  : "bg-iron-800 border-iron-600 text-iron-300 hover:border-iron-500 hover:text-iron-100"
              }`}
            >
              {HARMONY_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Paint match cards */}
      <div className="flex-1 min-w-0">
        {loading && points.length === 0 && (
          <p className="text-iron-500 text-sm">Finding paints…</p>
        )}
        <div className="space-y-4">
          {points.map((pt) => (
            <div key={pt.hue} className="bg-iron-800 border border-iron-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0"
                  style={{ backgroundColor: `#${pt.hex}` }}
                />
                <div>
                  <p className="text-bone-200 text-sm font-medium">{pt.label}</p>
                  <p className="text-iron-500 text-[11px] font-mono">#{pt.hex.toUpperCase()} · {Math.round(pt.hue)}°</p>
                </div>
              </div>

              {pt.matches.length === 0 ? (
                <p className="text-iron-600 text-xs">No matches found</p>
              ) : (
                <div className="space-y-1.5">
                  {pt.matches.map((m) => (
                    <div key={m.id} className="flex items-center gap-2.5 bg-iron-700/50 border border-iron-600 rounded px-2.5 py-1.5">
                      <div
                        className="w-5 h-5 rounded-full border border-white/10 flex-shrink-0"
                        style={{ backgroundColor: `#${m.hex}` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-iron-100 text-xs font-medium truncate">{m.name}</p>
                        <p className="text-iron-500 text-[10px]">{m.brandName}</p>
                      </div>
                      <span className={`text-[10px] font-mono flex-shrink-0 ${deltaEColor(m.deltaE)}`}>
                        ΔE {m.deltaE.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
