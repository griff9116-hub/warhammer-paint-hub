import Link from "next/link";
import type { ConversionResult as ConversionResultData } from "@/lib/paint-hub/conversions";
import { PaintSwatch } from "./PaintSwatch";
import { LabDeltaBadge } from "../ui/LabDeltaBadge";
import { PaintFinishBadge } from "./PaintFinishBadge";

interface Props {
  result: ConversionResultData;
}

export function ConversionResult({ result }: Props) {
  const { paint, deltaE, isOfficial } = result;

  return (
    <Link
      href={`/paints/${paint.slug}`}
      className="flex items-center gap-3 p-3 bg-iron-800 border border-iron-700 rounded-lg hover:border-iron-500 transition-colors group"
    >
      <PaintSwatch hex={paint.hex} finish={paint.finish} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-iron-100 font-medium text-sm">{paint.name}</span>
          {isOfficial && (
            <span className="text-xs bg-blood-600/40 text-blood-400 border border-blood-600/50 px-1.5 py-0.5 rounded">
              Official
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-iron-400 text-xs">{paint.brandName}</span>
          {paint.range && <span className="text-iron-600 text-xs">· {paint.range}</span>}
          <PaintFinishBadge finish={paint.finish} />
        </div>
      </div>
      <LabDeltaBadge deltaE={deltaE} />
    </Link>
  );
}
