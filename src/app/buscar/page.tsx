"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import IngressoCard, { IngressoCardSkeleton } from "@/components/IngressoCard";
import type { Anuncio, SetorIngresso, NivelVerificacao } from "@/types/database";
import { SETOR_LABELS } from "@/lib/utils";

const FONT = '"Satoshi", "DM Sans", sans-serif';
const GRAD = "linear-gradient(135deg, #FF1F5A 0%, #FF7032 100%)";

const TIPOS: SetorIngresso[] = ["pista", "pista_vip", "mezanino", "camarote", "open_bar", "vip", "backstage", "frontstage", "area_vip"];
const TIPO_INGRESSO_LABELS = SETOR_LABELS;
const NIVEIS: NivelVerificacao[] = ["bronze", "ouro", "diamante"];
const NIVEL_LABELS: Record<NivelVerificacao, string> = { bronze: "🥉 Bronze", ouro: "🥇 Ouro", diamante: "💎 Diamante" };
const ORDENAR = [
  { value: "recente", label: "Mais recente" },
  { value: "preco_asc", label: "Menor preço" },
  { value: "preco_desc", label: "Maior preço" },
  { value: "avaliado", label: "Mais avaliado" },
];
const PAGE_SIZE = 12;

const inputStyle = {
  background: "rgba(255,255,255,0.80)",
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 10,
  color: "#0F0F0F",
  fontSize: 13,
  fontFamily: FONT,
  outline: "none",
  padding: "10px 14px",
  width: "100%",
  boxSizing: "border-box" as const,
};

function FilterPanel({
  tipos, niveis, precoMin, precoMax, cidade,
  toggleTipo, toggleNivel, setPrecoMin, setPrecoMax, setCidade,
  hasFilters, clearAll,
}: {
  tipos: SetorIngresso[]; niveis: NivelVerificacao[]; precoMin: number; precoMax: number; cidade: string;
  toggleTipo: (t: SetorIngresso) => void; toggleNivel: (n: NivelVerificacao) => void;
  setPrecoMin: (v: number) => void; setPrecoMax: (v: number) => void; setCidade: (v: string) => void;
  hasFilters: boolean; clearAll: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Tipo */}
      <div>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: "#0F0F0F", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10, fontFamily: FONT }}>Tipo de ingresso</h3>
        {TIPOS.map((t) => (
          <label key={t} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 8 }}>
            <div onClick={() => toggleTipo(t)} style={{
              width: 18, height: 18, borderRadius: 5, border: tipos.includes(t) ? "2px solid #FF1F5A" : "2px solid rgba(0,0,0,0.18)",
              background: tipos.includes(t) ? GRAD : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all 0.15s",
            }}>
              {tipos.includes(t) && <svg style={{ width: 10, height: 10 }} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span style={{ fontSize: 13, color: tipos.includes(t) ? "#0F0F0F" : "rgba(15,15,15,0.50)", fontFamily: FONT }}>{TIPO_INGRESSO_LABELS[t]}</span>
          </label>
        ))}
      </div>

      {/* Preço */}
      <div>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: "#0F0F0F", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10, fontFamily: FONT }}>Faixa de preço</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <input type="number" value={precoMin} onChange={(e) => setPrecoMin(Number(e.target.value))} style={{ ...inputStyle, padding: "8px 10px" }} placeholder="Mín" />
          <span style={{ color: "rgba(15,15,15,0.30)", fontSize: 13 }}>–</span>
          <input type="number" value={precoMax} onChange={(e) => setPrecoMax(Number(e.target.value))} style={{ ...inputStyle, padding: "8px 10px" }} placeholder="Máx" />
        </div>
        <input type="range" min={0} max={1000} step={10} value={precoMax} onChange={(e) => setPrecoMax(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#FF1F5A" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(15,15,15,0.35)", marginTop: 4 }}>
          <span>R$ 0</span><span>R$ 1.000</span>
        </div>
      </div>

      {/* Cidade */}
      <div>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: "#0F0F0F", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10, fontFamily: FONT }}>Cidade</h3>
        <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: São Paulo" style={{ ...inputStyle, padding: "8px 12px" }} />
      </div>

      {/* Nível */}
      <div>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: "#0F0F0F", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10, fontFamily: FONT }}>Nível do vendedor</h3>
        {NIVEIS.map((n) => (
          <label key={n} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 8 }}>
            <div onClick={() => toggleNivel(n)} style={{
              width: 18, height: 18, borderRadius: 5, border: niveis.includes(n) ? "2px solid #FF1F5A" : "2px solid rgba(0,0,0,0.18)",
              background: niveis.includes(n) ? GRAD : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all 0.15s",
            }}>
              {niveis.includes(n) && <svg style={{ width: 10, height: 10 }} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span style={{ fontSize: 13, color: niveis.includes(n) ? "#0F0F0F" : "rgba(15,15,15,0.50)", fontFamily: FONT }}>{NIVEL_LABELS[n]}</span>
          </label>
        ))}
      </div>

      {hasFilters && (
        <button onClick={clearAll} style={{ width: "100%", padding: "9px", borderRadius: 10, border: "1px solid rgba(255,31,90,0.30)", color: "#FF1F5A", fontSize: 13, fontWeight: 600, background: "transparent", cursor: "pointer", fontFamily: FONT }}>
          Limpar filtros
        </button>
      )}
    </div>
  );
}

