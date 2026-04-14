"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, AlertCircle, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import StepIndicator from "@/components/StepIndicator";
import type { TipoIngresso } from "@/types/database";
import { TIPO_INGRESSO_LABELS, formatCurrency, calcTaxa } from "@/lib/utils";

const FONT = '"Satoshi", "DM Sans", sans-serif';
const GRAD = "linear-gradient(135deg, #FF1F5A 0%, #FF7032 100%)";

const STEPS = [
  { label: "Evento" }, { label: "Ingresso" }, { label: "Detalhes" }, { label: "Foto" }, { label: "Publicar" },
];

const TIPOS: TipoIngresso[] = ["pista", "pista_vip", "camarote", "meia_entrada", "open_bar", "vip", "backstage"];

interface FormData {
  eventoNome: string; eventoData: string; eventoHorario: string; eventoLocal: string;
  eventoCidade: string; eventoEstado: string;
  tipoIngresso: TipoIngresso | ""; quantidade: number; preco: number;
  observacoes: string; aceitaTransferenciaTitular: boolean;
  imagemFile: File | null; imagemPreview: string | null;
}

const INITIAL: FormData = {
  eventoNome: "", eventoData: "", eventoHorario: "", eventoLocal: "",
  eventoCidade: "", eventoEstado: "",
  tipoIngresso: "", quantidade: 1, preco: 0,
  observacoes: "", aceitaTransferenciaTitular: false,
  imagemFile: null, imagemPreview: null,
};

const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "rgba(15,15,15,0.60)", marginBottom: 6, fontFamily: FONT } as const;
const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 12,
  background: "rgba(255,255,255,0.85)", border: "1px solid rgba(0,0,0,0.10)",
  color: "#0F0F0F", fontSize: 14, fontFamily: FONT, outline: "none",
  boxSizing: "border-box" as const, transition: "border-color 0.2s",
};

