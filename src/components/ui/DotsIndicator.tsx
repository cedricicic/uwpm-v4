import React from "react";

interface DotsIndicatorProps {
  total: number;
  active: number;
  onSelect?: (index: number) => void;
  ariaLabel?: string;
}

export default function DotsIndicator({
  total,
  active,
  onSelect,
  ariaLabel = "Progress indicator",
}: DotsIndicatorProps) {
  if (total <= 1) return null;

  return (
    <div className="dots-indicator" role="tablist" aria-label={ariaLabel}>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          role="tab"
          type="button"
          aria-selected={i === active}
          aria-label={`Item ${i + 1} of ${total}`}
          className={`dots-indicator__dot ${i === active ? "dots-indicator__dot--active" : ""}`}
          onClick={() => onSelect?.(i)}
        />
      ))}
    </div>
  );
}
