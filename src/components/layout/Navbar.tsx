"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Plus, MessageCircle, User, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const FONT = '"Satoshi", "DM Sans", sans-serif';
const GRAD = "linear-gradient(135deg, #FF1F5A 0%, #FF7032 100%)";

const navLinks = [
  { href: "/buscar", label: "Explorar" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/vender", label: "Vender" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoaded(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setAuthLoaded(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(242,238,233,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,31,90,0.10)" : "none",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
        fontFamily: FONT,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.03em", color: "#0F0F0F", fontFamily: FONT }}>
              Ingresso
              <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Livre
              </span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="hidden md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  color: pathname === link.href ? "#FF1F5A" : "rgba(15,15,15,0.65)",
                  fontFamily: FONT,
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hidden md:flex">
            <Link href="/buscar" style={{ color: "rgba(15,15,15,0.55)", display: "flex" }} aria-label="Buscar">
              <Search style={{ width: 18, height: 18 }} />
            </Link>

            {!authLoaded ? null : user ? (
              <>
                <Link href="/chat" style={{ color: "rgba(15,15,15,0.55)", display: "flex", position: "relative" }} aria-label="Chat">
                  <MessageCircle style={{ width: 18, height: 18 }} />
                </Link>
                <Link
                  href="/vender"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, background: GRAD, color: "#fff", fontWeight: 700, fontSize: 13, padding: "9px 18px", borderRadius: 999, textDecoration: "none", fontFamily: FONT }}
                >
                  <Plus style={{ width: 14, height: 14 }} />
                  Vender
                </Link>
                <Link
                  href="/minha-conta/compras"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.07)", color: "#0F0F0F", fontWeight: 500, fontSize: 13, padding: "9px 16px", borderRadius: 999, textDecoration: "none", fontFamily: FONT }}
                >
                  <User style={{ width: 14, height: 14 }} />
                  Minha Conta
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{ fontSize: 13, fontWeight: 500, color: "rgba(15,15,15,0.65)", textDecoration: "none", padding: "9px 4px", fontFamily: FONT }}
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  style={{ background: GRAD, color: "#fff", fontWeight: 700, fontSize: 13, padding: "9px 20px", borderRadius: 999, textDecoration: "none", fontFamily: FONT }}
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#0F0F0F", padding: 8 }}
            aria-label="Menu"
          >
            {menuOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "rgba(242,238,233,0.98)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,31,90,0.10)" }}>
          <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: 15, fontWeight: 500, color: "#0F0F0F", textDecoration: "none", padding: "8px 0", fontFamily: FONT }}
              >
                {link.label}
              </Link>
            ))}
            <hr style={{ borderColor: "rgba(0,0,0,0.08)", margin: "4px 0" }} />
            {!authLoaded ? null : user ? (
              <>
                <Link href="/chat" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, color: "#0F0F0F", textDecoration: "none", padding: "8px 0", fontFamily: FONT }}>Chat</Link>
                <Link href="/minha-conta/compras" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, color: "#0F0F0F", textDecoration: "none", padding: "8px 0", fontFamily: FONT }}>Minha Conta</Link>
                <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", color: "#FF1F5A", fontSize: 14, textAlign: "left", padding: "8px 0", fontFamily: FONT }}>Sair</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, color: "#0F0F0F", textDecoration: "none", padding: "8px 0", fontFamily: FONT }}>Entrar</Link>
                <Link href="/cadastro" onClick={() => setMenuOpen(false)} style={{ display: "block", textAlign: "center", background: GRAD, color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 20px", borderRadius: 999, textDecoration: "none", fontFamily: FONT }}>
                  Criar conta grátis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
