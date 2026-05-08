"use client";

import { useEffect, useState } from "react";
import { getInventory } from "@/lib/paint-hub/inventory";
import Link from "next/link";

interface PaintRef {
  paintId: string;
  name: string;
  hex: string;
}

interface Props {
  requiredPaints: PaintRef[];
}

export function InventoryPanel({ requiredPaints }: Props) {
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setOwnedIds(getInventory());
    setMounted(true);

    const handler = () => setOwnedIds(getInventory());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!mounted) return null;

  const owned = requiredPaints.filter((p) => ownedIds.has(p.paintId));
  const missing = requiredPaints.filter((p) => !ownedIds.has(p.paintId));
  const pct = requiredPaints.length > 0 ? Math.round((owned.length / requiredPaints.length) * 100) : 0;

  return (
    <div className="bg-iron-800 border border-iron-700 rounded-lg p-4 sticky top-20">
      <h3 className="text-iron-200 font-medium text-sm mb-3">Your Collection</h3>
      <div className="mb-3">
        <div className="flex justify-between text-xs text-iron-400 mb-1">
          <span>{owned.length}/{requiredPaints.length} paints owned</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-iron-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {missing.length > 0 && (
        <div className="mb-3">
          <p className="text-iron-500 text-xs mb-2">Missing:</p>
          <div className="flex flex-wrap gap-1.5">
            {missing.map((p) => (
              <div
                key={p.paintId}
                className="flex items-center gap-1 bg-iron-700/50 rounded px-1.5 py-1"
                title={p.name}
              >
                <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: p.hex }} />
                <span className="text-iron-300 text-xs truncate max-w-[120px]">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link
        href="/inventory"
        className="block text-center text-xs text-iron-400 hover:text-iron-200 transition-colors border border-iron-600 rounded py-1.5 mt-2"
      >
        Manage Collection
      </Link>
    </div>
  );
}
