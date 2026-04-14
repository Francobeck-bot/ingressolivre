"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, CheckCircle, AlertTriangle, Loader2, MessageCircle, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Transacao } from "@/types/database";
import { formatCurrency, formatDateTime, SETOR_LABELS, GENERO_LABELS, ENTRADA_LABELS, STATUS_LABELS } from "@/lib/utils";

const FONT = '"Satoshi", "DM Sans", sans-serif';
const GRAD = "linear-gradient(135deg, #FF1F5A 0%, #FF7032 100%)";

const TABS = [
  { href: "/minha-conta/compras", label: "Minhas compras" },
  { href: "/minha-conta/vendas", label: "Minhas vendas" },
  { href: "/minha-conta/verificacao", label: "Verificação" },
];

const CARD: React.CSSProperties = {
  background: "rgba(255,255,255,0.80)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 16,
  padding: 20,
  fontFamily: FONT,
};

function statusStyle(status: string) {
  const map: Record<string, React.CSSProperties> = {
    aguardando_pagamento: { background: "rgba(0,0,0,0.05)", color: "rgba(15,15,15,0.60)", border: "1px solid rgba(0,0,0,0.10)" },
    pagamento_confirmado: { background: "rgba(59,130,246,0.10)", color: "#2563eb", border: "1px solid rgba(59,130,246,0.25)" },
    aguardando_transferencia: { background: "rgba(245,158,11,0.10)", color: "#d97706", border: "1px solid rgba(245,158,11,0.25)" },
    transferencia_enviada: { background: "rgba(139,92,246,0.10)", color: "#7c3aed", border: "1px solid rgba(139,92,246,0.25)" },
    confirmado_comprador: { background: "rgba(34,197,94,0.10)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.25)" },
    em_disputa: { background: "rgba(239,68,68,0.10)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.25)" },
    finalizado: { background: "rgba(16,185,129,0.10)", color: "#059669", border: "1px solid rgba(16,185,129,0.25)" },
    reembolsado: { background: "rgba(0,0,0,0.05)", color: "rgba(15,15,15,0.45)", border: "1px solid rgba(0,0,0,0.10)" },
  };
  return map[status] ?? map.aguardando_pagamento;
}

