import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Package } from "lucide-react";
import { cn, formatCurrency, formatDate, SETOR_LABELS } from "@/lib/utils";
import SellerBadge from "./SellerBadge";
import StarRating from "./StarRating";
import type { Anuncio } from "@/types/database";

const FONT = '"Satoshi", "DM Sans", sans-serif';
const GRAD = "linear-gradient(135deg, #FF1F5A 0%, #FF7032 100%)";

interface IngressoCardProps {
  anuncio: Anuncio;
  className?: string;
  featured?: boolean;
}

export default function IngressoCard({ anuncio, className, featured }: IngressoCardProps) {
  const { evento, vendedor, setor, preco, quantidade } = anuncio;

  return (
    <Link
      href={`/ingresso/${anuncio.id}`}
      style={{ textDecoration: "none", display: "block", fontFamily: FONT }}
      className={cn(className)}
    >
      <div style={{
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(12px)",
        border: featured ? "1px solid rgba(255,31,90,0.25)" : "1px solid rgba(0,0,0,0.07)",
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.2s ease",
        boxShadow: featured ? "0 0 20px rgba(255,31,90,0.10)" : "0 1px 4px rgba(0,0,0,0.05)",
      }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,31,90,0.20)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = featured ? "0 0 20px rgba(255,31,90,0.10)" : "0 1px 4px rgba(0,0,0,0.05)";
          (e.currentTarget as HTMLDivElement).style.borderColor = featured ? "rgba(255,31,90,0.25)" : "rgba(0,0,0,0.07)";
        }}
      >
        {/* Event image */}
        <div style={{ position: "relative", height: 148, overflow: "hidden" }}>
          {evento?.imagem_url ? (
            <Image src={evento.imagem_url} alt={evento.nome} fill style={{ objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 36 }}>🎉</span>
            </div>
          )}

          {anuncio.destaque && (
            <div style={{ position: "absolute", top: 8, left: 8 }}>
              <span style={{ padding: "3px 10px", borderRadius: 999, background: "#0F0F0F", color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: FONT }}>
                ✦ Premium
              </span>
            </div>
          )}

          <div style={{ position: "absolute", top: 8, right: 8 }}>
            <span style={{ padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.88)", color: "#0F0F0F", fontSize: 11, fontWeight: 600, fontFamily: FONT, backdropFilter: "blur(8px)" }}>
              {setor ? SETOR_LABELS[setor] : ""}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "14px 16px" }}>
          <h3 style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.35, color: "#0F0F0F", margin: "0 0 10px", fontFamily: FONT, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {evento?.nome ?? "Evento"}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
            {evento && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(15,15,15,0.45)", fontSize: 12 }}>
                  <Calendar style={{ width: 12, height: 12, flexShrink: 0 }} />
                  <span>{formatDate(evento.data)} • {evento.horario}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(15,15,15,0.45)", fontSize: 12 }}>
                  <MapPin style={{ width: 12, height: 12, flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{evento.cidade} — {evento.local}</span>
                </div>
              </>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(15,15,15,0.45)", fontSize: 12 }}>
              <Package style={{ width: 12, height: 12, flexShrink: 0 }} />
              <span>{quantidade} disponível{quantidade > 1 ? "is" : ""}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontWeight: 800, fontSize: 20, color: "#0F0F0F", margin: 0, fontFamily: FONT, letterSpacing: "-0.02em" }}>
                {formatCurrency(preco)}
              </p>
              <p style={{ fontSize: 11, color: "rgba(15,15,15,0.35)", margin: "2px 0 0" }}>+ 4% taxa</p>
            </div>

            {vendedor && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <SellerBadge level={vendedor.nivel_verificacao} size="sm" />
                <StarRating value={vendedor.estrelas_media} readonly size="sm" showCount={vendedor.total_vendas} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function IngressoCardSkeleton() {
  return (
    <div style={{ background: "rgba(255,255,255,0.60)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ height: 148, background: "linear-gradient(90deg, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.09) 50%, rgba(0,0,0,0.05) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ height: 14, borderRadius: 6, background: "rgba(0,0,0,0.07)", width: "75%" }} />
        <div style={{ height: 12, borderRadius: 6, background: "rgba(0,0,0,0.05)", width: "50%" }} />
        <div style={{ height: 12, borderRadius: 6, background: "rgba(0,0,0,0.05)", width: "65%" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 4 }}>
          <div style={{ height: 22, borderRadius: 6, background: "rgba(0,0,0,0.07)", width: 72 }} />
          <div style={{ height: 14, borderRadius: 6, background: "rgba(0,0,0,0.05)", width: 56 }} />
        </div>
      </div>
    </div>
  );
}
