import Link from "next/link";
import type { PaintCardData } from "@/types/paint-hub";
import { PaintSwatch } from "./PaintSwatch";
import { PaintFinishBadge } from "./PaintFinishBadge";

interface Props {
  paint: PaintCardData;
  showConvertLink?: boolean;
}

export function PaintCard({ paint, showConvertLink = true }: Props) {
  return (
    <div className="bg-iron-800 border border-iron-700 rounded-lg p-3 flex items-center gap-3 hover:border-iron-500 transition-colors group">
      <PaintSwatch hex={paint.hex} finish={paint.finish} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-iron-100 font-medium text-sm truncate">{paint.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-iron-400 text-xs">{paint.brandName}</span>
          {paint.range && <span className="text-iron-600 text-xs">· {paint.range}</span>}
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <PaintFinishBadge finish={paint.finish} />
          <span className="text-iron-600 text-xs font-mono">{paint.hex.toUpperCase()}</span>
        </div>
      </div>
      {showConvertLink && (
        <Link
          href={`/paints/${paint.slug}`}
          className="text-iron-500 group-hover:text-iron-300 transition-colors text-xs flex-shrink-0"
          title="View conversions"
        >
          →
        </Link>
      )}
    </div>
  );
}
