import { cn } from "@/lib/utils";
import type { NivelVerificacao } from "@/types/database";

interface SellerBadgeProps {
  level: NivelVerificacao;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const configs = {
  bronze: {
    label: "Bronze",
    shield: (
      <svg viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 1L2 5V13C2 18.55 6.34 23.74 12 25C17.66 23.74 22 18.55 22 13V5L12 1Z"
          fill="#CD7F32"
          stroke="#8B5A2B"
          strokeWidth="1.5"
        />
        <path
          d="M9 14L11 16L15 12"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    bg: "bg-[#CD7F32]/20",
    border: "border-[#CD7F32]/40",
    text: "text-[#CD7F32]",
  },
  ouro: {
    label: "Ouro",
    shield: (
      <svg viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 1L2 5V13C2 18.55 6.34 23.74 12 25C17.66 23.74 22 18.55 22 13V5L12 1Z"
          fill="#FFD700"
          stroke="#B8860B"
          strokeWidth="1.5"
        />
        <path
          d="M12 7L13.09 10.26H16.51L13.7 12.27L14.79 15.53L12 13.52L9.21 15.53L10.3 12.27L7.49 10.26H10.91L12 7Z"
          fill="white"
          stroke="white"
          strokeWidth="0.5"
        />
      </svg>
    ),
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/40",
    text: "text-yellow-400",
  },
  diamante: {
    label: "Diamante",
    shield: (
      <svg viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 1L2 5V13C2 18.55 6.34 23.74 12 25C17.66 23.74 22 18.55 22 13V5L12 1Z"
          fill="url(#diamondGrad)"
          stroke="#e0408a"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="diamondGrad" x1="2" y1="1" x2="22" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6b00b3" />
            <stop offset="1" stopColor="#e0408a" />
          </linearGradient>
        </defs>
        <path
          d="M12 7L14 10H17L15 13L16.5 17L12 14.5L7.5 17L9 13L7 10H10L12 7Z"
          fill="#e0f809"
          stroke="#e0f809"
          strokeWidth="0.3"
        />
      </svg>
    ),
    bg: "bg-purple-500/20",
    border: "border-purple-500/40",
    text: "text-purple-300",
  },
};

const sizes = {
  sm: { icon: "w-4 h-4", text: "text-xs", padding: "px-1.5 py-0.5" },
  md: { icon: "w-5 h-5", text: "text-xs", padding: "px-2 py-1" },
  lg: { icon: "w-6 h-6", text: "text-sm", padding: "px-3 py-1.5" },
};

export default function SellerBadge({
  level,
  size = "md",
  showLabel = true,
  className,
}: SellerBadgeProps) {
  const config = configs[level];
  const sizeConfig = sizes[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.bg,
        config.border,
        config.text,
        sizeConfig.text,
        sizeConfig.padding,
        className
      )}
    >
      <span className={cn("flex-shrink-0", sizeConfig.icon)}>
        {config.shield}
      </span>
      {showLabel && config.label}
    </span>
  );
}
