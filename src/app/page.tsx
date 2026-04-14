export const dynamic = "force-dynamic";

import Link from "next/link";

const NAV_LINKS = [
  { label: "Como funciona", href: "/como-funciona" },
  { label: "Segurança", href: "/seguranca" },
  { label: "Vender", href: "/vender" },
  { label: "Contato", href: "/contato" },
];

const TIERS = [
  { name: "Bronze", emoji: "🥉", sub: "Nível inicial", desc: "E-mail e CPF verificados. Todos os vendedores começam aqui." },
  { name: "Ouro", emoji: "🥇", sub: "Verificado", desc: "Identidade revisada manualmente pela equipe IngressoLivre." },
  { name: "Diamante", emoji: "💎", sub: "Premium", desc: "Aparece primeiro nas buscas. Badge exclusivo. Assinante ativo." },
];

const TESTIMONIALS = [
  { name: "Camila R.", city: "São Paulo", text: "Comprei ingressos para o Lolla e cheguei com tudo certo. Processo foi ridiculamente simples.", bg: "#FFF0F3", wide: true },
  { name: "Rafael M.", city: "Rio de Janeiro", text: "Vendi meus ingressos que não ia usar e recebi o pagamento no mesmo dia.", bg: "#FFF7ED", wide: false },
  { name: "Beatriz L.", city: "Belo Horizonte", text: "O escrow me deu segurança de verdade. Só confirmei após entrar no evento.", bg: "#F0FFF4", wide: false },
  { name: "Pedro A.", city: "Curitiba", text: "Tentei WhatsApp antes e fui quase roubado. No IngressoLivre é outra realidade completamente diferente.", bg: "#FFF0F3", wide: true },
  { name: "Isabela F.", city: "Brasília", text: "Vendi em 2 horas. O sistema notifica o comprador, organiza tudo.", bg: "#FFF7ED", wide: false },
  { name: "Lucas T.", city: "Florianópolis", text: "A taxa é mínima e o processo é transparente. Usarei sempre que precisar.", bg: "#F0FFF4", wide: false },
];

const FONT = '"Satoshi", "Helvetica Neue", Helvetica, Arial, sans-serif';
const GRAD = "linear-gradient(135deg, #FF1F5A 0%, #FF7032 100%)";
const BG = "#EDEAE6";
const HERO_BG = [
  "radial-gradient(ellipse at 80% 38%, rgba(255,110,20,0.98) 0%, transparent 62%)",
  "radial-gradient(ellipse at 22% 68%, rgba(255,15,85,0.98) 0%, transparent 62%)",
  "radial-gradient(ellipse at 55% 12%, rgba(255,50,130,0.90) 0%, transparent 55%)",
  "radial-gradient(ellipse at 48% 95%, rgba(255,0,75,0.88) 0%, transparent 52%)",
  "#F2EEE9",
].join(", ");