export default function VenderPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [published, setPublished] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (!data.user) router.push("/login?next=/vender"); });
  }, []); // eslint-disable-line

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    update("imagemFile", file);
    const reader = new FileReader();
    reader.onload = (ev) => update("imagemPreview", ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handlePublish() {
    setLoading(true); setError("");
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Não autenticado");
      const { data: evento, error: evErr } = await supabase.from("eventos").insert({
        nome: form.eventoNome, data: form.eventoData, horario: form.eventoHorario,
        local: form.eventoLocal, cidade: form.eventoCidade, estado: form.eventoEstado,
      }).select().single();
      if (evErr || !evento) throw new Error("Erro ao salvar evento");
      let imagemUrl: string | null = null;
      if (form.imagemFile) {
        const path = `ingressos/${userData.user.id}/${Date.now()}-${form.imagemFile.name}`;
        const { error: upErr } = await supabase.storage.from("ingressos").upload(path, form.imagemFile, { contentType: form.imagemFile.type });
        if (!upErr) { const { data: urlData } = supabase.storage.from("ingressos").getPublicUrl(path); imagemUrl = urlData.publicUrl; }
      }
      const { data: anuncio, error: anErr } = await supabase.from("anuncios").insert({
        vendedor_id: userData.user.id, evento_id: evento.id, tipo_ingresso: form.tipoIngresso as TipoIngresso,
        quantidade: form.quantidade, preco: form.preco, observacoes: form.observacoes || null,
        imagem_ingresso_url: imagemUrl, aceita_transferencia_titular: form.aceitaTransferenciaTitular,
        status: "ativo", destaque: false,
      }).select().single();
      if (anErr || !anuncio) throw new Error("Erro ao publicar anúncio");
      setPublishedId(anuncio.id); setPublished(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally { setLoading(false); }
  }

  function validateStep(): boolean {
    setError("");
    if (step === 0 && (!form.eventoNome || !form.eventoData || !form.eventoHorario || !form.eventoLocal || !form.eventoCidade || !form.eventoEstado)) {
      setError("Preencha todos os campos do evento"); return false;
    }
    if (step === 1) {
      if (!form.tipoIngresso) { setError("Selecione o tipo de ingresso"); return false; }
      if (form.preco <= 0) { setError("Informe um preço válido"); return false; }
    }
    return true;
  }

  function nextStep() { if (validateStep()) setStep((s) => s + 1); }

  if (published && publishedId) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: FONT }}>
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32, boxShadow: "0 8px 24px rgba(255,31,90,0.35)" }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0F0F0F", margin: "0 0 10px", fontFamily: FONT }}>Anúncio publicado!</h2>
          <p style={{ fontSize: 14, color: "rgba(15,15,15,0.50)", margin: "0 0 28px", lineHeight: 1.65 }}>Seu ingresso está no ar. Você será notificado quando alguém comprar.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => router.push(`/ingresso/${publishedId}`)} style={{ width: "100%", padding: "14px", borderRadius: 999, background: GRAD, color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: FONT }}>
              Ver anúncio
            </button>
            <button onClick={() => { setForm(INITIAL); setStep(0); setPublished(false); setPublishedId(null); }} style={{ width: "100%", padding: "14px", borderRadius: 999, background: "rgba(0,0,0,0.07)", color: "rgba(15,15,15,0.65)", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", fontFamily: FONT }}>
              Criar outro anúncio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", padding: "48px 24px 80px", fontFamily: FONT, color: "#0F0F0F" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#0F0F0F", margin: "0 0 6px", fontFamily: FONT, letterSpacing: "-0.02em" }}>Vender ingresso</h1>
          <p style={{ fontSize: 14, color: "rgba(15,15,15,0.45)", margin: 0 }}>Preencha os dados e publique em segundos</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
          <StepIndicator steps={STEPS} current={step} />
        </div>

        <div style={{ background: "rgba(255,255,255,0.78)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,31,90,0.10)", borderRadius: 20, padding: 32 }}>
          {error && (
            <div style={{ display: "flex", gap: 8, padding: "12px 14px", borderRadius: 12, background: "rgba(255,68,68,0.07)", border: "1px solid rgba(255,68,68,0.18)", marginBottom: 20 }}>
              <AlertCircle style={{ width: 16, height: 16, color: "#cc2222", flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "#cc2222", margin: 0 }}>{error}</p>
            </div>
          )}

          {/* STEP 0 */}
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>Dados do evento</h2>
              <div>
                <label style={labelStyle}>Nome do evento *</label>
                <input type="text" value={form.eventoNome} onChange={(e) => update("eventoNome", e.target.value)} placeholder="Ex: Rave da Laje — Edição Verão" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Data *</label>
                  <input type="date" value={form.eventoData} onChange={(e) => update("eventoData", e.target.value)} style={{ ...inputStyle, colorScheme: "light" }} />
                </div>
                <div>
                  <label style={labelStyle}>Horário *</label>
                  <input type="time" value={form.eventoHorario} onChange={(e) => update("eventoHorario", e.target.value)} style={{ ...inputStyle, colorScheme: "light" }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Local / Venue *</label>
                <input type="text" value={form.eventoLocal} onChange={(e) => update("eventoLocal", e.target.value)} placeholder="Ex: Clube Pinheiros" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Cidade *</label>
                  <input type="text" value={form.eventoCidade} onChange={(e) => update("eventoCidade", e.target.value)} placeholder="São Paulo" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Estado *</label>
                  <input type="text" maxLength={2} value={form.eventoEstado} onChange={(e) => update("eventoEstado", e.target.value.toUpperCase())} placeholder="SP" style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>Tipo e preço</h2>
              <div>
                <label style={labelStyle}>Tipo de ingresso *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {TIPOS.map((t) => (
                    <button key={t} type="button" onClick={() => update("tipoIngresso", t)} style={{
                      padding: "11px 14px", borderRadius: 12, fontSize: 13, fontWeight: 500, textAlign: "left", fontFamily: FONT, cursor: "pointer", transition: "all 0.15s",
                      border: form.tipoIngresso === t ? "1.5px solid #FF1F5A" : "1.5px solid rgba(0,0,0,0.10)",
                      background: form.tipoIngresso === t ? "rgba(255,31,90,0.07)" : "rgba(255,255,255,0.70)",
                      color: form.tipoIngresso === t ? "#FF1F5A" : "rgba(15,15,15,0.55)",
                    }}>
                      {TIPO_INGRESSO_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Quantidade *</label>
                  <input type="number" min={1} max={20} value={form.quantidade} onChange={(e) => update("quantidade", Number(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Preço por unidade (R$) *</label>
                  <input type="number" min={1} step={0.01} value={form.preco || ""} onChange={(e) => update("preco", Number(e.target.value))} placeholder="0,00" style={inputStyle} />
                </div>
              </div>
              {form.preco > 0 && (
                <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Preço anunciado", value: formatCurrency(form.preco), muted: true },
                    { label: "Taxa da plataforma (4%)", value: `− ${formatCurrency(calcTaxa(form.preco))}`, muted: true },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(15,15,15,0.45)" }}>
                      <span>{label}</span><span>{value}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, color: "#0F0F0F" }}>
                    <span>Você recebe</span>
                    <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{formatCurrency(form.preco - calcTaxa(form.preco))}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>Detalhes adicionais</h2>
              <div>
                <label style={labelStyle}>Observações</label>
                <textarea rows={4} value={form.observacoes} onChange={(e) => update("observacoes", e.target.value)}
                  placeholder="Ex: Ingresso do 2º lote, sem restrições de idade, inclui área premium..."
                  style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }} />
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                <div onClick={() => update("aceitaTransferenciaTitular", !form.aceitaTransferenciaTitular)} style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 2, cursor: "pointer", transition: "all 0.15s",
                  border: form.aceitaTransferenciaTitular ? "2px solid #FF1F5A" : "2px solid rgba(0,0,0,0.18)",
                  background: form.aceitaTransferenciaTitular ? GRAD : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {form.aceitaTransferenciaTitular && <svg style={{ width: 11, height: 11 }} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#0F0F0F", margin: "0 0 2px", fontFamily: FONT }}>Aceita transferência de titular</p>
                  <p style={{ fontSize: 12, color: "rgba(15,15,15,0.40)", margin: 0 }}>O evento permite trocar o nome no ingresso pelo site da produtora</p>
                </div>
              </label>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>Foto do ingresso</h2>
              <p style={{ fontSize: 13, color: "rgba(15,15,15,0.50)", margin: 0 }}>
                Envie uma foto para comprovar que possui o ingresso. <strong style={{ color: "#0F0F0F" }}>Cubra o QR code</strong> antes de fotografar.
              </p>
              <label style={{ cursor: "pointer" }}>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                <div style={{
                  border: `2px dashed ${form.imagemPreview ? "rgba(255,31,90,0.40)" : "rgba(0,0,0,0.15)"}`,
                  borderRadius: 16, padding: 32, textAlign: "center",
                  background: form.imagemPreview ? "rgba(255,31,90,0.04)" : "transparent",
                  transition: "all 0.2s",
                }}>
                  {form.imagemPreview ? (
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.imagemPreview} alt="Preview" style={{ maxHeight: 180, margin: "0 auto", borderRadius: 12, objectFit: "contain", display: "block" }} />
                      <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#FF1F5A", fontSize: 13, fontWeight: 500 }}>
                        <Eye style={{ width: 15, height: 15 }} />
                        Imagem selecionada — clique para trocar
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload style={{ width: 36, height: 36, color: "rgba(15,15,15,0.25)", margin: "0 auto 12px" }} />
                      <p style={{ fontSize: 13, color: "rgba(15,15,15,0.50)", margin: "0 0 4px" }}>Clique para selecionar ou arraste a foto</p>
                      <p style={{ fontSize: 12, color: "rgba(15,15,15,0.30)", margin: 0 }}>PNG, JPG até 5MB</p>
                    </div>
                  )}
                </div>
              </label>
              <div style={{ display: "flex", gap: 8, padding: "12px 14px", borderRadius: 12, background: "rgba(234,179,8,0.07)", border: "1px solid rgba(234,179,8,0.20)" }}>
                <AlertCircle style={{ width: 15, height: 15, color: "#d97706", flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: "rgba(15,15,15,0.55)", margin: 0 }}>Lembre de cobrir o QR code e código de barras para evitar uso indevido antes da venda.</p>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>Confirme e publique</h2>
              <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Evento", value: form.eventoNome },
                  { label: "Data", value: `${form.eventoData} às ${form.eventoHorario}` },
                  { label: "Local", value: `${form.eventoLocal} — ${form.eventoCidade}/${form.eventoEstado}` },
                  { label: "Tipo", value: form.tipoIngresso ? TIPO_INGRESSO_LABELS[form.tipoIngresso as TipoIngresso] : "—" },
                  { label: "Quantidade", value: String(form.quantidade) },
                  { label: "Preço", value: formatCurrency(form.preco) },
                  { label: "Você recebe", value: formatCurrency(form.preco - calcTaxa(form.preco)) },
                  { label: "Transferência titular", value: form.aceitaTransferenciaTitular ? "Sim" : "Não" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
                    <span style={{ color: "rgba(15,15,15,0.45)" }}>{label}</span>
                    <span style={{ color: "#0F0F0F", fontWeight: 600, textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={handlePublish} disabled={loading} style={{
                width: "100%", padding: "16px", borderRadius: 999, background: loading ? "rgba(0,0,0,0.15)" : GRAD,
                color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT,
                boxShadow: loading ? "none" : "0 4px 16px rgba(255,31,90,0.30)", transition: "all 0.2s",
              }}>
                {loading ? <><Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> Publicando...</> : "Publicar anúncio grátis"}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: step === 0 ? "flex-end" : "space-between" }}>
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} style={{ padding: "12px 24px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.12)", color: "rgba(15,15,15,0.60)", fontSize: 14, fontWeight: 600, background: "transparent", cursor: "pointer", fontFamily: FONT }}>
                ← Voltar
              </button>
            )}
            {step < STEPS.length - 1 && (
              <button onClick={nextStep} style={{ padding: "12px 28px", borderRadius: 999, background: GRAD, color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: FONT, boxShadow: "0 3px 12px rgba(255,31,90,0.28)" }}>
                Próximo →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