function BuscarPageInner() {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const loaderRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [tipos, setTipos] = useState<SetorIngresso[]>([]);
  const [niveis, setNiveis] = useState<NivelVerificacao[]>([]);
  const [precoMin, setPrecoMin] = useState(0);
  const [precoMax, setPrecoMax] = useState(1000);
  const [cidade, setCidade] = useState("");
  const [ordenar, setOrdenar] = useState("recente");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [results, setResults] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchResults = useCallback(async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 0 : page;
    let q = supabase
      .from("anuncios")
      .select("*, evento:eventos(*), vendedor:profiles(*)")
      .eq("status", "ativo")
      .gte("preco", precoMin)
      .lte("preco", precoMax)
      .range(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE - 1);
    if (tipos.length > 0) q = q.in("tipo_ingresso", tipos);
    if (cidade) q = q.ilike("evento.cidade", `%${cidade}%`);
    if (query) q = q.ilike("evento.nome", `%${query}%`);
    if (ordenar === "preco_asc") q = q.order("preco", { ascending: true });
    else if (ordenar === "preco_desc") q = q.order("preco", { ascending: false });
    else q = q.order("created_at", { ascending: false });
    const { data } = await q;
    const rows = (data as Anuncio[]) ?? [];
    const filtered = niveis.length > 0 ? rows.filter((a) => a.vendedor && niveis.includes(a.vendedor.nivel_verificacao)) : rows;
    if (reset) { setResults(filtered); setPage(1); } else { setResults((prev) => [...prev, ...filtered]); setPage((p) => p + 1); }
    setHasMore(rows.length === PAGE_SIZE);
    setLoading(false);
  }, [query, tipos, niveis, precoMin, precoMax, cidade, ordenar, page]);

  useEffect(() => { fetchResults(true); }, [query, tipos, niveis, precoMin, precoMax, cidade, ordenar]); // eslint-disable-line

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting && hasMore && !loading) fetchResults(false); }, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchResults]);

  function toggleTipo(t: SetorIngresso) { setTipos((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]); }
  function toggleNivel(n: NivelVerificacao) { setNiveis((prev) => prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]); }
  function clearAll() { setTipos([]); setNiveis([]); setPrecoMin(0); setPrecoMax(1000); setCidade(""); setOrdenar("recente"); }
  const hasFilters = tipos.length > 0 || niveis.length > 0 || !!cidade || precoMin > 0 || precoMax < 1000;

  return (
    <div style={{ minHeight: "100dvh", fontFamily: FONT, color: "#0F0F0F" }}>
      {/* Search bar */}
      <div style={{ background: "rgba(242,238,233,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,31,90,0.08)", position: "sticky", top: 64, zIndex: 20 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "rgba(15,15,15,0.35)" }} />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar evento, artista, cidade..."
              style={{ ...inputStyle, paddingLeft: 38, paddingRight: query ? 36 : 14, borderRadius: 12 }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(15,15,15,0.35)", display: "flex" }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            )}
          </div>

          <div style={{ position: "relative" }} className="hidden sm:block">
            <select value={ordenar} onChange={(e) => setOrdenar(e.target.value)}
              style={{ appearance: "none", paddingLeft: 12, paddingRight: 32, paddingTop: 10, paddingBottom: 10, borderRadius: 12, background: "rgba(255,255,255,0.80)", border: "1px solid rgba(0,0,0,0.10)", color: "#0F0F0F", fontSize: 13, fontFamily: FONT, outline: "none", cursor: "pointer" }}>
              {ORDENAR.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "rgba(15,15,15,0.40)", pointerEvents: "none" }} />
          </div>

          <button onClick={() => setSidebarOpen(true)} className="lg:hidden"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 12, border: hasFilters ? "1px solid rgba(255,31,90,0.40)" : "1px solid rgba(0,0,0,0.10)", background: hasFilters ? "rgba(255,31,90,0.06)" : "rgba(255,255,255,0.80)", color: hasFilters ? "#FF1F5A" : "rgba(15,15,15,0.55)", fontSize: 13, fontWeight: 500, fontFamily: FONT, cursor: "pointer" }}>
            <SlidersHorizontal style={{ width: 15, height: 15 }} />
            Filtros {hasFilters && `(${tipos.length + niveis.length + (cidade ? 1 : 0)})`}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px", display: "flex", gap: 28 }}>
        {/* Desktop sidebar */}
        <aside className="hidden lg:block" style={{ width: 220, flexShrink: 0 }}>
          <div style={{ background: "rgba(255,255,255,0.70)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,31,90,0.08)", borderRadius: 16, padding: 20, position: "sticky", top: 132 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontWeight: 700, fontSize: 14, color: "#0F0F0F", fontFamily: FONT, margin: 0 }}>Filtros</h2>
              {hasFilters && <button onClick={clearAll} style={{ fontSize: 12, color: "#FF1F5A", background: "none", border: "none", cursor: "pointer", fontFamily: FONT }}>Limpar</button>}
            </div>
            <FilterPanel tipos={tipos} niveis={niveis} precoMin={precoMin} precoMax={precoMax} cidade={cidade} toggleTipo={toggleTipo} toggleNivel={toggleNivel} setPrecoMin={setPrecoMin} setPrecoMax={setPrecoMax} setCidade={setCidade} hasFilters={hasFilters} clearAll={clearAll} />
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }} className="lg:hidden">
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.40)", backdropFilter: "blur(4px)" }} onClick={() => setSidebarOpen(false)} />
            <div style={{ position: "relative", marginLeft: "auto", width: 300, height: "100%", background: "#F2EEE9", borderLeft: "1px solid rgba(255,31,90,0.10)", padding: 24, overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontWeight: 700, fontSize: 15, color: "#0F0F0F", fontFamily: FONT, margin: 0 }}>Filtros</h2>
                <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(15,15,15,0.55)", display: "flex" }}><X style={{ width: 20, height: 20 }} /></button>
              </div>
              <FilterPanel tipos={tipos} niveis={niveis} precoMin={precoMin} precoMax={precoMax} cidade={cidade} toggleTipo={toggleTipo} toggleNivel={toggleNivel} setPrecoMin={setPrecoMin} setPrecoMax={setPrecoMax} setCidade={setCidade} hasFilters={hasFilters} clearAll={clearAll} />
              <button onClick={() => setSidebarOpen(false)} style={{ width: "100%", marginTop: 20, padding: "13px", borderRadius: 999, background: GRAD, color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: FONT }}>
                Ver {results.length} resultado{results.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, color: "rgba(15,15,15,0.45)", marginBottom: 18, fontFamily: FONT }}>
            {loading && results.length === 0 ? "Buscando..." : `${results.length} resultado${results.length !== 1 ? "s" : ""} encontrado${results.length !== 1 ? "s" : ""}`}
          </p>

          {!loading && results.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 14, textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(255,31,90,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Search style={{ width: 26, height: 26, color: "rgba(255,31,90,0.40)" }} />
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: "#0F0F0F", margin: 0, fontFamily: FONT }}>Nenhum ingresso encontrado</p>
              <p style={{ fontSize: 13, color: "rgba(15,15,15,0.45)", margin: 0, maxWidth: 280 }}>Tente outros filtros ou verifique o nome do evento</p>
              <button onClick={clearAll} style={{ padding: "10px 24px", borderRadius: 999, border: "1px solid rgba(255,31,90,0.30)", color: "#FF1F5A", fontSize: 13, fontWeight: 600, background: "transparent", cursor: "pointer", fontFamily: FONT }}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                {results.map((a) => <IngressoCard key={a.id} anuncio={a} />)}
                {loading && Array(6).fill(0).map((_, i) => <IngressoCardSkeleton key={`sk-${i}`} />)}
              </div>
              <div ref={loaderRef} style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                {loading && results.length > 0 && (
                  <div style={{ width: 22, height: 22, border: "2px solid #FF1F5A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                )}
                {!hasMore && results.length > 0 && (
                  <p style={{ fontSize: 13, color: "rgba(15,15,15,0.35)", fontFamily: FONT }}>Você viu todos os resultados</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={null}>
      <BuscarPageInner />
    </Suspense>
  );
}
