import Link from "next/link";
import { Lock } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-white mb-4 pb-2 border-b border-white/10"
        style={{ fontFamily: "Syne, sans-serif" }}>
        {title}
      </h2>
      <div className="space-y-3 text-white/60 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-dvh py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#e0408a]/20 flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#e0408a]" />
          </div>
          <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
            Política de Privacidade
          </h1>
        </div>
        <p className="text-white/30 text-sm mb-10">Última atualização: 1 de abril de 2025 · Aplicável à plataforma IngressoLivre</p>

        <div className="glass-card p-8">
          <Section title="1. Quem somos">
            <p>A IngressoLivre (&quot;nós&quot;, &quot;nosso&quot;) é uma plataforma digital de marketplace de ingressos. Esta Política descreve como coletamos, usamos e protegemos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
          </Section>

          <Section title="2. Dados que coletamos">
            <p><strong className="text-white/80">2.1 Dados fornecidos por você:</strong> nome completo, e-mail, CPF, data de nascimento, documentos de identificação (para verificação Ouro/Diamante), dados bancários para recebimento.</p>
            <p><strong className="text-white/80">2.2 Dados gerados pelo uso:</strong> histórico de transações, mensagens no chat (retidas por 90 dias após encerramento), avaliações, endereços IP, dispositivos utilizados, timestamps de acesso.</p>
            <p><strong className="text-white/80">2.3 Dados de pagamento:</strong> processados exclusivamente pelo Mercado Pago. Não armazenamos dados de cartão de crédito em nossos servidores.</p>
          </Section>

          <Section title="3. Para que usamos seus dados">
            <p>Utilizamos seus dados para: (i) criar e gerenciar sua conta, (ii) processar transações e pagamentos, (iii) verificar identidade de vendedores, (iv) resolver disputas e fraudes, (v) enviar notificações sobre transações, (vi) melhorar nossos serviços.</p>
            <p>Não utilizamos seus dados para publicidade de terceiros nem vendemos suas informações a nenhum parceiro.</p>
          </Section>

          <Section title="4. Base legal (LGPD)">
            <p>O tratamento dos seus dados é fundamentado em: <strong className="text-white/80">execução de contrato</strong> (para processar compras e vendas), <strong className="text-white/80">legítimo interesse</strong> (prevenção de fraudes, segurança), <strong className="text-white/80">consentimento</strong> (comunicações de marketing — você pode revogar a qualquer momento) e <strong className="text-white/80">obrigação legal</strong> (quando exigido por lei).</p>
          </Section>

          <Section title="5. Compartilhamento de dados">
            <p>Compartilhamos dados apenas com: <strong className="text-white/80">Mercado Pago</strong> (processamento de pagamentos), <strong className="text-white/80">Supabase</strong> (infraestrutura de banco de dados, servidores no Brasil/EUA), <strong className="text-white/80">autoridades legais</strong> quando exigido por ordem judicial.</p>
            <p>Qualquer compartilhamento com terceiros ocorre sob contratos de proteção de dados (DPA) e apenas o mínimo necessário é compartilhado.</p>
          </Section>

          <Section title="6. Retenção de dados">
            <p>Seus dados são mantidos enquanto sua conta estiver ativa. Após solicitação de exclusão, os dados são anonimizados em até 30 dias, exceto quando obrigados a manter por lei (ex: dados fiscais por 5 anos).</p>
            <p>Mensagens do chat são retidas por 90 dias após o encerramento da transação para fins de resolução de disputas.</p>
          </Section>

          <Section title="7. Seus direitos (LGPD)">
            <p>Você tem direito a: <strong className="text-white/80">acesso</strong> (solicitar cópia dos seus dados), <strong className="text-white/80">retificação</strong> (corrigir dados incorretos), <strong className="text-white/80">exclusão</strong> (solicitar remoção, salvo obrigações legais), <strong className="text-white/80">portabilidade</strong> (exportar seus dados), <strong className="text-white/80">revogação do consentimento</strong> (para comunicações de marketing).</p>
            <p>Para exercer seus direitos, entre em contato: <strong className="text-white/80">privacidade@ingressolivre.com</strong>. Respondemos em até 15 dias úteis.</p>
          </Section>

          <Section title="8. Cookies">
            <p>Utilizamos cookies essenciais (autenticação, sessão) e cookies analíticos (Google Analytics, com anonimização de IP). Cookies de marketing só são utilizados com seu consentimento explícito.</p>
            <p>Você pode gerenciar cookies pelo seu navegador a qualquer momento.</p>
          </Section>

          <Section title="9. Segurança">
            <p>Adotamos medidas técnicas e organizacionais para proteger seus dados: criptografia em trânsito (TLS 1.3), autenticação segura via Supabase Auth, controle de acesso por Row Level Security (RLS) no banco de dados, backups criptografados.</p>
          </Section>

          <Section title="10. Encarregado de Dados (DPO)">
            <p>Para questões relacionadas à privacidade e ao tratamento de dados, entre em contato com nosso Encarregado de Proteção de Dados pelo e-mail: <strong className="text-white/80">dpo@ingressolivre.com</strong>.</p>
          </Section>
        </div>

        <p className="text-white/30 text-xs text-center mt-8">
          Dúvidas?{" "}
          <Link href="/contato" className="text-[#e0f809] hover:underline">Entre em contato</Link>
          {" "}· Leia também os{" "}
          <Link href="/termos" className="text-[#e0f809] hover:underline">Termos de Uso</Link>
        </p>
      </div>
    </div>
  );
}
