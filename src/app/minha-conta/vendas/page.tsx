"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Package, Upload, Loader2, TrendingUp, Plus, DollarSign, Shield, Star, Gem } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import SellerBadge from "@/components/SellerBadge";
import type { Transacao, Anuncio, Profile } from "@/types/database";
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

function statusStyle(status: string): React.CSSProperties {
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

export default function VendasPage() {
  const [vendas, setVendas] = useState<Transacao[]>([]);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [tab, setTab] = useState<"vendas" | "anuncios">("vendas");
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login?next=/minha-conta/vendas"); return; }
      loadData(data.user.id);
    });
  }, []);

  async function loadData(userId: string) {
    const [vendasRes, anunciosRes, profileRes] = await Promise.all([
      supabase.from("transacoes").select("*, anuncio:anuncios(*, evento:eventos(*)), comprador:profiles(*)").eq("vendedor_id", userId).order("created_at", { ascending: false }),
      supabase.from("anuncios").select("*, evento:eventos(*)").eq("vendedor_id", userId).order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").eq("id", userId).single(),
    ]);
    setVendas((vendasRes.data as Transacao[]) ?? []);
    setAnuncios((anunciosRes.data as Anuncio[]) ?? []);
    setProfile((profileRes.data ?? null) as Profile | null);
    setLoading(false);
  }

  async function enviarIngresso(transacaoId: string, file: File) {
    setActionLoading(transacaoId);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const path = `ingressos-enviados/${userData.user.id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("ingressos").upload(path, file);
    if (upErr) { setActionLoading(null); return; }
    const { data: urlData } = supabase.storage.from("ingressos").getPublicUrl(path);
    await supabase.from("transacoes").update({ status: "transferencia_enviada", ingresso_enviado_url: urlData.publicUrl }).eq("id", transacaoId);
    setVendas((prev) => prev.map((t) => t.id === transacaoId ? { ...t, status: "transferencia_enviada", ingresso_enviado_url: urlData.publicUrl } : t));
    setActionLoading(null);
  }

  const saldoDisponivel = vendas.filter((t) => t.status === "finalizado").reduce((acc, t) => acc + t.valor_liquido, 0);

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
          <Package style={{ width: 22, height: 22, color: "#FF1F5A" }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F0F0F", margin: 0, fontFamily: FONT }}>Minhas Vendas</h1>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => <div key={i} style={{ height: 120, borderRadius: 16, background: "rgba(0,0,0,0.06)" }} />)}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              <div style={CARD}>
                <p style={{ fontSize: 11, color: "rgba(15,15,15,0.45)", margin: "0 0 4px" }}>Saldo disponível</p>
                <p style={{ fontSize: 20, fontWeight: 800, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, fontFamily: FONT }}>{formatCurrency(saldoDisponivel)}</p>
              </div>
              <div style={CARD}>
                <p style={{ fontSize: 11, color: "rgba(15,15,15,0.45)", margin: "0 0 4px" }}>Vendas totais</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#0F0F0F", margin: 0, fontFamily: FONT }}>{profile?.total_vendas ?? 0}</p>
              </div>
              <div style={CARD}>
                <p style={{ fontSize: 11, color: "rgba(15,15,15,0.45)", margin: "0 0 4px" }}>Seu nível</p>
                {profile && <SellerBadge level={profile.nivel_verificacao} size="md" />}
              </div>
            </div>

            {/* Upgrade banner */}
            {profile && profile.nivel_verificacao !== "diamante" && (
              <div style={{ borderRadius: 14, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", background: "rgba(255,31,90,0.07)", border: "1px solid rgba(255,31,90,0.18)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <TrendingUp style={{ width: 18, height: 18, color: "#FF1F5A", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0F0F0F", margin: "0 0 2px", fontFamily: FONT }}>Torne-se Vendedor Diamante</p>
                    <p style={{ fontSize: 11, color: "rgba(15,15,15,0.50)", margin: 0 }}>Apareça primeiro e venda mais por R$ 10/mês</p>
                  </div>
                </div>
                <Link href="/minha-conta/verificacao" style={{ display: "inline-block", background: GRAD, color: "#fff", fontWeight: 700, fontSize: 12, padding: "8px 16px", borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap", fontFamily: FONT }}>
                  Fazer upgrade
                </Link>
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
              {(["vendas", "anuncios"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "1px solid", cursor: "pointer", fontFamily: FONT, transition: "all 0.2s",
                  background: tab === t ? "rgba(255,31,90,0.08)" : "transparent",
                  color: tab === t ? "#FF1F5A" : "rgba(15,15,15,0.45)",
                  borderColor: tab === t ? "rgba(255,31,90,0.25)" : "rgba(0,0,0,0.08)",
                }}>
                  {t === "vendas" ? `Vendas (${vendas.length})` : `Anúncios (${anuncios.length})`}
                </button>
              ))}
              <Link href="/vender" style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, background: GRAD, color: "#fff", fontWeight: 700, fontSize: 13, padding: "8px 16px", borderRadius: 999, textDecoration: "none", fontFamily: FONT }}>
                <Plus style={{ width: 14, height: 14 }} />
                Novo anúncio
              </Link>
            </div>

            {/* Vendas tab */}
            {tab === "vendas" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {vendas.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "64px 0" }}>
                    <DollarSign style={{ width: 48, height: 48, color: "rgba(15,15,15,0.15)", margin: "0 auto 16px" }} />
                    <p style={{ fontSize: 17, fontWeight: 600, color: "rgba(15,15,15,0.40)", marginBottom: 8, fontFamily: FONT }}>Nenhuma venda ainda</p>
                    <p style={{ fontSize: 13, color: "rgba(15,15,15,0.30)", marginBottom: 24 }}>Crie um anúncio e comece a vender</p>
                    <Link href="/vender" style={{ display: "inline-block", background: GRAD, color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 999, textDecoration: "none", fontFamily: FONT }}>
                      Criar anúncio
                    </Link>
                  </div>
                ) : (
                  vendas.map((t) => {
                    const ev = t.anuncio?.evento;
                    const needsAction = t.status === "pagamento_confirmado" || t.status === "aguardando_transferencia";
                    const st = statusStyle(t.status);
                    return (
                      <div key={t.id} style={CARD}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: needsAction ? 12 : 0 }}>
                          <div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>{ev?.nome ?? "Evento"}</h3>
                            <p style={{ fontSize: 12, color: "rgba(15,15,15,0.50)", margin: "0 0 2px" }}>
                              Comprador: {(t as Transacao & { comprador?: Profile })?.comprador?.nome ?? "—"}
                            </p>
                            <p style={{ fontSize: 11, color: "rgba(15,15,15,0.35)", margin: 0 }}>{formatDateTime(t.created_at)}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 18, fontWeight: 800, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>{formatCurrency(t.valor_liquido)}</p>
                            <p style={{ fontSize: 11, color: "rgba(15,15,15,0.40)", margin: "0 0 4px" }}>líquido</p>
                            <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, ...st }}>{STATUS_LABELS[t.status] ?? t.status}</span>
                          </div>
                        </div>

                        {needsAction && (
                          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.20)" }}>
                            <Upload style={{ width: 18, height: 18, color: "#d97706", flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", margin: "0 0 2px" }}>Envie o ingresso ao comprador</p>
                              <p style={{ fontSize: 11, color: "rgba(146,64,14,0.65)", margin: 0 }}>Você tem 24h para enviar</p>
                            </div>
                            <label style={{ cursor: "pointer", flexShrink: 0 }}>
                              <input type="file" accept="image/*,.pdf" style={{ display: "none" }}
                                onChange={(e) => { const file = e.target.files?.[0]; if (file) enviarIngresso(t.id, file); }}
                              />
                              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: GRAD, color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: FONT, opacity: actionLoading === t.id ? 0.6 : 1 }}>
                                {actionLoading === t.id ? <Loader2 style={{ width: 14, height: 14 }} /> : <Upload style={{ width: 14, height: 14 }} />}
                                Enviar
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Anúncios tab */}
            {tab === "anuncios" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {anuncios.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "64px 0" }}>
                    <Package style={{ width: 48, height: 48, color: "rgba(15,15,15,0.15)", margin: "0 auto 16px" }} />
                    <p style={{ fontSize: 17, fontWeight: 600, color: "rgba(15,15,15,0.40)", fontFamily: FONT }}>Nenhum anúncio ativo</p>
                  </div>
                ) : (
                  anuncios.map((a) => (
                    <div key={a.id} style={{ ...CARD, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>{a.evento?.nome ?? "Evento"}</h3>
                        <p style={{ fontSize: 12, color: "rgba(15,15,15,0.50)", margin: "0 0 2px" }}>
                          {a.setor ? SETOR_LABELS[a.setor] : ""}
                          {a.genero ? ` • ${GENERO_LABELS[a.genero]}` : ""}
                          {a.entrada ? ` • ${ENTRADA_LABELS[a.entrada]}` : ""}
                        </p>
                        <p style={{ fontSize: 12, color: "rgba(15,15,15,0.40)", margin: 0 }}>{a.quantidade} disponível{a.quantidade > 1 ? "is" : ""}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 18, fontWeight: 800, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>{formatCurrency(a.preco)}</p>
                        <span style={{
                          display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                          background: a.status === "ativo" ? "rgba(34,197,94,0.10)" : a.status === "vendido" ? "rgba(0,0,0,0.06)" : "rgba(245,158,11,0.10)",
                          color: a.status === "ativo" ? "#16a34a" : a.status === "vendido" ? "rgba(15,15,15,0.45)" : "#d97706",
                          border: a.status === "ativo" ? "1px solid rgba(34,197,94,0.25)" : a.status === "vendido" ? "1px solid rgba(0,0,0,0.10)" : "1px solid rgba(245,158,11,0.25)",
                        }}>
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
