"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { MessageCircle, Mail, Clock, CheckCircle, AlertCircle, Loader2, Shield } from "lucide-react";

const FONT = '"Satoshi", "DM Sans", sans-serif';
const GRAD = "linear-gradient(135deg, #FF1F5A 0%, #FF7032 100%)";

const TOPICS = [
  "Problema com pagamento",
  "Ingresso não recebido",
  "Problema com minha conta",
  "Dúvida sobre verificação",
  "Reportar fraude / anúncio suspeito",
  "Sugestão de melhoria",
  "Outro assunto",
];

export default function ContatoPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [transacaoId, setTransacaoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !email || !topic || !mensagem) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.80)",
    border: "1px solid rgba(0,0,0,0.10)",
    color: "#0F0F0F",
    fontSize: 14,
    fontFamily: FONT,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  if (sent) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: FONT }}>
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle style={{ width: 30, height: 30, color: "#22c55e" }} />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0F0F0F", margin: "0 0 12px", fontFamily: FONT }}>Mensagem enviada!</h2>
          <p style={{ fontSize: 14, color: "rgba(15,15,15,0.58)", lineHeight: 1.65, margin: "0 0 8px" }}>
            Recebemos seu contato. Nossa equipe responderá em até <strong style={{ color: "#0F0F0F" }}>48 horas úteis</strong> no e-mail{" "}
            <strong style={{ color: "#0F0F0F" }}>{email}</strong>.
          </p>
          <p style={{ fontSize: 12, color: "rgba(15,15,15,0.35)", margin: 0 }}>Verifique sua caixa de spam se não receber nossa resposta.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", fontFamily: FONT, color: "#0F0F0F" }}>
      {/* Hero */}
      <section style={{ padding: "72px 24px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "25%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,90,0.08), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F0F0F", margin: "0 0 16px", fontFamily: FONT }}>
            Como podemos <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ajudar?</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(15,15,15,0.55)", lineHeight: 1.65, margin: 0 }}>
            Nossa equipe responde em até 48 horas úteis. Para urgências relacionadas a transações em andamento, abra uma disputa diretamente na plataforma.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }} className="grid-cols-1 lg:grid-cols-3">

          {/* Info Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { Icon: Mail, color: "#FF1F5A", title: "E-mail", text: "suporte@ingressolivre.com" },
              { Icon: Clock, color: "#FF7032", title: "Tempo de resposta", text: "Até 48 horas úteis\nSegunda a Sábado" },
            ].map(({ Icon, color, title, text }) => (
              <div key={title} style={{ background: "rgba(255,255,255,0.70)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,31,90,0.10)", borderRadius: 16, padding: 20 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Icon style={{ width: 18, height: 18, color }} />
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>{title}</h3>
                <p style={{ fontSize: 12, color: "rgba(15,15,15,0.45)", margin: 0, whiteSpace: "pre-line" }}>{text}</p>
              </div>
            ))}

            <div style={{ background: "rgba(255,255,255,0.70)", backdropFilter: "blur(12px)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 16, padding: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(34,197,94,0.10)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Shield style={{ width: 18, height: 18, color: "#22c55e" }} />
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>Disputas urgentes</h3>
              <p style={{ fontSize: 12, color: "rgba(15,15,15,0.45)", margin: 0, lineHeight: 1.55 }}>
                Para problemas com uma transação em andamento, use o botão <strong style={{ color: "rgba(15,15,15,0.65)" }}>&ldquo;Tive um problema&rdquo;</strong> em Minhas Compras.
              </p>
            </div>

            <div style={{ background: "rgba(255,200,0,0.06)", border: "1px solid rgba(255,200,0,0.18)", borderRadius: 16, padding: 16 }}>
              <MessageCircle style={{ width: 16, height: 16, color: "#d97706", marginBottom: 8 }} />
              <p style={{ fontSize: 12, color: "rgba(15,15,15,0.50)", margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: "rgba(15,15,15,0.70)" }}>Dica:</strong> Para agilizar, inclua o ID da transação e prints do chat ao descrever seu problema.
              </p>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: "rgba(255,255,255,0.70)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,31,90,0.10)", borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F0F0F", margin: "0 0 24px", fontFamily: FONT }}>Enviar mensagem</h2>

            {error && (
              <div style={{ display: "flex", gap: 10, padding: 14, borderRadius: 12, background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.18)", marginBottom: 20 }}>
                <AlertCircle style={{ width: 16, height: 16, color: "#ff4444", flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#cc2222", margin: 0 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(15,15,15,0.65)", marginBottom: 6, fontFamily: FONT }}>
                    Nome <span style={{ color: "#FF1F5A" }}>*</span>
                  </label>
                  <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Seu nome" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(15,15,15,0.65)", marginBottom: 6, fontFamily: FONT }}>
                    E-mail <span style={{ color: "#FF1F5A" }}>*</span>
                  </label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(15,15,15,0.65)", marginBottom: 6, fontFamily: FONT }}>
                  Assunto <span style={{ color: "#FF1F5A" }}>*</span>
                </label>
                <select value={topic} onChange={(e) => setTopic(e.target.value)} required style={{ ...inputStyle, background: "rgba(255,255,255,0.90)" }}>
                  <option value="">Selecione o assunto...</option>
                  {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(15,15,15,0.65)", marginBottom: 6, fontFamily: FONT }}>
                  ID da transação <span style={{ color: "rgba(15,15,15,0.35)", fontWeight: 400 }}>(opcional)</span>
                </label>
                <input type="text" value={transacaoId} onChange={(e) => setTransacaoId(e.target.value)} placeholder="ex: 550e8400-e29b-41d4-a716-..." style={inputStyle} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(15,15,15,0.65)", marginBottom: 6, fontFamily: FONT }}>
                  Mensagem <span style={{ color: "#FF1F5A" }}>*</span>
                </label>
                <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} required rows={5} placeholder="Descreva seu problema ou dúvida com o máximo de detalhes..." style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }} />
              </div>

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px 24px", borderRadius: 999, background: loading ? "rgba(0,0,0,0.15)" : GRAD, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, transition: "all 0.2s" }}>
                {loading ? <><Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> Enviando...</> : "Enviar mensagem"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
