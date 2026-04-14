"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, CheckCircle, RefreshCw, MessageCircle,
  ChevronDown, ChevronUp, Loader2, Shield, FileText,
  X, Eye, User
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Disputa, Transacao, Mensagem } from "@/types/database";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());

type DisputaWithRelations = Disputa & {
  transacao: Transacao & {
    comprador?: { nome: string; email?: string };
    vendedor?: { nome: string; email?: string };
    anuncio?: { evento?: { nome: string }; tipo_ingresso?: string; preco?: number };
  };
};

type VerificacaoDoc = {
  id: string;
  user_id: string;
  tipo_documento: string;
  url_documento: string;
  status: "pendente" | "aprovado" | "rejeitado";
  created_at: string;
  profile?: { nome: string; email?: string; nivel_verificacao: string };
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<"disputas" | "verificacoes">("disputas");

  // Disputes state
  const [loading, setLoading] = useState(true);
  const [disputas, setDisputas] = useState<DisputaWithRelations[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [chatMsgs, setChatMsgs] = useState<Record<string, Mensagem[]>>({});
  const [resolucao, setResolucao] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "aberta" | "em_analise" | "resolvida">("aberta");

  // Verification state
  const [verificacoes, setVerificacoes] = useState<VerificacaoDoc[]>([]);
  const [vLoading, setVLoading] = useState(false);
  const [vFilter, setVFilter] = useState<"pendente" | "aprovado" | "rejeitado">("pendente");
  const [vActionLoading, setVActionLoading] = useState<string | null>(null);
  const [rejeitarNota, setRejeitarNota] = useState<Record<string, string>>({});

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login?next=/admin"); return; }
      if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(data.user.email ?? "")) {
        router.push("/"); return;
      }
      setAuthed(true);
      loadDisputas();
      loadVerificacoes();
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadDisputas() {
    setLoading(true);
    const { data } = await supabase
      .from("disputas")
      .select(`
        *,
        transacao:transacoes(
          *,
          comprador:profiles!transacoes_comprador_id_fkey(nome),
          vendedor:profiles!transacoes_vendedor_id_fkey(nome),
          anuncio:anuncios(preco, tipo_ingresso, evento:eventos(nome))
        )
      `)
      .order("created_at", { ascending: false });

    setDisputas((data as DisputaWithRelations[]) ?? []);
    setLoading(false);
  }

  async function loadVerificacoes() {
    setVLoading(true);
    const { data } = await supabase
      .from("verificacao_documentos")
      .select("*, profile:profiles(nome, nivel_verificacao)")
      .order("created_at", { ascending: false });
    setVerificacoes((data as VerificacaoDoc[]) ?? []);
    setVLoading(false);
  }

  async function loadChat(transacaoId: string) {
    if (chatMsgs[transacaoId]) return;
    const { data } = await supabase
      .from("mensagens")
      .select("*, remetente:profiles(nome)")
      .eq("transacao_id", transacaoId)
      .order("created_at", { ascending: true });
    setChatMsgs((prev) => ({ ...prev, [transacaoId]: (data as Mensagem[]) ?? [] }));
  }

  function toggleExpand(disputaId: string, transacaoId: string) {
    if (expandedId === disputaId) {
      setExpandedId(null);
    } else {
      setExpandedId(disputaId);
      loadChat(transacaoId);
    }
  }

  async function resolveDisputa(
    disputaId: string,
    transacaoId: string,
    action: "liberar_vendedor" | "reembolsar_comprador" | "solicitar_info"
  ) {
    setActionLoading(`${disputaId}-${action}`);
    const resolucaoText = resolucao[disputaId] ?? action;

    const newTransacaoStatus =
      action === "liberar_vendedor" ? "finalizado" :
      action === "reembolsar_comprador" ? "reembolsado" :
      undefined;

    await supabase.from("disputas").update({
      status: action === "solicitar_info" ? "em_analise" : "resolvida",
      resolucao: resolucaoText,
    }).eq("id", disputaId);

    if (newTransacaoStatus) {
      await supabase.from("transacoes").update({ status: newTransacaoStatus }).eq("id", transacaoId);
    }

    await loadDisputas();
    setActionLoading(null);
  }

  async function approveVerification(doc: VerificacaoDoc) {
    setVActionLoading(`approve-${doc.id}`);
    // 1. Mark document as approved
    await supabase.from("verificacao_documentos").update({ status: "aprovado" }).eq("id", doc.id);
    // 2. Upgrade user to Ouro
    await supabase.from("profiles").update({ nivel_verificacao: "ouro" }).eq("id", doc.user_id);
    await loadVerificacoes();
    setVActionLoading(null);
  }

  async function rejectVerification(doc: VerificacaoDoc) {
    setVActionLoading(`reject-${doc.id}`);
    await supabase.from("verificacao_documentos").update({
      status: "rejeitado",
      notas_admin: rejeitarNota[doc.id] ?? "Documentação insuficiente.",
    }).eq("id", doc.id);
    await loadVerificacoes();
    setVActionLoading(null);
  }

  const filteredDisputas = filterStatus === "all" ? disputas : disputas.filter((d) => d.status === filterStatus);
  const filteredVerificacoes = verificacoes.filter((v) => v.status === vFilter);

  const stats = {
    abertas: disputas.filter((d) => d.status === "aberta").length,
    analise: disputas.filter((d) => d.status === "em_analise").length,
    resolvidas: disputas.filter((d) => d.status === "resolvida").length,
    verPendentes: verificacoes.filter((v) => v.status === "pendente").length,
  };

  if (!authed) return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#e0408a] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-dvh py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                Painel Admin
              </h1>
              <p className="text-white/40 text-sm">IngressoLivre</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Disputas abertas", value: stats.abertas, color: "text-red-400", dot: "bg-red-400" },
              { label: "Verificações pendentes", value: stats.verPendentes, color: "text-yellow-400", dot: "bg-yellow-400" },
              { label: "Resolvidas", value: stats.resolvidas, color: "text-green-400", dot: "bg-green-400" },
            ].map(({ label, value, color, dot }) => (
              <div key={label} className="glass-card px-4 py-2 flex items-center gap-2 border border-white/10">
                <div className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-white/40 text-xs">{label}:</span>
                <span className={`font-bold text-sm ${color}`} style={{ fontFamily: "Syne, sans-serif" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main tabs */}
        <div className="flex gap-1 mb-6 glass-card p-1 w-fit rounded-2xl">
          {[
            { key: "disputas", label: "Disputas", badge: stats.abertas + stats.analise },
            { key: "verificacoes", label: "Verificação Ouro", badge: stats.verPendentes },
          ].map(({ key, label, badge }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as "disputas" | "verificacoes")}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === key
                  ? "bg-gradient-main text-white shadow-glow-sm"
                  : "text-white/50 hover:text-white"
              }`}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {label}
              {badge > 0 && (
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                  activeTab === key ? "bg-white/20 text-white" : "bg-red-500/80 text-white"
                }`}>{badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── DISPUTAS TAB ─────────────────────────────── */}
        {activeTab === "disputas" && (
          <>
            <div className="flex gap-2 mb-6 flex-wrap">
              {(["aberta", "em_analise", "resolvida", "all"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterStatus === s
                      ? "bg-white/15 text-white border border-white/20"
                      : "text-white/40 hover:text-white/70"
                  }`}
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {s === "all" ? "Todas" : s === "aberta" ? "Abertas" : s === "em_analise" ? "Em análise" : "Resolvidas"}
                </button>
              ))}
              <button onClick={loadDisputas} className="ml-auto p-2 rounded-xl glass-card border border-white/10 text-white/40 hover:text-white transition-colors" title="Recarregar">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
              </div>
            ) : filteredDisputas.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-lg" style={{ fontFamily: "Syne, sans-serif" }}>Nenhuma disputa</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDisputas.map((d) => {
                  const t = d.transacao;
                  const isExpanded = expandedId === d.id;
                  return (
                    <div key={d.id} className="glass-card overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-start justify-between flex-wrap gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${
                                d.status === "aberta" ? "text-red-400" :
                                d.status === "em_analise" ? "text-yellow-400" : "text-green-400"
                              }`} />
                              <h3 className="text-white font-bold text-base" style={{ fontFamily: "Syne, sans-serif" }}>
                                {t?.anuncio?.evento?.nome ?? "Evento desconhecido"}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                d.status === "aberta" ? "bg-red-500/15 text-red-400 border-red-500/30" :
                                d.status === "em_analise" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" :
                                "bg-green-500/15 text-green-400 border-green-500/30"
                              }`}>
                                {d.status === "aberta" ? "Aberta" : d.status === "em_analise" ? "Em análise" : "Resolvida"}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-white/50">
                              <span>Comprador: <span className="text-white/70">{t?.comprador?.nome ?? "—"}</span></span>
                              <span>Vendedor: <span className="text-white/70">{t?.vendedor?.nome ?? "—"}</span></span>
                              {t && <StatusBadge status={t.status} />}
                            </div>
                            <p className="text-white/40 text-sm"><span className="font-medium text-white/60">Motivo:</span> {d.motivo}</p>
                            <p className="text-white/30 text-xs">{formatDateTime(d.created_at)}</p>
                          </div>
                          <div className="text-right">
                            {t?.anuncio?.preco && (
                              <p className="text-[#e0f809] font-bold text-xl" style={{ fontFamily: "Syne, sans-serif" }}>
                                {formatCurrency(t.anuncio.preco)}
                              </p>
                            )}
                            <button
                              onClick={() => toggleExpand(d.id, d.transacao_id)}
                              className="mt-2 flex items-center gap-1 text-white/40 hover:text-white text-sm transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Ver chat
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-white/10 p-5 space-y-5">
                          <div>
                            <h4 className="text-white/60 text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "Syne, sans-serif" }}>Histórico do chat</h4>
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                              {(chatMsgs[d.transacao_id] ?? []).length === 0 ? (
                                <p className="text-white/30 text-sm text-center py-4">Nenhuma mensagem trocada</p>
                              ) : (
                                (chatMsgs[d.transacao_id] ?? []).map((m) => (
                                  <div key={m.id} className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-[#6b00b3]/30 flex items-center justify-center text-xs text-white flex-shrink-0">
                                      {(m as Mensagem & { remetente?: { nome: string } }).remetente?.nome?.charAt(0) ?? "?"}
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-xs">{(m as Mensagem & { remetente?: { nome: string } }).remetente?.nome ?? "—"}</p>
                                      <p className={`text-sm ${m.foi_censurado ? "text-yellow-300/70 italic" : "text-white/80"}`}>
                                        {m.conteudo}
                                        {m.foi_censurado && <span className="text-yellow-400/60 ml-1">[censurado]</span>}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {d.status !== "resolvida" && (
                            <>
                              <div>
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Nota de resolução</label>
                                <textarea
                                  rows={2}
                                  value={resolucao[d.id] ?? ""}
                                  onChange={(e) => setResolucao((prev) => ({ ...prev, [d.id]: e.target.value }))}
                                  placeholder="Descreva a decisão tomada..."
                                  className="w-full px-4 py-3 rounded-xl glass-card border border-white/10 focus:border-[rgba(224,248,9,0.3)] text-white bg-transparent outline-none text-sm placeholder-white/30 resize-none"
                                />
                              </div>
                              <div className="flex flex-wrap gap-3">
                                <button onClick={() => resolveDisputa(d.id, d.transacao_id, "liberar_vendedor")} disabled={!!actionLoading}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/30 transition-all disabled:opacity-50">
                                  {actionLoading === `${d.id}-liberar_vendedor` ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                  Liberar para vendedor
                                </button>
                                <button onClick={() => resolveDisputa(d.id, d.transacao_id, "reembolsar_comprador")} disabled={!!actionLoading}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-sm font-medium hover:bg-red-500/25 transition-all disabled:opacity-50">
                                  {actionLoading === `${d.id}-reembolsar_comprador` ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                  Reembolsar comprador
                                </button>
                                <button onClick={() => resolveDisputa(d.id, d.transacao_id, "solicitar_info")} disabled={!!actionLoading}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-white/50 text-sm font-medium hover:text-white hover:border-white/25 transition-all disabled:opacity-50">
                                  {actionLoading === `${d.id}-solicitar_info` ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                                  Solicitar mais informações
                                </button>
                              </div>
                            </>
                          )}

                          {d.status === "resolvida" && d.resolucao && (
                            <div className="flex gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <p className="text-green-300 text-sm">{d.resolucao}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── VERIFICAÇÃO OURO TAB ──────────────────────── */}
        {activeTab === "verificacoes" && (
          <>
            <div className="flex gap-2 mb-6 flex-wrap">
              {(["pendente", "aprovado", "rejeitado"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setVFilter(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                    vFilter === s ? "bg-white/15 text-white border border-white/20" : "text-white/40 hover:text-white/70"
                  }`}
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {s === "pendente" ? "Pendentes" : s === "aprovado" ? "Aprovados" : "Rejeitados"}
                </button>
              ))}
              <button onClick={loadVerificacoes} className="ml-auto p-2 rounded-xl glass-card border border-white/10 text-white/40 hover:text-white transition-colors" title="Recarregar">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {vLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
              </div>
            ) : filteredVerificacoes.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
                  {vFilter === "pendente" ? "Nenhuma solicitação pendente" : "Nenhum registro encontrado"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVerificacoes.map((doc) => (
                  <div key={doc.id} className="glass-card p-5">
                    <div className="flex items-start gap-4 flex-wrap">
                      {/* User info */}
                      <div className="w-10 h-10 rounded-full bg-[#6b00b3]/30 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-[#6b00b3]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-white font-bold text-base" style={{ fontFamily: "Syne, sans-serif" }}>
                            {doc.profile?.nome ?? "Usuário desconhecido"}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs border ${
                            doc.status === "pendente" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" :
                            doc.status === "aprovado" ? "bg-green-500/15 text-green-400 border-green-500/30" :
                            "bg-red-500/15 text-red-400 border-red-500/30"
                          }`}>
                            {doc.status === "pendente" ? "Pendente" : doc.status === "aprovado" ? "Aprovado" : "Rejeitado"}
                          </span>
                          <span className="text-white/30 text-xs">{formatDateTime(doc.created_at)}</span>
                        </div>

                        <p className="text-white/50 text-sm mb-1">
                          Tipo: <span className="text-white/70">{doc.tipo_documento?.replace("_", " ")}</span>
                          {" · "}
                          Nível atual: <span className="text-yellow-400 capitalize">{doc.profile?.nivel_verificacao ?? "bronze"}</span>
                        </p>

                        {/* Document preview link */}
                        <a
                          href={doc.url_documento}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#6b00b3] hover:text-[#e0408a] text-sm transition-colors mt-1"
                        >
                          <Eye className="w-4 h-4" />
                          Visualizar documento
                        </a>
                      </div>

                      {/* Actions */}
                      {doc.status === "pendente" && (
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <button
                            onClick={() => approveVerification(doc)}
                            disabled={!!vActionLoading}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition-all disabled:opacity-50"
                            style={{ fontFamily: "Syne, sans-serif" }}
                          >
                            {vActionLoading === `approve-${doc.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>🥇</span>}
                            Aprovar → Ouro
                          </button>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Motivo da rejeição..."
                              value={rejeitarNota[doc.id] ?? ""}
                              onChange={(e) => setRejeitarNota((prev) => ({ ...prev, [doc.id]: e.target.value }))}
                              className="flex-1 min-w-0 px-3 py-2 rounded-xl glass-card border border-white/10 focus:border-red-500/40 text-white bg-transparent outline-none text-xs placeholder-white/30"
                            />
                            <button
                              onClick={() => rejectVerification(doc)}
                              disabled={!!vActionLoading}
                              className="px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 transition-all disabled:opacity-50 flex-shrink-0"
                              title="Rejeitar"
                            >
                              {vActionLoading === `reject-${doc.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {doc.status === "aprovado" && (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Aprovado — nível Ouro
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
