"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showCount?: number;
  className?: string;
}

const sizes = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export default function StarRating({
  value = 0,
  onChange,
  readonly = false,
  size = "md",
  showCount,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const display = hovered ?? value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(null)}
            className={cn(
              "transition-transform duration-150",
              !readonly && "cursor-pointer hover:scale-110",
              readonly && "cursor-default"
            )}
            aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizes[size],
                "transition-colors duration-150",
                star <= display
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-white/20"
              )}
            />
          </button>
        ))}
      </div>
      {typeof showCount === "number" && (
        <span className="text-white/50 text-xs ml-1">({showCount})</span>
      )}
    </div>
  );
}
