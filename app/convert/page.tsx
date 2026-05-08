"use client";

import { useState, useCallback } from "react";
import { PaintSwatch } from "@/components/paints/PaintSwatch";
import { ConversionResult } from "@/components/paints/ConversionResult";
import type { ConversionResult as ConversionResultType } from "@/lib/paint-hub/conversions";

interface PaintSearchResult {
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

export default function ConvertPage() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PaintSearchResult[]>([]);
  const [selectedPaint, setSelectedPaint] = useState<PaintSearchResult | null>(null);
  const [conversions, setConversions] = useState<ConversionResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setSearchResults([]); return; }
    const res = await fetch(`/api/paints?q=${encodeURIComponent(q)}&limit=8`);
    const data = await res.json();
    setSearchResults(data.paints ?? []);
  }, []);

  const selectPaint = useCallback(async (paint: PaintSearchResult) => {
    setSelectedPaint(paint);
    setSearchResults([]);
    setQuery(paint.name);
    setLoading(true);
    const res = await fetch(`/api/paints/${paint.id}/conversions`);
    const data = await res.json();
    setConversions(data.conversions ?? []);
    setLoading(false);
  }, []);

  const filtered = brandFilter
    ? conversions.filter((c) => c.paint.brandSlug === brandFilter)
    : conversions;

  const brands = [...new Set(conversions.map((c) => c.paint.brandSlug))];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-bone-200 font-display text-3xl mb-2">Paint Converter</h1>
        <p className="text-iron-400">Search for any paint to find the closest equivalents across all brands.</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); search(e.target.value); }}
          placeholder="Search for a paint (e.g. 'Abaddon Black', 'Mephiston Red')"
          className="w-full bg-iron-800 border border-iron-600 rounded-xl px-5 py-4 text-iron-100 placeholder-iron-500 focus:outline-none focus:border-iron-400 text-base"
        />
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-iron-800 border border-iron-600 rounded-xl overflow-hidden shadow-xl">
            {searchResults.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPaint(p)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-iron-700 transition-colors text-left"
              >
                <PaintSwatch hex={p.hex} finish={p.finish} size="xs" />
                <div>
                  <p className="text-iron-100 text-sm font-medium">{p.name}</p>
                  <p className="text-iron-500 text-xs">{p.brandName}{p.range ? ` · ${p.range}` : ""}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected paint + results */}
      {selectedPaint && (
        <>
          <div className="bg-iron-800 border border-iron-700 rounded-xl p-4 flex items-center gap-4 mb-6">
            <PaintSwatch hex={selectedPaint.hex} finish={selectedPaint.finish} size="md" />
            <div>
              <p className="text-bone-200 font-medium">{selectedPaint.name}</p>
              <p className="text-iron-400 text-sm">{selectedPaint.brandName}{selectedPaint.range ? ` · ${selectedPaint.range}` : ""}</p>
              <p className="text-iron-600 text-xs font-mono mt-0.5">{selectedPaint.hex.toUpperCase()}</p>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12 text-iron-500">Calculating colour matches…</div>
          )}

          {!loading && conversions.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-bone-200 font-medium">
                  {conversions.length} matches found
                </h2>
                <div className="flex gap-1">
                  <button
                    onClick={() => setBrandFilter(null)}
                    className={`text-xs px-2.5 py-1 rounded border transition-colors ${!brandFilter ? "bg-blood-600/30 border-blood-500 text-blood-300" : "border-iron-600 text-iron-400 hover:border-iron-400"}`}
                  >
                    All
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBrandFilter(brandFilter === b ? null : b)}
                      className={`text-xs px-2.5 py-1 rounded border transition-colors ${brandFilter === b ? "bg-blood-600/30 border-blood-500 text-blood-300" : "border-iron-600 text-iron-400 hover:border-iron-400"}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {filtered.map((r) => (
                  <ConversionResult key={r.paint.id} result={r} />
                ))}
              </div>
            </>
          )}

          {!loading && conversions.length === 0 && (
            <p className="text-iron-500 text-center py-8">No close matches found.</p>
          )}
        </>
      )}

      {!selectedPaint && (
        <div className="text-center py-16 text-iron-600">
          <p className="text-4xl mb-4">🎨</p>
          <p>Search for a paint above to find equivalents</p>
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            {["Abaddon Black", "Mephiston Red", "Agrax Earthshade", "Nuln Oil"].map((name) => (
              <button
                key={name}
                onClick={() => { setQuery(name); search(name); }}
                className="text-xs bg-iron-800 border border-iron-700 hover:border-iron-500 text-iron-300 px-3 py-1.5 rounded transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
