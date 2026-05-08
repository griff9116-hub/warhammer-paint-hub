import type { RecipeStepData, AlternativePaint } from "@/types/paint-hub";
import { PaintSwatch } from "../paints/PaintSwatch";

interface Props {
  step: RecipeStepData;
  ownedPaintIds?: Set<string>;
  alternatives?: Record<string, AlternativePaint[]>;
}

function deltaEColor(d: number) {
  if (d < 2)  return "text-green-400";
  if (d < 5)  return "text-lime-400";
  if (d < 10) return "text-amber-400";
  return "text-orange-400";
}

export function RecipeStepCard({ step, ownedPaintIds, alternatives }: Props) {
  return (
    <div className="bg-iron-800 border border-iron-700 rounded-lg p-5">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-iron-700 border border-iron-600 flex items-center justify-center flex-shrink-0 font-mono text-sm text-iron-300">
          {step.stepNumber}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-iron-100 font-medium">{step.title}</h4>
          {step.technique && (
            <span className="inline-block mt-1 text-xs bg-iron-700 text-iron-300 px-2 py-0.5 rounded">
              {step.technique}
            </span>
          )}
          <p className="text-iron-300 text-sm mt-2 leading-relaxed">{step.description}</p>

          {step.paints.length > 0 && (
            <div className="mt-3 space-y-2">
              {step.paints.map((p) => {
                const owned = ownedPaintIds?.has(p.paintId);
                const alts = alternatives?.[p.paintId] ?? [];
                return (
                  <div key={p.paintId}>
                    <div
                      className="flex items-center gap-2 bg-iron-700/50 border border-iron-600 rounded-lg px-2.5 py-1.5 w-fit"
                      title={owned !== undefined ? (owned ? "In your collection" : "Not in collection") : undefined}
                    >
                      <div className="relative">
                        <PaintSwatch hex={p.hex} finish={p.finish} size="xs" />
                        {owned !== undefined && (
                          <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full text-center text-[7px] leading-3 font-bold ${owned ? "bg-green-500 text-white" : "bg-orange-500/70 text-white"}`}>
                            {owned ? "✓" : "!"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-iron-200 text-xs font-medium leading-none">{p.name}</p>
                        <p className="text-iron-500 text-[10px] mt-0.5">{p.brandName}{p.role && ` · ${p.role}`}</p>
                        {p.dilution && <p className="text-iron-500 text-[10px]">{p.dilution}</p>}
                      </div>
                    </div>

                    {alts.length > 0 && (
                      <div className="mt-1.5 ml-2 pl-3 border-l border-iron-600 flex flex-wrap gap-2">
                        {alts.map((alt) => (
                          <div
                            key={alt.id}
                            className="flex items-center gap-1.5 bg-iron-800/80 border border-iron-700 rounded px-2 py-1"
                            title={`${alt.name} — ${alt.brandName} (ΔE ${alt.deltaE.toFixed(1)})`}
                          >
                            <PaintSwatch hex={alt.hex} finish={alt.finish} size="xs" />
                            <div>
                              <p className="text-iron-300 text-[10px] font-medium leading-none">
                                {alt.name}
                                {alt.isOfficial && (
                                  <span className="ml-1 text-blood-400">★</span>
                                )}
                              </p>
                              <p className="text-iron-500 text-[9px] mt-0.5">
                                {alt.brandName}
                                <span className={`ml-1 font-mono ${deltaEColor(alt.deltaE)}`}>
                                  ΔE {alt.deltaE.toFixed(1)}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {step.duration && (
            <p className="text-iron-500 text-xs mt-2">⏱ {step.duration}</p>
          )}
        </div>
      </div>
    </div>
  );
}
