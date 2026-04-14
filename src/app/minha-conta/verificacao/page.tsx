"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Upload, CheckCircle, Clock, AlertCircle, Loader2, Shield, Star, Gem } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import SellerBadge from "@/components/SellerBadge";
import type { Profile, VerificacaoDocumento, NivelVerificacao } from "@/types/database";
import { formatCurrency } from "@/lib/utils";

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

const DOCS_REQUIRED = [
  { tipo: "rg" as const, label: "RG ou CNH (frente)", hint: "Foto nítida do documento" },
  { tipo: "comprovante_residencia" as const, label: "Comprovante de residência", hint: "Conta de luz, água ou telefone (últimos 3 meses)" },
  { tipo: "selfie" as const, label: "Selfie com documento", hint: "Segure o documento ao lado do rosto" },
];

export default function VerificacaoPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [docs, setDocs] = useState<VerificacaoDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [cpf, setCpf] = useState("");
  const [savingCpf, setSavingCpf] = useState(false);
  const [mpLoading, setMpLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login?next=/minha-conta/verificacao"); return; }
      loadData(data.user.id);
    });
  }, []);

  async function loadData(userId: string) {
    const [profileRes, docsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("verificacao_documentos").select("*").eq("user_id", userId),
    ]);
    setProfile((profileRes.data ?? null) as Profile | null);
    setDocs((docsRes.data as VerificacaoDocumento[]) ?? []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCpf((profileRes.data as any)?.cpf ?? "");
    setLoading(false);
  }

  async function saveCpf() {
    if (!profile || !cpf || cpf.replace(/\D/g, "").length !== 11) return;
    setSavingCpf(true);
    await supabase.from("profiles").update({ cpf }).eq("id", profile.id);
    setProfile((p) => p ? { ...p, cpf } : p);
    setSavingCpf(false);
  }

  async function uploadDoc(tipo: VerificacaoDocumento["tipo"], file: File) {
    if (!profile) return;
    setUploading(tipo);
    const path = `verificacao/${profile.id}/${tipo}-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("documentos").upload(path, file, { upsert: true });
    if (error) { setUploading(null); return; }
    const { data: urlData } = supabase.storage.from("documentos").getPublicUrl(path);
    const existing = docs.find((d) => d.tipo === tipo);
    if (existing) {
      await supabase.from("verificacao_documentos").update({ arquivo_url: urlData.publicUrl, status: "pendente" }).eq("id", existing.id);
    } else {
      await supabase.from("verificacao_documentos").insert({ user_id: profile.id, tipo, arquivo_url: urlData.publicUrl, status: "pendente" });
    }
    const { data: newDocs } = await supabase.from("verificacao_documentos").select("*").eq("user_id", profile.id);
    setDocs((newDocs as VerificacaoDocumento[]) ?? []);
    setUploading(null);
  }

  async function subscribeDiamante() {
    setMpLoading(true);
    const res = await fetch("/api/pagamento/assinatura", { method: "POST" });
    const json = await res.json();
    if (json.init_point) window.open(json.init_point, "_blank");
    setMpLoading(false);
  }

  const allDocsUploaded = DOCS_REQUIRED.every((d) => docs.find((doc) => doc.tipo === d.tipo));
  const allDocsApproved = DOCS_REQUIRED.every((d) => docs.find((doc) => doc.tipo === d.tipo && doc.status === "aprovado"));
  const nivel = profile?.nivel_verificacao ?? "bronze";

  const levelCards: { level: NivelVerificacao; icon: typeof Shield; title: string; price: string; items: string[]; color: string; bg: string }[] = [
    { level: "bronze", icon: Shield, title: "Bronze", price: "Grátis", items: ["E-mail verificado", "CPF cadastrado", "Badge Bronze"], color: "#CD7F32", bg: "rgba(205,127,50,0.10)" },
    { level: "ouro", icon: Star, title: "Ouro", price: "Grátis", items: ["Tudo do Bronze", "Documentos verificados", "Revisão em 48h", "Badge Ouro"], color: "#e6a800", bg: "rgba(230,168,0,0.10)" },
    { level: "diamante", icon: Gem, title: "Diamante", price: "R$ 10/mês", items: ["Tudo do Ouro", "Anúncios em destaque", "Badge Diamante", "Faixa Premium"], color: "#FF1F5A", bg: "rgba(255,31,90,0.08)" },
  ];

  return (
    <div style={{ minHeight: "100dvh", padding: "80px 24px 48px", fontFamily: FONT }}>
      <div style={{ maxWidth: 660, margin: "0 auto" }}>

        {/* Tab nav */}
        <div style={{ display: "flex", gap: 4, marginBottom: 32, background: "rgba(255,255,255,0.70)", backdropFilter: "blur(12px)", padding: 4, width: "fit-content", borderRadius: 16, border: "1px solid rgba(255,31,90,0.12)", overflowX: "auto" }}>
          {TABS.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: "8px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.2s", fontFamily: FONT,
              background: pathname === href ? GRAD : "transparent",
              color: pathname === href ? "#fff" : "rgba(15,15,15,0.55)",
            }}>
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <Shield style={{ width: 22, height: 22, color: "#FF1F5A" }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F0F0F", margin: 0, fontFamily: FONT }}>Verificação de vendedor</h1>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => <div key={i} style={{ height: 120, borderRadius: 16, background: "rgba(0,0,0,0.06)" }} />)}
          </div>
        ) : (
          <>
            {/* Current level */}
            <div style={{ ...CARD, display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Shield style={{ width: 22, height: 22, color: "#fff" }} />
              </div>
              <div>
                <p style={{ fontSize: 11, color: "rgba(15,15,15,0.45)", margin: "0 0 4px" }}>Seu nível atual</p>
                {profile && <SellerBadge level={nivel} size="lg" />}
              </div>
            </div>

            {/* Level cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {levelCards.map((card) => {
                const Icon = card.icon;
                const isActive = nivel === card.level;
                const levels: NivelVerificacao[] = ["bronze", "ouro", "diamante"];
                const isAchieved = levels.indexOf(nivel) >= levels.indexOf(card.level);
                return (
                  <div key={card.level} style={{ ...CARD, border: isActive ? `1px solid ${card.color}50` : "1px solid rgba(0,0,0,0.08)", background: isActive ? card.bg : "rgba(255,255,255,0.80)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: card.bg, border: `1px solid ${card.color}30`, flexShrink: 0 }}>
                        <Icon style={{ width: 18, height: 18, color: card.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#0F0F0F", fontFamily: FONT }}>Nível {card.title}</span>
                          {isAchieved && <CheckCircle style={{ width: 14, height: 14, color: "#16a34a" }} />}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: card.color }}>{card.price}</span>
                      </div>
                    </div>
                    <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                      {card.items.map((item) => (
                        <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(15,15,15,0.55)" }}>
                          <CheckCircle style={{ width: 12, height: 12, color: "rgba(15,15,15,0.25)", flexShrink: 0 }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* CPF section */}
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F0F0F", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT }}>
                <Shield style={{ width: 16, height: 16, color: "#CD7F32" }} />
                Nível Bronze — CPF
              </h2>
              <div style={CARD}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(15,15,15,0.55)", marginBottom: 8 }}>CPF</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.10)", background: "rgba(255,255,255,0.85)", color: "#0F0F0F", fontSize: 14, outline: "none", fontFamily: FONT }}
                  />
                  <button onClick={saveCpf} disabled={savingCpf || !cpf}
                    style={{ padding: "10px 18px", borderRadius: 10, background: GRAD, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: (savingCpf || !cpf) ? 0.6 : 1, fontFamily: FONT }}>
                    {savingCpf ? <Loader2 style={{ width: 14, height: 14 }} /> : "Salvar"}
                  </button>
                </div>
                <p style={{ fontSize: 11, color: "rgba(15,15,15,0.35)", margin: "8px 0 0" }}>Seu CPF não será exibido publicamente.</p>
                {profile?.cpf && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, color: "#16a34a", fontSize: 13 }}>
                    <CheckCircle style={{ width: 14, height: 14 }} />
                    CPF cadastrado
                  </div>
                )}
              </div>
            </section>

            {/* Documents section */}
            {nivel === "bronze" && (
              <section style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F0F0F", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT }}>
                  <Star style={{ width: 16, height: 16, color: "#e6a800" }} />
                  Nível Ouro — Documentos
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {DOCS_REQUIRED.map((docReq) => {
                    const uploaded = docs.find((d) => d.tipo === docReq.tipo);
                    return (
                      <div key={docReq.tipo} style={{ ...CARD, display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          background: uploaded?.status === "aprovado" ? "rgba(34,197,94,0.10)" : uploaded?.status === "pendente" ? "rgba(245,158,11,0.10)" : "rgba(0,0,0,0.05)",
                        }}>
                          {uploaded?.status === "aprovado" ? <CheckCircle style={{ width: 16, height: 16, color: "#16a34a" }} />
                            : uploaded?.status === "pendente" ? <Clock style={{ width: 16, height: 16, color: "#d97706" }} />
                            : <Upload style={{ width: 16, height: 16, color: "rgba(15,15,15,0.30)" }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#0F0F0F", margin: "0 0 2px", fontFamily: FONT }}>{docReq.label}</p>
                          <p style={{ fontSize: 11, color: "rgba(15,15,15,0.45)", margin: 0 }}>{docReq.hint}</p>
                          {uploaded?.status === "pendente" && <span style={{ fontSize: 11, color: "#d97706" }}>Em análise...</span>}
                          {uploaded?.status === "rejeitado" && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#dc2626" }}>
                              <AlertCircle style={{ width: 11, height: 11 }} />
                              Rejeitado — reenvie
                            </span>
                          )}
                        </div>
                        {uploaded?.status !== "aprovado" && (
                          <label style={{ cursor: "pointer", flexShrink: 0 }}>
                            <input type="file" accept="image/*,.pdf" style={{ display: "none" }}
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDoc(docReq.tipo, f); }}
                            />
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 9, border: "1px solid rgba(255,31,90,0.25)", color: "#FF1F5A", fontSize: 12, fontWeight: 600, fontFamily: FONT, opacity: uploading === docReq.tipo ? 0.5 : 1 }}>
                              {uploading === docReq.tipo ? <Loader2 style={{ width: 13, height: 13 }} /> : <Upload style={{ width: 13, height: 13 }} />}
                              {uploaded ? "Reenviar" : "Enviar"}
                            </div>
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>

                {allDocsUploaded && !allDocsApproved && (
                  <div style={{ display: "flex", gap: 10, padding: 14, borderRadius: 12, background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.20)", marginTop: 12 }}>
                    <Clock style={{ width: 16, height: 16, color: "#d97706", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", margin: "0 0 2px" }}>Documentos enviados!</p>
                      <p style={{ fontSize: 11, color: "rgba(146,64,14,0.65)", margin: 0 }}>Nossa equipe analisará em até 48h.</p>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Diamante section */}
            {(nivel === "ouro" || allDocsApproved) && nivel !== "diamante" && (
              <section>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F0F0F", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT }}>
                  <Gem style={{ width: 16, height: 16, color: "#FF1F5A" }} />
                  Nível Diamante — Assinatura
                </h2>
                <div style={{ ...CARD, textAlign: "center", background: "rgba(255,31,90,0.04)", border: "1px solid rgba(255,31,90,0.18)" }}>
                  <p style={{ fontSize: 30, fontWeight: 900, margin: "0 0 2px", background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: FONT }}>
                    {formatCurrency(10)}<span style={{ fontSize: 14, fontWeight: 500, WebkitTextFillColor: "rgba(15,15,15,0.45)" }}>/mês</span>
                  </p>
                  <p style={{ fontSize: 13, color: "rgba(15,15,15,0.50)", margin: "0 0 20px" }}>Anúncios em destaque, badge exclusivo e maior visibilidade</p>
                  <button onClick={subscribeDiamante} disabled={mpLoading}
                    style={{ width: "100%", padding: "14px 0", borderRadius: 999, background: GRAD, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: mpLoading ? 0.7 : 1, fontFamily: FONT }}>
                    {mpLoading ? <Loader2 style={{ width: 18, height: 18 }} /> : "Assinar Diamante"}
                  </button>
                  <p style={{ fontSize: 11, color: "rgba(15,15,15,0.35)", margin: "10px 0 0" }}>Cancele quando quiser. Sem fidelidade.</p>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
