import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@/lib/supabase/server";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    // Only handle payment notifications
    if (type !== "payment" && type !== "preapproval") {
      return NextResponse.json({ received: true });
    }

    const supabase = await createClient();

    // ── PAYMENT WEBHOOK ──
    if (type === "payment") {
      const paymentId = data?.id;
      if (!paymentId) return NextResponse.json({ error: "No payment ID" }, { status: 400 });

      const paymentClient = new Payment(mp);
      const payment = await paymentClient.get({ id: paymentId });

      const transacaoId = payment.external_reference;
      const status = payment.status;

      if (!transacaoId) return NextResponse.json({ error: "No external_reference" }, { status: 400 });

      if (status === "approved") {
        // Update transaction to pagamento_confirmado → aguardando_transferencia
        const { data: transacao } = await supabase
          .from("transacoes")
          .select("vendedor_id, valor_liquido")
          .eq("id", transacaoId)
          .single();

        if (transacao) {
          const prazoVendedor = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // +24h

          await supabase
            .from("transacoes")
            .update({
              status: "aguardando_transferencia",
              mp_payment_id: String(paymentId),
              prazo_vendedor: prazoVendedor,
            })
            .eq("id", transacaoId);
        }
      } else if (status === "rejected" || status === "cancelled") {
        await supabase
          .from("transacoes")
          .update({ status: "reembolsado" })
          .eq("id", transacaoId);
      }
    }

    // ── SUBSCRIPTION WEBHOOK ──
    if (type === "preapproval") {
      const preApprovalId = data?.id;
      if (!preApprovalId) return NextResponse.json({ error: "No preapproval ID" }, { status: 400 });

      // In production, fetch full preapproval details from MP API
      // For now, check external_reference to map user
      const { data: assinatura } = await supabase
        .from("assinaturas")
        .select("*")
        .eq("mp_subscription_id", String(preApprovalId))
        .single();

      if (assinatura && body.action === "updated") {
        const newStatus = body.data?.status === "authorized" ? "ativa" : "cancelada";

        await supabase
          .from("assinaturas")
          .update({ status: newStatus })
          .eq("id", assinatura.id);

        // Update seller level
        if (newStatus === "ativa") {
          await supabase
            .from("profiles")
            .update({ nivel_verificacao: "diamante" })
            .eq("id", assinatura.user_id);
        } else {
          // Downgrade to ouro on cancel
          await supabase
            .from("profiles")
            .update({ nivel_verificacao: "ouro" })
            .eq("id", assinatura.user_id);
        }
      } else if (!assinatura && body.action === "created") {
        // Create subscription record if new
        const userId = body.data?.external_reference;
        if (userId) {
          const nextBilling = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          await supabase.from("assinaturas").insert({
            user_id: userId,
            mp_subscription_id: String(preApprovalId),
            status: "ativa",
            proximo_vencimento: nextBilling,
          });
          await supabase
            .from("profiles")
            .update({ nivel_verificacao: "diamante" })
            .eq("id", userId);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook/mercadopago]", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
