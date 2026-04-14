import Link from "next/link";
import { FileText } from "lucide-react";

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

export default function TermosPage() {
  return (
    <div className="min-h-dvh py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#6b00b3]/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#6b00b3]" />
          </div>
          <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
            Termos de Uso
          </h1>
        </div>
        <p className="text-white/30 text-sm mb-10">Última atualização: 1 de abril de 2025</p>

        <div className="glass-card p-8">
          <Section title="1. Aceitação dos Termos">
            <p>Ao acessar ou utilizar a plataforma IngressoLivre (&quot;Plataforma&quot;), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar a Plataforma.</p>
            <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas por e-mail ou notificação na Plataforma.</p>
          </Section>

          <Section title="2. Descrição do Serviço">
            <p>O IngressoLivre é um marketplace de intermediação para compra e venda de ingressos entre usuários (&quot;Compradores&quot; e &quot;Vendedores&quot;). A Plataforma não produz, possui ou garante a autenticidade dos ingressos anunciados.</p>
            <p>A IngressoLivre atua exclusivamente como facilitadora, oferecendo sistema de pagamento em custódia (escrow), chat monitorado e sistema de resolução de disputas.</p>
          </Section>

          <Section title="3. Cadastro e Conta">
            <p>Para utilizar funcionalidades de compra e venda, é necessário criar uma conta com e-mail válido e senha. Você é responsável por manter a confidencialidade de suas credenciais.</p>
            <p>É proibido criar contas falsas, múltiplas contas para o mesmo usuário, ou contas em nome de terceiros sem autorização. Violações resultarão em suspensão permanente.</p>
            <p>Você deve ter no mínimo 18 anos para criar uma conta ou ter autorização de um responsável legal.</p>
          </Section>

          <Section title="4. Regras para Vendedores">
            <p><strong className="text-white/80">4.1</strong> Somente ingressos legítimos e que o vendedor possua direito de venda podem ser anunciados.</p>
            <p><strong className="text-white/80">4.2</strong> O vendedor tem prazo de <strong className="text-white/80">24 horas</strong> após a confirmação do pagamento para enviar o ingresso ao comprador via chat da Plataforma.</p>
            <p><strong className="text-white/80">4.3</strong> O não envio no prazo resultará em reembolso automático ao comprador e penalização da conta do vendedor.</p>
            <p><strong className="text-white/80">4.4</strong> A IngressoLivre cobra uma taxa de <strong className="text-white/80">4%</strong> sobre o valor de cada transação concluída, deduzida automaticamente no momento do repasse.</p>
            <p><strong className="text-white/80">4.5</strong> Vendedores com 3 ou mais disputas resolvidas contra si terão a conta suspensa automaticamente.</p>
          </Section>

          <Section title="5. Regras para Compradores">
            <p><strong className="text-white/80">5.1</strong> O pagamento é retido em custódia até a confirmação de recebimento pelo comprador.</p>
            <p><strong className="text-white/80">5.2</strong> O comprador deve confirmar o recebimento do ingresso em até <strong className="text-white/80">7 dias</strong> após o envio. Após este prazo, o pagamento é liberado automaticamente ao vendedor.</p>
            <p><strong className="text-white/80">5.3</strong> Após confirmar o recebimento, não é possível solicitar estorno pela Plataforma. Disputas devem ser abertas antes da confirmação.</p>
          </Section>

          <Section title="6. Comunicação e Censura">
            <p>O chat da Plataforma é monitorado automaticamente por um sistema de filtragem que bloqueia compartilhamento de dados de contato pessoal (telefone, WhatsApp, Instagram, e-mail, etc.).</p>
            <p>Tentativas de conduzir transações fora da Plataforma resultam na perda de toda proteção oferecida e podem levar à suspensão da conta.</p>
          </Section>

          <Section title="7. Disputas e Reembolsos">
            <p>Em caso de problemas, o comprador pode abrir uma disputa dentro do prazo de confirmação. A IngressoLivre analisará o histórico de mensagens e tomará uma decisão em até 48 horas úteis.</p>
            <p>A decisão da IngressoLivre em disputas é final e definitiva, salvo em casos de evidente erro material.</p>
          </Section>

          <Section title="8. Conteúdo Proibido">
            <p>É estritamente proibido anunciar: ingressos falsificados, ingressos para eventos já realizados, ingressos obtidos ilegalmente, ou qualquer item que não seja ingresso para evento.</p>
            <p>Conteúdo enganoso, fotos falsas ou preços deliberadamente enganosos resultarão em remoção imediata e banimento permanente.</p>
          </Section>

          <Section title="9. Limitação de Responsabilidade">
            <p>A IngressoLivre não é responsável por: (i) autenticidade dos ingressos, (ii) realização ou cancelamento de eventos, (iii) danos decorrentes de uso indevido da Plataforma por terceiros.</p>
            <p>Nossa responsabilidade máxima em qualquer disputa está limitada ao valor da transação envolvida.</p>
          </Section>

          <Section title="10. Lei Aplicável">
            <p>Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias.</p>
          </Section>
        </div>

        <p className="text-white/30 text-xs text-center mt-8">
          Dúvidas?{" "}
          <Link href="/contato" className="text-[#e0f809] hover:underline">Entre em contato</Link>
          {" "}ou leia nossa{" "}
          <Link href="/privacidade" className="text-[#e0f809] hover:underline">Política de Privacidade</Link>
        </p>
      </div>
    </div>
  );
}
