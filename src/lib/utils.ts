import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SetorIngresso, GeneroIngresso, EntradaIngresso, TipoIngresso, StatusTransacao, NivelVerificacao } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function calcTaxa(preco: number): number {
  return preco * 0.04;
}

export function calcTotal(preco: number): number {
  return preco + calcTaxa(preco);
}

export function calcLiquido(preco: number): number {
  return preco - calcTaxa(preco);
}

export const SETOR_LABELS: Record<SetorIngresso, string> = {
  pista: "Pista",
  pista_vip: "Pista VIP",
  mezanino: "Mezanino",
  camarote: "Camarote",
  open_bar: "Open Bar",
  vip: "VIP",
  backstage: "Backstage",
  frontstage: "Frontstage",
  area_vip: "Área VIP",
};

export const GENERO_LABELS: Record<GeneroIngresso, string> = {
  feminino: "Feminino",
  masculino: "Masculino",
  unisex: "Unissex",
};

export const ENTRADA_LABELS: Record<EntradaIngresso, string> = {
  inteira: "Inteira",
  meia_entrada: "Meia Entrada",
  cortesia: "Cortesia",
};

/** @deprecated use SETOR_LABELS */
export const TIPO_INGRESSO_LABELS: Record<TipoIngresso, string> = SETOR_LABELS;

export const STATUS_LABELS: Record<StatusTransacao, string> = {
  aguardando_pagamento: "Aguardando pagamento",
  pagamento_confirmado: "Pagamento confirmado",
  aguardando_transferencia: "Aguardando transferência",
  transferencia_enviada: "Transferência enviada",
  confirmado_comprador: "Ingresso recebido",
  em_disputa: "Em disputa",
  finalizado: "Finalizado",
  reembolsado: "Reembolsado",
};

export const STATUS_COLORS: Record<StatusTransacao, string> = {
  aguardando_pagamento: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  pagamento_confirmado: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  aguardando_transferencia: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  transferencia_enviada: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  confirmado_comprador: "bg-green-500/20 text-green-300 border-green-500/30",
  em_disputa: "bg-red-500/20 text-red-300 border-red-500/30",
  finalizado: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  reembolsado: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export const NIVEL_LABELS: Record<NivelVerificacao, string> = {
  bronze: "Bronze",
  ouro: "Ouro",
  diamante: "Diamante",
};
