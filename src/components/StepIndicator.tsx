import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const FONT = '"Satoshi", "DM Sans", sans-serif';
const GRAD = "linear-gradient(135deg, #FF1F5A 0%, #FF7032 100%)";

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  current: number;
  className?: string;
}

export default function StepIndicator({ steps, current, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((step, i) => {
        const isCompleted = i < current;
        const isActive = i === current;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, fontFamily: FONT, transition: "all 0.3s",
                background: isCompleted ? "#22c55e" : isActive ? GRAD : "transparent",
                border: isCompleted ? "2px solid #22c55e" : isActive ? "2px solid transparent" : "2px solid rgba(0,0,0,0.15)",
                color: isCompleted || isActive ? "#fff" : "rgba(0,0,0,0.30)",
                boxShadow: isActive ? "0 2px 12px rgba(255,31,90,0.30)" : "none",
              }}>
                {isCompleted ? <Check style={{ width: 15, height: 15 }} /> : i + 1}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", fontFamily: FONT,
                color: isActive ? "#0F0F0F" : isCompleted ? "#22c55e" : "rgba(0,0,0,0.30)",
              }}>
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div style={{
                height: 1, width: 48, margin: "0 8px 20px",
                background: i < current ? "#22c55e" : "rgba(0,0,0,0.10)",
                transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
