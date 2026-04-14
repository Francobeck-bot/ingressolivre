import Link from "next/link";
import { ShoppingCart, CreditCard, Package, CheckCircle, Shield, ArrowRight, Ticket, Zap, Star } from "lucide-react";

const FONT = '"Satoshi", "DM Sans", sans-serif';
const GRAD = "linear-gradient(135deg, #FF1F5A 0%, #FF7032 100%)";

const STEPS_BUYER = [
  { icon: ShoppingCart, step: "01", title: "Encontre seu ingresso", desc: "Pesquise por evento, tipo de ingresso ou cidade. Filtre por preço, avaliação do vendedor e nível de verificação.", accent: "#FF1F5A" },
  { icon: CreditCard, step: "02", title: "Pague com segurança", desc: "Seu pagamento fica retido em custódia (escrow) via Mercado Pago. Pix, cartão de crédito ou débito. O dinheiro só vai ao vendedor depois da sua confirmação.", accent: "#FF4530" },
  { icon: Package, step: "03", title: "Receba o ingresso", desc: "O vendedor tem até 24 horas para enviar o ingresso digital diretamente pelo chat da plataforma. Se não enviar, você é reembolsado automaticamente.", accent: "#FF7032" },
  { icon: CheckCircle, step: "04", title: "Confirme e avalie", desc: "Recebeu? Clique em 'Recebi o ingresso'. O valor é liberado ao vendedor e você pode deixar uma avaliação para ajudar outros compradores.", accent: "#22c55e" },
];

const STEPS_SELLER = [
  { icon: Ticket, step: "01", title: "Publique seu anúncio", desc: "Cadastre o ingresso em menos de 2 minutos. Informe o evento, tipo, quantidade, preço e uma foto do ingresso.", accent: "#FF1F5A" },
  { icon: Zap, step: "02", title: "Receba a notificação", desc: "Quando alguém comprar, você recebe uma notificação imediata. O pagamento já está garantido em custódia.", accent: "#FF4530" },
  { icon: Package, step: "03", title: "Envie o ingresso em 24h", desc: "Faça upload do ingresso PDF/imagem pelo chat seguro da plataforma. Você tem 24 horas — não perca o prazo!", accent: "#FF7032" },
  { icon: Star, step: "04", title: "Receba seu pagamento", desc: "Após o comprador confirmar o recebimento, o valor (descontando a taxa de 4%) é liberado para sua conta Mercado Pago.", accent: "#22c55e" },
];

const FAQS = [
  { q: "Quanto tempo leva para receber o pagamento?", a: "Após o comprador confirmar o recebimento, o valor é liberado imediatamente para sua conta Mercado Pago. O tempo de disponibilidade depende do método de saque escolhido." },
  { q: "E se o comprador não confirmar o recebimento?", a: "A plataforma libera o pagamento automaticamente após 7 dias sem contestação do comprador." },
  { q: "O que acontece se o vendedor não enviar o ingresso?", a: "Se o ingresso não for enviado em 24 horas, o comprador é reembolsado automaticamente. O vendedor que acumular 3 disputas perdidas tem a conta suspensa." },
  { q: "Posso negociar o preço diretamente com o vendedor?", a: "Não. Todo o processo de compra e comunicação acontece dentro da plataforma para garantir a proteção de ambas as partes. Tentativas de contato externo são bloqueadas pelo sistema." },
  { q: "Quais formas de pagamento são aceitas?", a: "Pix (aprovação instantânea), cartão de crédito em até 12x e cartão de débito, todos processados pelo Mercado Pago." },
  { q: "Como funciona a taxa da plataforma?", a: "Cobramos 4% sobre o valor do ingresso, pago pelo comprador. Para vendedores, não há taxa de publicação — você só paga quando vende." },
];