export default function LandingPage() {
  const year = new Date().getFullYear();

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto"
      style={{ background: BG, fontFamily: FONT, color: "#0F0F0F" }}
      id="landing-scroll"
    >

      {/* ══════════════════════════════════════════════ */}
      {/* GRADIENT TOP SECTION — navbar island + hero + stats */}
      {/* ══════════════════════════════════════════════ */}
      <div style={{ background: HERO_BG, position: "relative" }}>

        {/* Grain overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.90,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.60' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat", backgroundSize: "180px 180px",
          mixBlendMode: "soft-light",
        }} />

        {/* Navbar island */}
        <div style={{ position: "sticky", top: 12, zIndex: 50, padding: "12px 20px 0" }}>
          <nav style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            borderRadius: 18,
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            columnGap: 24,
            alignItems: "center",
            padding: "0 24px",
            height: 52,
            boxShadow: "0 2px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
            fontFamily: FONT,
          }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.03em", color: "#0F0F0F" }}>
                Ingresso
                <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Livre
                </span>
              </span>
            </Link>

            <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center" }}>
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} style={{ fontSize: 13, fontWeight: 500, color: "#0F0F0F", textDecoration: "none", opacity: 0.6, whiteSpace: "nowrap" }}>
                  {l.label}
                </Link>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
              <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: "#0F0F0F", textDecoration: "none", opacity: 0.55, whiteSpace: "nowrap" }}>
                Entrar
              </Link>
              <Link href="/cadastro" style={{ background: GRAD, color: "#fff", fontWeight: 700, fontSize: 13, padding: "9px 20px", borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap" }}>
                Criar conta
              </Link>
            </div>
          </nav>
        </div>

        {/* Hero */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "52px 40px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>

          {/* Left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.14)", borderRadius: 999, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "#0F0F0F", whiteSpace: "nowrap", marginBottom: 28 }}>
              🎉 Marketplace seguro de ingressos
            </div>

            <h1 style={{ fontSize: "clamp(48px, 5.5vw, 76px)", fontWeight: 700, lineHeight: 0.97, letterSpacing: "-0.04em", color: "#0F0F0F", margin: "0 0 24px 0", fontFamily: FONT }}>
              Compre e venda{" "}
              <span style={{ color: "#0F0F0F" }}>
                ingressos
              </span>{" "}
              sem medo.
            </h1>

            <p style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(0,0,0,0.72)", margin: "0 0 36px 0", maxWidth: 420, fontWeight: 400 }}>
              Pagamento em escrow, chat protegido e reembolso automático. A festa começa aqui.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/buscar" style={{ background: "#0F0F0F", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 28px", borderRadius: 999, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                Encontrar ingressos →
              </Link>
              <Link href="/vender" style={{ background: "rgba(255,255,255,0.80)", color: "#0F0F0F", fontWeight: 600, fontSize: 15, padding: "14px 28px", borderRadius: 999, textDecoration: "none", display: "inline-flex", alignItems: "center", backdropFilter: "blur(8px)" }}>
                Quero vender
              </Link>
            </div>
          </div>

          {/* Right — photo */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", aspectRatio: "3/4", maxHeight: 400, width: "100%", maxWidth: 300 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" alt="Pessoas em festa" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} fetchPriority="high" />
            </div>
          </div>
        </div>

        {/* Stats — same gradient background, no divider */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "8px 40px 72px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
            {[
              { value: "12.000+", label: "ingressos vendidos com segurança" },
              { value: "R$0", label: "taxa para compradores" },
              { value: "4.9/5", label: "avaliação média dos vendedores" },
            ].map((s, i) => (
              <div key={s.value} style={{ paddingLeft: i === 0 ? 0 : 40, borderLeft: i === 0 ? "none" : "1px solid rgba(0,0,0,0.12)" }}>
                <div style={{ fontSize: "clamp(40px, 4vw, 60px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#0F0F0F", fontFamily: FONT }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", marginTop: 8, fontWeight: 400, maxWidth: 180 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      {/* end gradient section */}


      {/* ══════════════════════════════════════════════ */}
      {/* CTA INTERMEDIÁRIO */}
      {/* ══════════════════════════════════════════════ */}
      <section style={{ textAlign: "center", padding: "64px 40px", background: "#F7F4F0" }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(0,0,0,0.35)", textTransform: "uppercase", marginBottom: 20 }}>
          Marketplace de ingressos
        </p>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#0F0F0F", maxWidth: 600, margin: "0 auto 32px", fontFamily: FONT }}>
          Encontre ingressos, comece agora.
        </h2>
        <Link href="/buscar" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0F0F0F", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 28px", borderRadius: 999, textDecoration: "none" }}>
          Explorar ingressos →
        </Link>
      </section>


      {/* ══════════════════════════════════════════════ */}
      {/* FULL-BLEED PHOTO + TIER CARDS */}
      {/* ══════════════════════════════════════════════ */}
      <section style={{ padding: "48px 32px" }}>
        <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", minHeight: 520 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1400&q=80" alt="Festival" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)" }} />

          <div style={{ position: "relative", zIndex: 2, padding: "52px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 520 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 16 }}>
                Vendedores verificados
              </p>
              <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: "#fff", maxWidth: 560, margin: 0, fontFamily: FONT }}>
                Compre de quem você pode confiar.
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 48 }}>
              {TIERS.map((tier) => (
                <div key={tier.name} style={{ background: "#fff", borderRadius: 20, padding: "24px 24px 28px" }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{tier.emoji}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "#0F0F0F", marginBottom: 4, fontFamily: FONT }}>{tier.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.4)", marginBottom: 10 }}>{tier.sub}</div>
                  <p style={{ fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.5, margin: 0 }}>{tier.desc}</p>
                  <div style={{ marginTop: 20 }}>
                    <Link href="/seguranca" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0F0F0F", color: "#fff", fontSize: 12, fontWeight: 700, padding: "8px 16px", borderRadius: 999, textDecoration: "none" }}>
                      Descobrir →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════ */}
      {/* BRAND MANIFESTO */}
      {/* ══════════════════════════════════════════════ */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px 64px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 68px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#0F0F0F", maxWidth: 800, margin: "0 0 32px 0", fontFamily: FONT }}>
          IngressoLivre. É o marketplace que protege você do começo ao fim da transação.
        </h2>
        <Link href="/como-funciona" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0F0F0F", color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 22px", borderRadius: 999, textDecoration: "none" }}>
          Como funciona →
        </Link>
      </section>

      {/* Statement */}
      <section style={{ background: "#F7F4F0", padding: "72px 40px", textAlign: "center" }}>
        <p style={{ fontSize: "clamp(24px, 3.5vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "#0F0F0F", maxWidth: 760, margin: "0 auto 28px", fontFamily: FONT }}>
          A diferença entre perder dinheiro e chegar na festa?{" "}
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Aqui, não existe essa diferença.
          </span>
        </p>
        <Link href="/seguranca" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "#0F0F0F", fontWeight: 600, fontSize: 14, padding: "11px 20px", borderRadius: 999, textDecoration: "none", border: "1.5px solid rgba(0,0,0,0.2)" }}>
          Ver →
        </Link>
      </section>

      {/* Features 2-col */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
        <div>
          <h3 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#0F0F0F", margin: "0 0 20px 0", fontFamily: FONT }}>
            Chega de medo no grupo do WhatsApp.
          </h3>
          <p style={{ fontSize: 16, color: "rgba(0,0,0,0.5)", lineHeight: 1.65, margin: 0 }}>
            Todo ano milhares de pessoas perdem dinheiro comprando ingressos por fora de plataformas protegidas. No IngressoLivre, isso não acontece.
          </p>
        </div>
        <div>
          {[
            { icon: "🔒", title: "Escrow obrigatório", desc: "Seu pagamento fica retido até você confirmar que recebeu o ingresso." },
            { icon: "💬", title: "Chat monitorado", desc: "Dados pessoais bloqueados automaticamente. Nenhum contato externo vaza." },
            { icon: "⚡", title: "Reembolso em 24h", desc: "Vendedor não enviou? Reembolso automático, sem burocracia." },
          ].map((f) => (
            <div key={f.title} style={{ display: "flex", gap: 16, marginBottom: 28, alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0F0F0F", marginBottom: 4 }}>{f.title}</div>
                <p style={{ fontSize: 14, color: "rgba(0,0,0,0.45)", lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════════ */}
      {/* INLINE CTA */}
      {/* ══════════════════════════════════════════════ */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 40px 80px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <h2 style={{ fontSize: "clamp(52px, 7vw, 96px)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 0.95, color: "#0F0F0F", margin: "0 0 32px 0", fontFamily: FONT }}>
          Então{" "}
          <span style={{ display: "inline-block", verticalAlign: "middle", width: "0.7em", height: "0.7em", borderRadius: "50%", overflow: "hidden", marginBottom: "0.05em" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=200&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </span>{" "}
          prontos{" "}
          <br />
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            para curtir?
          </span>
        </h2>
        <Link href="/buscar" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0F0F0F", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 26px", borderRadius: 999, textDecoration: "none" }}>
          Ver ingressos →
        </Link>
      </section>


      {/* ══════════════════════════════════════════════ */}
      {/* TESTIMONIALS */}
      {/* ══════════════════════════════════════════════ */}
      <section style={{ background: "#F7F4F0", padding: "72px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(0,0,0,0.35)", textTransform: "uppercase", marginBottom: 16 }}>
            Quem usou, aprovou
          </p>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#0F0F0F", margin: "0 0 48px 0", fontFamily: FONT }}>
            Curtir tranquilo,<br />isso tem valor.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{ background: t.bg, borderRadius: 20, padding: "28px 28px 24px", gridColumn: t.wide ? "span 2" : "span 1" }}>
                <p style={{ fontSize: t.wide ? 18 : 15, fontWeight: 500, color: "#0F0F0F", lineHeight: 1.55, margin: "0 0 24px 0" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#0F0F0F" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════ */}
      {/* FOOTER CTA */}
      {/* ══════════════════════════════════════════════ */}
      <section style={{ background: "#0F0F0F", margin: "0 32px 0", borderRadius: "28px 28px 0 0", padding: "80px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,31,90,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#fff", maxWidth: 640, margin: "0 auto 32px", fontFamily: FONT }}>
            Entre no mundo dos ingressos seguros.
          </h2>
          <Link href="/cadastro" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GRAD, color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 32px", borderRadius: 999, textDecoration: "none" }}>
            Criar conta grátis →
          </Link>
        </div>
      </section>


      {/* ══════════════════════════════════════════════ */}
      {/* FOOTER LINKS */}
      {/* ══════════════════════════════════════════════ */}
      <footer style={{ background: "#0F0F0F", padding: "0 48px 48px", margin: "0 32px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 48, display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em", color: "#fff", marginBottom: 12 }}>
              Ingresso<span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Livre</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: "0 0 20px 0", maxWidth: 200 }}>
              O marketplace seguro de ingressos do Brasil.
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>© {year} IngressoLivre</p>
          </div>

          {[
            { title: "Plataforma", links: [{ label: "Buscar ingressos", href: "/buscar" }, { label: "Vender ingresso", href: "/vender" }, { label: "Como funciona", href: "/como-funciona" }, { label: "Segurança", href: "/seguranca" }] },
            { title: "Conta", links: [{ label: "Criar conta", href: "/cadastro" }, { label: "Entrar", href: "/login" }, { label: "Minhas compras", href: "/minha-conta/compras" }, { label: "Minhas vendas", href: "/minha-conta/vendas" }] },
            { title: "Legal", links: [{ label: "Termos de uso", href: "/termos" }, { label: "Privacidade", href: "/privacidade" }, { label: "Contato", href: "/contato" }] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>
                {col.title}
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {col.links.map((l) => (
                  <li key={l.href} style={{ marginBottom: 10 }}>
                    <Link href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", fontWeight: 400 }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
          Pagamentos processados pelo Mercado Pago · PCI DSS Nível 1
        </div>
      </footer>

      <div style={{ height: 32, background: BG }} />
    </div>
  );
}
