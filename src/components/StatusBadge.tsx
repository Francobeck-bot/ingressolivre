import { cn, STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";
import type { StatusTransacao } from "@/types/database";

const STATUS_DOTS: Record<StatusTransacao, string> = {
  aguardando_pagamento: "bg-gray-400",
  pagamento_confirmado: "bg-blue-400",
  aguardando_transferencia: "bg-yellow-400 animate-pulse",
  transferencia_enviada: "bg-purple-400 animate-pulse",
  confirmado_comprador: "bg-green-400",
  em_disputa: "bg-red-400 animate-pulse",
  finalizado: "bg-emerald-400",
  reembolsado: "bg-gray-400",
};

interface StatusBadgeProps {
  status: StatusTransacao;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium",
        STATUS_COLORS[status],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOTS[status])} />
      {STATUS_LABELS[status]}
    </span>
  );
}
