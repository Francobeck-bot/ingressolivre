import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "@/lib/supabase/server";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { transacaoId } = await req.json();
    if (!transacaoId) return NextResponse.json({ error: "transacaoId obrigatório" }, { status: 400 });

    const supabase = await createClient();

    // Verify auth
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    // Load transaction
    const { data: transacao, error: txErr } = await supabase
      .from("transacoes")
      .select("*, anuncio:anuncios(*, evento:eventos(*))")
      .eq("id", transacaoId)
      .eq("comprador_id", userData.user.id)
      .single();

    if (txErr || !transacao) return NextResponse.json({ error: "Transação não encontrada" }, { status: 404 });

    const evento = transacao.anuncio?.evento;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://ingressolivre.vercel.app";

    // Create MP preference
    const preference = new Preference(mp);
    const response = await preference.create({
      body: {
        items: [
          {
            id: transacaoId,
            title: evento?.nome ?? "Ingresso",
            description: `${transacao.anuncio?.tipo_ingresso ?? ""} — ${evento?.data ?? ""}`,
            quantity: 1,
            unit_price: transacao.valor_total,
            currency_id: "BRL",
          },
        ],
        payer: {
          email: userData.user.email,
        },
        payment_methods: {
          excluded_payment_types: [],
          installments: 1,
        },
        back_urls: {
          success: `${baseUrl}/minha-conta/compras?pagamento=sucesso`,
          failure: `${baseUrl}/minha-conta/compras?pagamento=falha`,
          pending: `${baseUrl}/minha-conta/compras?pagamento=pendente`,
        },
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        external_reference: transacaoId,
        statement_descriptor: "IngressoLivre",
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
      },
    });

    // Save MP preference ID on transaction
    await supabase
      .from("transacoes")
      .update({ mp_payment_id: response.id ?? null })
      .eq("id", transacaoId);

    return NextResponse.json({
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      preference_id: response.id,
    });
  } catch (err) {
    console.error("[/api/pagamento]", err);
    return NextResponse.json({ error: "Erro interno ao criar preferência" }, { status: 500 });
  }
}