export default function ComprasPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRating, setShowRating] = useState<{ transacaoId: string; vendedorId: string } | null>(null);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login?next=/minha-conta/compras"); return; }
      loadTransacoes(data.user.id);
    });
  }, []);

  async function loadTransacoes(userId: string) {
    const { data } = await supabase
      .from("transacoes")
      .select("*, anuncio:anuncios(*, evento:eventos(*)), vendedor:profiles(*)")
      .eq("comprador_id", userId)
      .order("created_at", { ascending: false });
    setTransacoes((data as Transacao[]) ?? []);
    setLoading(false);
  }

  async function confirmarRecebimento(transacaoId: string, vendedorId: string) {
    setActionLoading(transacaoId);
    await supabase.from("transacoes").update({ status: "confirmado_comprador" }).eq("id", transacaoId);
    setTransacoes((prev) => prev.map((t) => t.id === transacaoId ? { ...t, status: "confirmado_comprador" } : t));
    setActionLoading(null);
    setShowRating({ transacaoId, vendedorId });
  }

  async function abrirDisputa(transacaoId: string) {
    setActionLoading(transacaoId);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    await supabase.from("disputas").insert({ transacao_id: transacaoId, aberta_por: userData.user.id, motivo: "Ingresso não recebido ou com problema", status: "aberta" });
    await supabase.from("transacoes").update({ status: "em_disputa" }).eq("id", transacaoId);
    setTransacoes((prev) => prev.map((t) => t.id === transacaoId ? { ...t, status: "em_disputa" } : t));
    setActionLoading(null);
  }

  async function submitRating() {
    if (!showRating || rating === 0) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    await supabase.from("avaliacoes").insert({
      transacao_id: showRating.transacaoId,
      avaliador_id: userData.user.id,
      avaliado_id: showRating.vendedorId,
      nota: rating,
      comentario: ratingComment || null,
    });
    setShowRating(null); setRating(0); setRatingComment("");
  }

  return (
    <div style={{ minHeight: "100dvh", padding: "80px 24px 48px", fontFamily: FONT }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Tab nav */}
        <div style={{ display: "flex", gap: 4, marginBottom: 32, background: "rgba(255,255,255,0.70)", backdropFilter: "blur(12px)", padding: 4, width: "fit-content", borderRadius: 16, border: "1px solid rgba(255,31,90,0.12)" }}>
          {TABS.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: "8px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.2s", fontFamily: FONT,
              background: pathname === href ? GRAD : "transparent",
              color: pathname === href ? "#fff" : "rgba(15,15,15,0.55)",
            }}>
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <ShoppingBag style={{ width: 22, height: 22, color: "#FF1F5A" }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F0F0F", margin: 0, fontFamily: FONT }}>Minhas Compras</h1>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => <div key={i} style={{ height: 120, borderRadius: 16, background: "rgba(0,0,0,0.06)" }} />)}
          </div>
        ) : transacoes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <ShoppingBag style={{ width: 48, height: 48, color: "rgba(15,15,15,0.15)", margin: "0 auto 16px" }} />
            <p style={{ fontSize: 17, fontWeight: 600, color: "rgba(15,15,15,0.40)", marginBottom: 8, fontFamily: FONT }}>Nenhuma compra ainda</p>
            <p style={{ fontSize: 13, color: "rgba(15,15,15,0.30)", marginBottom: 24 }}>Explore os ingressos disponíveis e garanta a sua festa</p>
            <Link href="/buscar" style={{ display: "inline-block", background: GRAD, color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 999, textDecoration: "none", fontFamily: FONT }}>
              Explorar ingressos
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {transacoes.map((t) => {
              const ev = t.anuncio?.evento;
              const isPending = t.status === "transferencia_enviada";
              const st = statusStyle(t.status);
              return (
                <div key={t.id} style={CARD}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>{ev?.nome ?? "Evento"}</h3>
                      <p style={{ fontSize: 12, color: "rgba(15,15,15,0.50)", margin: "0 0 2px" }}>
                        {t.anuncio?.setor ? SETOR_LABELS[t.anuncio.setor] : ""}
                        {t.anuncio?.genero ? ` • ${GENERO_LABELS[t.anuncio.genero]}` : ""}
                        {t.anuncio?.entrada ? ` • ${ENTRADA_LABELS[t.anuncio.entrada]}` : ""}
                        {ev ? ` • ${ev.cidade}` : ""}
                      </p>
                      <p style={{ fontSize: 11, color: "rgba(15,15,15,0.35)", margin: 0 }}>{formatDateTime(t.created_at)}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 18, fontWeight: 800, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>{formatCurrency(t.valor_total)}</p>
                      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, ...st }}>{STATUS_LABELS[t.status] ?? t.status}</span>
                    </div>
                  </div>

                  {t.anuncio?.imagem_ingresso_url && isPending && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.15)", marginBottom: 12 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.anuncio.imagem_ingresso_url} alt="Ingresso" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0F0F0F", margin: "0 0 2px" }}>Ingresso enviado pelo vendedor</p>
                        <p style={{ fontSize: 11, color: "rgba(15,15,15,0.50)", margin: 0 }}>Verifique se está correto antes de confirmar</p>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <Link href={`/chat?transacao=${t.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.10)", color: "rgba(15,15,15,0.60)", fontSize: 13, textDecoration: "none", fontFamily: FONT }}>
                      <MessageCircle style={{ width: 14, height: 14 }} />
                      Chat
                    </Link>
                    {isPending && (
                      <>
                        <button
                          onClick={() => confirmarRecebimento(t.id, t.vendedor_id)}
                          disabled={actionLoading === t.id}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: "1px solid rgba(34,197,94,0.30)", background: "rgba(34,197,94,0.08)", color: "#16a34a", fontSize: 13, cursor: "pointer", fontFamily: FONT }}
                        >
                          {actionLoading === t.id ? <Loader2 style={{ width: 14, height: 14 }} /> : <CheckCircle style={{ width: 14, height: 14 }} />}
                          Recebi o ingresso ✓
                        </button>
                        <button
                          onClick={() => abrirDisputa(t.id)}
                          disabled={actionLoading === t.id}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: 13, cursor: "pointer", fontFamily: FONT }}
                        >
                          <AlertTriangle style={{ width: 14, height: 14 }} />
                          Tive um problema
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(0,0,0,0.40)", backdropFilter: "blur(8px)" }}>
          <div style={{ background: "rgba(255,255,255,0.96)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 360, fontFamily: FONT }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>Avalie o vendedor</h3>
            <p style={{ fontSize: 13, color: "rgba(15,15,15,0.50)", margin: "0 0 20px" }}>Como foi sua experiência?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <Star style={{ width: 28, height: 28, fill: s <= rating ? "#FF7032" : "none", color: s <= rating ? "#FF7032" : "rgba(15,15,15,0.20)" }} />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder="Deixe um comentário (opcional)..."
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.10)", background: "rgba(0,0,0,0.03)", color: "#0F0F0F", fontSize: 13, outline: "none", resize: "none", marginBottom: 16, fontFamily: FONT, boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowRating(null)} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1px solid rgba(0,0,0,0.10)", background: "transparent", color: "rgba(15,15,15,0.55)", fontSize: 14, cursor: "pointer", fontFamily: FONT }}>Pular</button>
              <button onClick={submitRating} disabled={rating === 0} style={{ flex: 1, padding: "12px 0", borderRadius: 10, background: rating === 0 ? "rgba(0,0,0,0.10)" : GRAD, color: rating === 0 ? "rgba(15,15,15,0.40)" : "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: rating === 0 ? "not-allowed" : "pointer", fontFamily: FONT }}>Enviar avaliação</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
