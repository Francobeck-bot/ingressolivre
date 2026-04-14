"use client";

export const dynamic = "force-dynamic";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const FONT = '"Satoshi", "DM Sans", sans-serif';
const GRAD = "linear-gradient(135deg, #FF1F5A 0%, #FF7032 100%)";

const inputCls = "w-full px-4 py-3 rounded-xl border border-[rgba(0,0,0,0.10)] focus:border-[rgba(255,31,90,0.45)] bg-white/80 text-[#0F0F0F] outline-none text-sm placeholder:text-[rgba(15,15,15,0.35)] transition-all";

function LoginPageInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push(next);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback?next=${next}` },
    });
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 24px", fontFamily: FONT, position: "relative" }}>
      {/* Subtle bg blobs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "15%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,90,0.08), transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,112,50,0.08), transparent 70%)" }} />
      </div>

      <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.03em", color: "#0F0F0F", fontFamily: FONT }}>
            Ingresso
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Livre</span>
          </span>
        </Link>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.80)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,31,90,0.12)", borderRadius: 20, padding: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F0F0F", margin: "0 0 4px", fontFamily: FONT }}>Entrar</h1>
          <p style={{ fontSize: 13, color: "rgba(15,15,15,0.45)", margin: "0 0 24px" }}>Bem-vindo de volta!</p>

          {/* Google */}
          <button onClick={handleGoogle} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.10)", color: "#0F0F0F", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20, fontFamily: FONT, transition: "all 0.2s" }}>
            <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
            <span style={{ fontSize: 12, color: "rgba(15,15,15,0.35)", fontFamily: FONT }}>ou com e-mail</span>
            <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
          </div>

          {error && (
            <div style={{ display: "flex", gap: 8, padding: "12px 14px", borderRadius: 12, background: "rgba(255,68,68,0.07)", border: "1px solid rgba(255,68,68,0.18)", marginBottom: 16 }}>
              <AlertCircle style={{ width: 16, height: 16, color: "#cc2222", flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "#cc2222", margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(15,15,15,0.60)", marginBottom: 6, fontFamily: FONT }}>E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={inputCls} placeholder="seu@email.com" />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(15,15,15,0.60)", fontFamily: FONT }}>Senha</label>
                <Link href="/recuperar-senha" style={{ fontSize: 12, color: "#FF1F5A", textDecoration: "none", fontFamily: FONT }}>Esqueceu?</Link>
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className={inputCls} placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px 24px", borderRadius: 999, background: loading ? "rgba(0,0,0,0.15)" : GRAD, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, marginTop: 4, transition: "all 0.2s" }}>
              {loading ? <><Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> Entrando...</> : "Entrar"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(15,15,15,0.45)", marginTop: 20, fontFamily: FONT }}>
          Não tem conta?{" "}
          <Link href={`/cadastro${next !== "/" ? `?next=${next}` : ""}`} style={{ color: "#FF1F5A", textDecoration: "none", fontWeight: 600 }}>
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
