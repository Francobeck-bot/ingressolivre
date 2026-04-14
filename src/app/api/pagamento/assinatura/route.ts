import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { createClient } from "@/lib/supabase/server";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://ingressolivre.vercel.app";

    // Check for existing active subscription
    const { data: existing } = await supabase
      .from("assinaturas")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("status", "ativa")
      .single();

    if (existing) {
      return NextResponse.json({ message: "Assinatura ativa", assinatura: existing });
    }

    const preApproval = new PreApproval(mp);
    const response = await preApproval.create({
      body: {
        reason: "IngressoLivre Diamante — Vendedor Premium",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 10,
          currency_id: "BRL",
        },
        back_url: `${baseUrl}/minha-conta/verificacao?assinatura=sucesso`,
        payer_email: userData.user.email,
        status: "pending",
        external_reference: userData.user.id,
      },
    });

    return NextResponse.json({ init_point: response.init_point });
  } catch (err) {
    console.error("[/api/pagamento/assinatura]", err);
    return NextResponse.json({ error: "Erro ao criar assinatura" }, { status: 500 });
  }
}
