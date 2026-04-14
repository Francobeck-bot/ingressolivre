import Link from "next/link";
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, CreditCard, MessageCircle } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    title: "Pagamento em Escrow",
    desc: "Seu dinheiro fica retido em custódia pelo Mercado Pago até você confirmar o recebimento do ingresso. Nunca vai direto ao vendedor.",
  },
  {
    icon: Lock,
    color: "text-[#6b00b3]",
    bg: "bg-[#6b00b3]/10",
    border: "border-[#6b00b3]/20",
    title: "Chat Monitorado",
    desc: "Todas as mensagens são filtradas automaticamente. Tentativas de compartilhar número de telefone, WhatsApp, Instagram ou outros contatos externos são bloqueadas e substituídas.",
  },
  {
    icon: Eye,
    color: "text-[#e0408a]",
    bg: "bg-[#e0408a]/10",
    border: "border-[#e0408a]/20",
    title: "Verificação de Vendedores",
    desc: "Nosso sistema de tiers (Bronze → Ouro → Diamante) garante que vendedores de alto volume passem por verificação de identidade e documentos.",
  },
  {
    icon: AlertTriangle,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    title: "Sistema de Disputas",
    desc: "Em caso de problemas, nossa equipe analisa o histórico de chat e toma decisões em até 48 horas. Vendedores com 3 disputas perdidas são suspensos automaticamente.",
  },
  {
    icon: CreditCard,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    title: "Processamento Seguro",
    desc: "Todos os pagamentos são processados pelo Mercado Pago, certificado PCI DSS nível 1. Nenhum dado de cartão é armazenado em nossos servidores.",
  },
  {
    icon: MessageCircle,
    color: "text-[#e0f809]",
    bg: "bg-[#e0f809]/10",
    border: "border-[#e0f809]/20",
    title: "Reembolso Automático",
    desc: "Se o vendedor não enviar o ingresso em 24 horas, o reembolso é processado automaticamente, sem necessidade de abrir disputa.",
  },
];

const TIPS = [
  "Nunca tente fechar negócio fora da plataforma — você perde toda a proteção",
  "Verifique a avaliação e o nível do vendedor antes de comprar",
  "Confirme 'Recebi o ingresso' apenas após testar o acesso ao evento",
  "Em caso de dúvidas, use o sistema de disputa — não procure resolver diretamente",
  "Denuncie anúncios suspeitos com preços muito abaixo do mercado",
  "Ingressos físicos podem ser enviados por Correios — solicite rastreamento",
];

export default function SegurancaPage() {
  return (
    <div className="min-h-dvh">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #6b00b3, transparent 70%)" }} />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6" style={{ fontFamily: "Syne, sans-serif" }}>
            Sua segurança é nossa{" "}
            <span className="gradient-text">prioridade</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Construímos o IngressoLivre com múltiplas camadas de proteção para garantir que cada transação seja segura para compradores e vendedores.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, color, bg, border, title, desc }) => (
              <div key={title} className={`glass-card p-6 border ${border}`}>
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                  {title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Escrow Visual */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white text-center mb-10" style={{ fontFamily: "Syne, sans-serif" }}>
            Como o escrow protege você
          </h2>
          <div className="space-y-2">
            {[
              { label: "Comprador paga", sub: "Dinheiro vai para custódia Mercado Pago", icon: CreditCard, color: "text-[#6b00b3]", active: true },
              { label: "Vendedor envia o ingresso", sub: "Prazo de 24h — monitorado pela plataforma", icon: CheckCircle, color: "text-[#e0408a]", active: true },
              { label: "Comprador confirma recebimento", sub: "Testa o ingresso antes de confirmar", icon: Eye, color: "text-[#e0f809]", active: true },
              { label: "Pagamento liberado", sub: "Vendedor recebe o valor menos 4% de taxa", icon: Shield, color: "text-green-400", active: true },
            ].map(({ label, sub, icon: Icon, color, active }, i) => (
              <div key={label} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full ${active ? "bg-white/10" : "bg-white/5"} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  {i < 3 && <div className="w-px h-8 bg-white/10 mt-1" />}
                </div>
                <div className="pb-6">
                  <div className="text-white font-semibold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>{label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8 border border-yellow-500/20" style={{ background: "rgba(234,179,8,0.04)" }}>
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-white font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
                Dicas de segurança
              </h3>
            </div>
            <ul className="space-y-3">
              {TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/70 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Verification Tiers */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white text-center mb-10" style={{ fontFamily: "Syne, sans-serif" }}>
            Níveis de verificação de vendedores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Bronze", emoji: "🥉", color: "text-amber-600", border: "border-amber-600/20", req: ["E-mail confirmado", "CPF cadastrado"], desc: "Nível inicial. Todos os vendedores começam aqui." },
              { name: "Ouro", emoji: "🥇", color: "text-yellow-400", border: "border-yellow-400/20", req: ["RG ou CNH enviado", "Comprovante de residência", "Selfie com documento", "Revisão manual aprovada"], desc: "Verificado manualmente pela equipe IngressoLivre." },
              { name: "Diamante", emoji: "💎", color: "text-cyan-400", border: "border-cyan-400/20", req: ["Todos os requisitos Ouro", "Assinatura ativa R$10/mês", "Aparece primeiro nas buscas", "Badge exclusivo"], desc: "Máxima visibilidade e credibilidade na plataforma." },
            ].map(({ name, emoji, color, border, req, desc }) => (
              <div key={name} className={`glass-card p-6 border ${border}`}>
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className={`font-extrabold text-lg mb-1 ${color}`} style={{ fontFamily: "Syne, sans-serif" }}>{name}</h3>
                <p className="text-white/40 text-xs mb-4">{desc}</p>
                <ul className="space-y-2">
                  {req.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm text-white/60">
                      <CheckCircle className={`w-4 h-4 ${color}`} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <p className="text-white/50 text-sm mb-4">Ainda tem dúvidas sobre segurança?</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/como-funciona" className="btn-primary">Ver como funciona</Link>
          <Link href="/contato" className="px-6 py-3 rounded-xl glass-card border border-white/15 text-white text-sm font-semibold hover:bg-white/10 transition-all"
            style={{ fontFamily: "Syne, sans-serif" }}>
            Falar com suporte
          </Link>
        </div>
      </section>
    </div>
  );
}
