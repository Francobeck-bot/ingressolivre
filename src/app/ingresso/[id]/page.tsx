"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, Package, ArrowLeft, MessageCircle, Flag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import SellerBadge from "@/components/SellerBadge";
import StarRating from "@/components/StarRating";
import SafetyBanner from "@/components/SafetyBanner";
import IngressoCard from "@/components/IngressoCard";
import PurchaseModal from "./PurchaseModal";
import type { Anuncio, Avaliacao } from "@/types/database";
import { formatCurrency, formatDate, calcTaxa, calcTotal, SETOR_LABELS, GENERO_LABELS, ENTRADA_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function IngressoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [anuncio, setAnuncio] = useState<Anuncio | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [outrosAnuncios, setOutrosAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPurchase, setShowPurchase] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("anuncios")
        .select("*, evento:eventos(*), vendedor:profiles(*)")
        .eq("id", id)
        .single();

      if (!data) { router.push("/buscar"); return; }
      setAnuncio(data as Anuncio);

      const [avalRes, outrosRes] = await Promise.all([
        supabase
          .from("avaliacoes")
          .select("*, avaliador:profiles(nome, avatar_url)")
          .eq("avaliado_id", data.vendedor_id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("anuncios")
          .select("*, evento:eventos(*), vendedor:profiles(*)")
          .eq("vendedor_id", data.vendedor_id)
          .eq("status", "ativo")
          .neq("id", id)
          .limit(3),
      ]);

      setAvaliacoes((avalRes.data as Avaliacao[]) ?? []);
      setOutrosAnuncios((outrosRes.data as Anuncio[]) ?? []);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (!anuncio) return null;

  const { evento, vendedor } = anuncio;
  const isOwnListing = userId === anuncio.vendedor_id;

  return (
    <div className="min-h-dvh pb-24">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event banner */}
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
              {evento?.imagem_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={evento.imagem_url} alt={evento.nome} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #1a0030 0%, #6b00b3 50%, #e0408a 100%)" }}
                >
                  <span className="text-6xl">🎉</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0010] via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", "bg-white/20 text-white border-white/30")}>
                  {anuncio.setor ? SETOR_LABELS[anuncio.setor] : ""}
                  {anuncio.genero ? ` • ${GENERO_LABELS[anuncio.genero]}` : ""}
                  {anuncio.entrada ? ` • ${ENTRADA_LABELS[anuncio.entrada]}` : ""}
                </span>
                {anuncio.destaque && (
                  <span className="px-3 py-1 rounded-full bg-[#e0f809] text-[#0d0010] text-xs font-bold">
                    ✦ Premium
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h1
                  className="text-2xl sm:text-3xl font-extrabold text-white"
                  style={{ fontFamily: "Syne, sans-serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
                >
                  {evento?.nome}
                </h1>
              </div>
            </div>

            {/* Event details */}
            <div className="glass-card p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {evento && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#6b00b3]/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#6b00b3]" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Data</p>
                      <p className="text-white text-sm font-medium">{formatDate(evento.data)}</p>
                      <p className="text-white/60 text-xs">{evento.horario}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e0408a]/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#e0408a]" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Local</p>
                      <p className="text-white text-sm font-medium">{evento.local}</p>
                      <p className="text-white/60 text-xs">{evento.cidade} — {evento.estado}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e0f809]/20 flex items-center justify-center">
                      <Package className="w-5 h-5 text-[#e0f809]" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Disponível</p>
                      <p className="text-white text-sm font-medium">{anuncio.quantidade} ingresso{anuncio.quantidade > 1 ? "s" : ""}</p>
                      <p className="text-white/60 text-xs">
                        {anuncio.aceita_transferencia_titular ? "Aceita troca de titular" : "Somente PDF"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Observações */}
            {anuncio.observacoes && (
              <div className="glass-card p-5">
                <h2 className="text-white font-semibold mb-2 text-sm" style={{ fontFamily: "Syne, sans-serif" }}>
                  Observações do vendedor
                </h2>
                <p className="text-white/60 text-sm leading-relaxed">{anuncio.observacoes}</p>
              </div>
            )}

            {/* Seller card */}
            {vendedor && (
              <div className="glass-card p-5">
                <h2 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: "Syne, sans-serif" }}>
                  Sobre o vendedor
                </h2>
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-main flex items-center justify-center text-xl font-bold text-white overflow-hidden">
                      {vendedor.avatar_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={vendedor.avatar_url} alt={vendedor.nome} className="w-full h-full object-cover" />
                        : vendedor.nome.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-white font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
                        {vendedor.nome}
                      </h3>
                      <SellerBadge level={vendedor.nivel_verificacao} size="sm" />
                    </div>
                    <StarRating value={vendedor.estrelas_media} readonly size="sm" showCount={vendedor.total_vendas} />
                    <p className="text-white/40 text-xs mt-1">{vendedor.total_vendas} vendas concluídas</p>
                  </div>
                </div>
              </div>
            )}

            {/* Avaliações */}
            {avaliacoes.length > 0 && (
              <div className="glass-card p-5">
                <h2 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: "Syne, sans-serif" }}>
                  Avaliações recebidas
                </h2>
                <div className="space-y-4">
                  {avaliacoes.map((av) => (
                    <div key={av.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#6b00b3]/30 flex items-center justify-center text-sm font-bold text-white">
                          {av.avaliador?.nome?.charAt(0).toUpperCase() ?? "U"}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{av.avaliador?.nome ?? "Usuário"}</p>
                          <StarRating value={av.nota} readonly size="sm" />
                        </div>
                      </div>
                      {av.comentario && (
                        <p className="text-white/50 text-sm leading-relaxed">{av.comentario}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outros anúncios do vendedor */}
            {outrosAnuncios.length > 0 && (
              <div>
                <h2 className="text-white font-bold mb-4 text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
                  Mais do mesmo vendedor
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {outrosAnuncios.map((a) => <IngressoCard key={a.id} anuncio={a} />)}
                </div>
              </div>
            )}
          </div>

          {/* Right column — sticky purchase card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              {/* Price card */}
              <div className="glass-card p-6" style={{ border: "1px solid rgba(224,248,9,0.2)" }}>
                <div className="mb-4">
                  <p className="text-white/40 text-sm">Valor do ingresso</p>
                  <p className="text-4xl font-extrabold text-white mt-1" style={{ fontFamily: "Syne, sans-serif" }}>
                    {formatCurrency(anuncio.preco)}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-white/40">
                    <span>+ {formatCurrency(calcTaxa(anuncio.preco))} taxa</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>Total: <span className="text-white/70">{formatCurrency(calcTotal(anuncio.preco))}</span></span>
                  </div>
                </div>

                {isOwnListing ? (
                  <div className="py-3 rounded-xl bg-white/5 border border-white/10 text-center text-white/40 text-sm">
                    Este é o seu anúncio
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!userId) { router.push("/login"); return; }
                      setShowPurchase(true);
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-main text-white font-bold text-base shadow-glow hover:shadow-[0_0_30px_rgba(224,64,138,0.6)] transition-all duration-200 hover:-translate-y-0.5"
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    Comprar com segurança
                  </button>
                )}

                {!isOwnListing && (
                  <button className="w-full mt-3 py-3 rounded-2xl border border-white/10 text-white/60 hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:border-white/20">
                    <MessageCircle className="w-4 h-4" />
                    Tirar dúvidas
                  </button>
                )}
              </div>

              <SafetyBanner />

              {/* Report */}
              {!isOwnListing && (
                <button className="w-full flex items-center justify-center gap-2 py-2 text-white/20 hover:text-red-400/60 text-xs transition-colors">
                  <Flag className="w-3 h-3" />
                  Reportar anúncio
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchase && anuncio && (
        <PurchaseModal
          anuncio={anuncio}
          onClose={() => setShowPurchase(false)}
        />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="h-64 skeleton rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-24 skeleton rounded-2xl" />
          <div className="h-40 skeleton rounded-2xl" />
        </div>
        <div className="space-y-4">
          <div className="h-48 skeleton rounded-2xl" />
          <div className="h-32 skeleton rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
