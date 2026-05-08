"use client";

import { useEffect, useState } from "react";
import { getInventory, togglePaint } from "@/lib/paint-hub/inventory";
import { PaintSwatch } from "@/components/paints/PaintSwatch";
import { PaintFinishBadge } from "@/components/paints/PaintFinishBadge";

interface Paint {
  id: string;
  slug: string;
  name: string;
  hex: string;
  finish: string;
  category: string;
  range: string | null;
  brandName: string;
  brandSlug: string;
}

export default function InventoryPage() {
  const [allPaints, setAllPaints] = useState<Paint[]>([]);
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [showOwnedOnly, setShowOwnedOnly] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/paints?limit=500")
      .then((r) => r.json())
      .then((data) => setAllPaints(data.paints ?? []));
    setOwnedIds(getInventory());
    setLoaded(true);
  }, []);

  const toggle = (paintId: string) => {
    togglePaint(paintId);
    setOwnedIds(getInventory());
  };

  const filtered = allPaints.filter((p) => {
    if (showOwnedOnly && !ownedIds.has(p.id)) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-bone-200 font-display text-3xl mb-1">My Collection</h1>
        <p className="text-iron-400 text-sm">
          {ownedIds.size} paint{ownedIds.size !== 1 ? "s" : ""} owned · Stored in your browser
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search paints..."
          className="flex-1 bg-iron-800 border border-iron-600 rounded-lg px-4 py-2 text-iron-100 placeholder-iron-500 text-sm focus:outline-none focus:border-iron-400"
        />
        <button
          onClick={() => setShowOwnedOnly((v) => !v)}
          className={`text-sm px-3 py-2 rounded-lg border transition-colors ${showOwnedOnly ? "bg-green-900/40 border-green-700 text-green-300" : "border-iron-600 text-iron-400 hover:border-iron-400"}`}
        >
          {showOwnedOnly ? "✓ Owned only" : "Show owned only"}
        </button>
      </div>

      {loaded && (
        <div className="space-y-1">
          {filtered.map((p) => {
            const owned = ownedIds.has(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors text-left ${owned ? "bg-green-900/20 border-green-800/50 hover:border-green-700" : "bg-iron-800 border-iron-700 hover:border-iron-500"}`}
              >
                <PaintSwatch hex={p.hex} finish={p.finish} size="xs" />
                <div className="flex-1 min-w-0">
                  <p className="text-iron-100 text-sm font-medium">{p.name}</p>
                  <p className="text-iron-500 text-xs">{p.brandName}{p.range ? ` · ${p.range}` : ""}</p>
                </div>
                <PaintFinishBadge finish={p.finish} />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${owned ? "bg-green-500 border-green-400 text-white" : "border-iron-600"}`}>
                  {owned && <span className="text-[10px] font-bold">✓</span>}
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-iron-500 py-8">No paints match your search</p>
          )}
        </div>
      )}
    </div>
  );
}
