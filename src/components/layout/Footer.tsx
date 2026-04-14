import Link from "next/link";
import { AtSign, Music, PlayCircle } from "lucide-react";

const FONT = '"Satoshi", "DM Sans", sans-serif';
const GRAD = "linear-gradient(135deg, #FF1F5A 0%, #FF7032 100%)";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,31,90,0.12)", background: "#EAE6E1", marginTop: 80, fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }} className="grid-cols-1 md:grid-cols-4">

          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 16 }}>
              <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.03em", color: "#0F0F0F", fontFamily: FONT }}>
                Ingresso
                <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Livre
                </span>
              </span>
            </Link>
            <p style={{ color: "rgba(15,15,15,0.50)", fontSize: 13, lineHeight: 1.6, maxWidth: 220 }}>
              O marketplace seguro para comprar e vender ingressos de festas universitárias.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {[{ label: "Instagram", Icon: AtSign }, { label: "TikTok", Icon: Music }, { label: "Youtube", Icon: PlayCircle }].map(({ label, Icon }) => (
                <a key={label} href="#" aria-label={label}
                  style={{ padding: 8, borderRadius: 10, background: "rgba(0,0,0,0.06)", color: "rgba(15,15,15,0.50)", display: "flex", transition: "all 0.2s" }}>
                  <Icon style={{ width: 15, height: 15 }} />
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0F0F0F", marginBottom: 16, fontFamily: FONT }}>
              Marketplace
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/buscar", label: "Explorar ingressos" },
                { href: "/vender", label: "Vender ingresso" },
                { href: "/buscar?tipo=camarote", label: "Camarotes" },
                { href: "/buscar?tipo=vip", label: "VIP" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ color: "rgba(15,15,15,0.55)", fontSize: 13, textDecoration: "none", transition: "color 0.2s", fontFamily: FONT }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Conta */}
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0F0F0F", marginBottom: 16, fontFamily: FONT }}>
              Conta
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/login", label: "Entrar" },
                { href: "/cadastro", label: "Cadastrar" },
                { href: "/minha-conta/compras", label: "Minhas compras" },
                { href: "/minha-conta/vendas", label: "Minhas vendas" },
                { href: "/minha-conta/verificacao", label: "Verificação" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ color: "rgba(15,15,15,0.55)", fontSize: 13, textDecoration: "none", fontFamily: FONT }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0F0F0F", marginBottom: 16, fontFamily: FONT }}>
              Suporte
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/como-funciona", label: "Como funciona" },
                { href: "/seguranca", label: "Segurança" },
                { href: "/termos", label: "Termos de uso" },
                { href: "/privacidade", label: "Privacidade" },
                { href: "/contato", label: "Contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ color: "rgba(15,15,15,0.55)", fontSize: 13, textDecoration: "none", fontFamily: FONT }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", marginTop: 40, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "rgba(15,15,15,0.35)", fontSize: 12, fontFamily: FONT }}>
            © {new Date().getFullYear()} IngressoLivre. Todos os direitos reservados.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ color: "rgba(15,15,15,0.35)", fontSize: 12, fontFamily: FONT }}>Plataforma segura — pagamentos protegidos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
