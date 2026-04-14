import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "IngressoLivre — Marketplace de Ingressos",
    template: "%s | IngressoLivre",
  },
  description:
    "Compre e venda ingressos de festas universitárias com segurança. Pagamento protegido, vendedores verificados.",
  keywords: ["ingressos", "festas", "universitário", "revenda", "marketplace"],
  openGraph: {
    title: "IngressoLivre — Marketplace de Ingressos",
    description: "Compre e venda ingressos com segurança",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-dvh" style={{
          background: [
            "radial-gradient(ellipse at 85% 8%, rgba(255,110,20,0.88) 0%, transparent 45%)",
            "radial-gradient(ellipse at 15% 18%, rgba(255,15,85,0.82) 0%, transparent 45%)",
            "radial-gradient(ellipse at 52% 2%, rgba(255,50,130,0.70) 0%, transparent 40%)",
            "#F2EEE9",
          ].join(", "),
          color: "#0F0F0F",
        }}>
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
