interface Props {
  deltaE: number;
  className?: string;
}

export function LabDeltaBadge({ deltaE, className = "" }: Props) {
  let label: string;
  let colorClass: string;

  if (deltaE < 2) {
    label = "Identical";
    colorClass = "bg-green-900/60 text-green-300 border-green-700";
  } else if (deltaE < 5) {
    label = "Excellent";
    colorClass = "bg-lime-900/60 text-lime-300 border-lime-700";
  } else if (deltaE < 10) {
    label = "Good";
    colorClass = "bg-amber-900/60 text-amber-300 border-amber-700";
  } else if (deltaE < 20) {
    label = "Close";
    colorClass = "bg-orange-900/60 text-orange-300 border-orange-700";
  } else {
    label = "Different";
    colorClass = "bg-red-900/60 text-red-300 border-red-700";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border font-mono ${colorClass} ${className}`}
      title={`Delta-E 2000: ${deltaE.toFixed(2)}`}
    >
      <span>ΔE {deltaE.toFixed(1)}</span>
      <span className="opacity-70">·</span>
      <span>{label}</span>
    </span>
  );
}