export default function ComoFuncionaPage() {
  return (
    <div style={{ minHeight: "100dvh", fontFamily: FONT, color: "#0F0F0F" }}>

      {/* Hero */}
      <section style={{ padding: "80px 24px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: 0, left: "30%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,90,0.10), transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: 0, right: "20%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,112,50,0.10), transparent 70%)" }} />
        </div>
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,31,90,0.08)", border: "1px solid rgba(255,31,90,0.15)", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, color: "#FF1F5A", marginBottom: 24, fontFamily: FONT }}>
            <Shield style={{ width: 14, height: 14 }} />
            Marketplace 100% seguro
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#0F0F0F", margin: "0 0 20px", fontFamily: FONT }}>
            Como funciona o{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IngressoLivre</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(15,15,15,0.58)", lineHeight: 1.65, margin: 0 }}>
            Um marketplace com escrow integrado — seu dinheiro fica protegido até você confirmar que recebeu o ingresso.
          </p>
        </div>
      </section>

      {/* Buyer Steps */}
      <section style={{ padding: "16px 24px 48px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,31,90,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShoppingCart style={{ width: 18, height: 18, color: "#FF1F5A" }} />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F0F0F", margin: 0, fontFamily: FONT }}>Para compradores</h2>
              <p style={{ fontSize: 13, color: "rgba(15,15,15,0.50)", margin: 0 }}>Compre ingressos com proteção total</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="grid-cols-1 md:grid-cols-2">
            {STEPS_BUYER.map(({ icon: Icon, step, title, desc, accent }) => (
              <div key={step} style={{ background: "rgba(255,255,255,0.70)", backdropFilter: "blur(12px)", borderRadius: 16, border: `1px solid ${accent}22`, padding: 24 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon style={{ width: 20, height: 20, color: accent }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 4, letterSpacing: "0.06em", fontFamily: FONT }}>PASSO {step}</div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F0F0F", margin: "0 0 8px", fontFamily: FONT }}>{title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(15,15,15,0.55)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
            <Link href="/buscar" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GRAD, color: "#fff", fontWeight: 700, fontSize: 14, padding: "13px 28px", borderRadius: 999, textDecoration: "none", fontFamily: FONT }}>
              Explorar ingressos <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 960, margin: "0 auto 0", padding: "0 24px" }}>
        <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(255,31,90,0.20), transparent)" }} />
      </div>

      {/* Seller Steps */}
      <section style={{ padding: "48px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,112,50,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ticket style={{ width: 18, height: 18, color: "#FF7032" }} />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F0F0F", margin: 0, fontFamily: FONT }}>Para vendedores</h2>
              <p style={{ fontSize: 13, color: "rgba(15,15,15,0.50)", margin: 0 }}>Venda com segurança e receba garantido</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="grid-cols-1 md:grid-cols-2">
            {STEPS_SELLER.map(({ icon: Icon, step, title, desc, accent }) => (
              <div key={step} style={{ background: "rgba(255,255,255,0.70)", backdropFilter: "blur(12px)", borderRadius: 16, border: `1px solid ${accent}22`, padding: 24 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon style={{ width: 20, height: 20, color: accent }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 4, letterSpacing: "0.06em", fontFamily: FONT }}>PASSO {step}</div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F0F0F", margin: "0 0 8px", fontFamily: FONT }}>{title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(15,15,15,0.55)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
            <Link href="/vender" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0F0F0F", color: "#fff", fontWeight: 700, fontSize: 14, padding: "13px 28px", borderRadius: 999, textDecoration: "none", fontFamily: FONT }}>
              Publicar meu ingresso <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Escrow Banner */}
      <section style={{ padding: "0 24px 48px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 20, padding: 40, textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Shield style={{ width: 24, height: 24, color: "#22c55e" }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0F0F0F", margin: "0 0 12px", fontFamily: FONT }}>Proteção Escrow — como funciona?</h3>
            <p style={{ fontSize: 14, color: "rgba(15,15,15,0.58)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
              O <strong style={{ color: "#0F0F0F" }}>escrow</strong> é um sistema de custódia: quando você paga, o dinheiro fica retido em uma conta neutra (Mercado Pago) e <strong style={{ color: "#0F0F0F" }}>não vai ao vendedor</strong> até você confirmar que recebeu o ingresso.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 24, flexWrap: "wrap" }}>
              {[
                { label: "Reembolso automático", sub: "em caso de não-envio" },
                { label: "Disputa mediada", sub: "time IngressoLivre" },
                { label: "Chat protegido", sub: "dados pessoais bloqueados" },
              ].map(({ label, sub }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#22c55e", fontFamily: FONT }}>{label}</div>
                  <div style={{ fontSize: 12, color: "rgba(15,15,15,0.40)", marginTop: 2 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "0 24px 64px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0F0F0F", textAlign: "center", margin: "0 0 32px", fontFamily: FONT }}>
            Perguntas frequentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQS.map(({ q, a }) => (
              <details key={q} style={{ background: "rgba(255,255,255,0.70)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,31,90,0.10)", borderRadius: 14, padding: 20, cursor: "pointer" }}>
                <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, fontWeight: 600, color: "#0F0F0F", listStyle: "none", fontFamily: FONT }}>
                  {q}
                  <span style={{ fontSize: 20, fontWeight: 300, color: "rgba(15,15,15,0.40)", marginLeft: 16, flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: "rgba(15,15,15,0.58)", lineHeight: 1.65, marginTop: 14, marginBottom: 0 }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0F0F0F", margin: "0 0 12px", fontFamily: FONT }}>Pronto para começar?</h2>
          <p style={{ fontSize: 14, color: "rgba(15,15,15,0.50)", margin: "0 0 24px" }}>Crie sua conta gratuitamente e explore milhares de ingressos.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/cadastro" style={{ background: GRAD, color: "#fff", fontWeight: 700, fontSize: 14, padding: "13px 28px", borderRadius: 999, textDecoration: "none", fontFamily: FONT }}>
              Criar conta grátis
            </Link>
            <Link href="/buscar" style={{ background: "rgba(0,0,0,0.07)", color: "#0F0F0F", fontWeight: 600, fontSize: 14, padding: "13px 28px", borderRadius: 999, textDecoration: "none", fontFamily: FONT }}>
              Explorar ingressos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
