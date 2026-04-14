"use client";

import { useState } from "react";
import { X, Shield, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import StepIndicator from "@/components/StepIndicator";
import type { Anuncio } from "@/types/database";
import { formatCurrency, calcTaxa, calcTotal } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STEPS = [
  { label: "Revisão" },
  { label: "Pagamento" },
  { label: "Aguardando" },
];

interface Props {
  anuncio: Anuncio;
  onClose: () => void;
}

export default function PurchaseModal({ anuncio, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [_transacaoId, setTransacaoId] = useState<string | null>(null);
  const [mpUrl, setMpUrl] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const taxa = calcTaxa(anuncio.preco);
  const total = calcTotal(anuncio.preco);

  async function handleConfirmOrder() {
    setLoading(true);
    setError("");
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Faça login para continuar");

      // Create transaction
      const { data: transacao, error: txErr } = await supabase
        .from("transacoes")
        .insert({
          anuncio_id: anuncio.id,
          comprador_id: userData.user.id,
          vendedor_id: anuncio.vendedor_id,
          valor_total: total,
          taxa,
          valor_liquido: anuncio.preco - taxa,
          status: "aguardando_pagamento",
        })
        .select()
        .single();

      if (txErr || !transacao) throw new Error("Erro ao criar transação");
      setTransacaoId(transacao.id);

      // Create Mercado Pago preference
      const res = await fetch("/api/pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transacaoId: transacao.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro no pagamento");
      setMpUrl(json.init_point);
      setStep(1);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div
        className="relative w-full max-w-md bg-[#1a0030] border border-[rgba(224,248,9,0.15)] shadow-[0_0_60px_rgba(224,64,138,0.2)] overflow-hidden"
        style={{ borderRadius: "24px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
            Finalizar compra
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Steps */}
        <div className="px-6 pt-5 pb-2 flex justify-center">
          <StepIndicator steps={STEPS} current={step} />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 0 — Review */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="glass-card p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Evento</span>
                  <span className="text-white font-medium truncate max-w-[180px]">{anuncio.evento?.nome}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Tipo</span>
                  <span className="text-white font-medium">{(anuncio.setor ?? "").replace("_", " ")}</span>
                </div>
                <div className="border-t border-white/10 pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Ingresso</span>
                    <span className="text-white">{formatCurrency(anuncio.preco)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Taxa (4%)</span>
                    <span className="text-white">{formatCurrency(taxa)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2 mt-2">
                    <span className="text-white">Total</span>
                    <span className="text-[#e0f809] text-base">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Safety notice */}
              <div className="flex gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-green-300 text-xs leading-relaxed">
                  Seu pagamento fica retido até você confirmar o recebimento do ingresso. Se o vendedor não enviar em 24h, você será reembolsado automaticamente.
                </p>
              </div>

              {error && (
                <div className="flex gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-main text-white font-bold text-base shadow-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</>
                ) : (
                  `Pagar ${formatCurrency(total)}`
                )}
              </button>
            </div>
          )}

          {/* Step 1 — Payment */}
          {step === 1 && mpUrl && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#6b00b3]/20 flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-[#6b00b3]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                  Prosseguir para pagamento
                </h3>
                <p className="text-white/50 text-sm">
                  Você será redirecionado ao Mercado Pago para concluir o pagamento via Pix, cartão ou boleto.
                </p>
              </div>
              <a
                href={mpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-2xl bg-[#009ee3] text-white font-bold text-base text-center hover:bg-[#007ab3] transition-colors"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Pagar com Mercado Pago
              </a>
              <button
                onClick={() => setStep(2)}
                className="text-white/40 text-sm hover:text-white/70 transition-colors"
              >
                Já realizei o pagamento →
              </button>
            </div>
          )}

          {/* Step 2 — Waiting */}
          {step === 2 && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                  Aguardando confirmação
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Seu pagamento foi recebido! O vendedor foi notificado e tem até <strong className="text-yellow-400">24 horas</strong> para enviar o ingresso.
                </p>
              </div>

              <div className="glass-card p-4 space-y-2 text-left text-sm">
                {[
                  { icon: CheckCircle, color: "text-green-400", text: "Pagamento confirmado" },
                  { icon: Clock, color: "text-yellow-400", text: "Vendedor notificado — aguardando envio" },
                  { icon: CheckCircle, color: "text-white/20", text: "Receber ingresso" },
                  { icon: CheckCircle, color: "text-white/20", text: "Confirmar e pagamento liberado" },
                ].map(({ icon: Icon, color, text }, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className={i <= 1 ? "text-white/80" : "text-white/30"}>{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  onClose();
                  router.push("/minha-conta/compras");
                }}
                className="w-full py-3 rounded-2xl bg-gradient-main text-white font-bold text-sm"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Ver minhas compras
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
