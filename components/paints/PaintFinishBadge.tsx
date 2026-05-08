interface Props {
  finish: string;
}

const FINISH_STYLES: Record<string, string> = {
  MATTE:     "bg-iron-700 text-iron-200",
  SATIN:     "bg-blue-900/50 text-blue-300",
  METALLIC:  "bg-yellow-900/50 text-yellow-300",
  CONTRAST:  "bg-purple-900/50 text-purple-300",
  TECHNICAL: "bg-teal-900/50 text-teal-300",
};

const FINISH_LABELS: Record<string, string> = {
  MATTE: "Matte",
  SATIN: "Satin",
  METALLIC: "Metallic",
  CONTRAST: "Contrast",
  TECHNICAL: "Technical",
};

export function PaintFinishBadge({ finish }: Props) {
  const cls = FINISH_STYLES[finish] ?? "bg-iron-700 text-iron-200";
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cls}`}>
      {FINISH_LABELS[finish] ?? finish}
    </span>
  );
}
