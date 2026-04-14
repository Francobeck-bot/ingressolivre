import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This route is called by Vercel Crons every hour (see vercel.json).
// It finds transactions stuck in "aguardando_transferencia" for >24h
// and automatically refunds the buyer via Mercado Pago.

export const dynamic = "force-dynamic";
export const maxDuration = 60; // allow up to 60s for processing

export async function GET(req: NextRequest) {
  // Verify the request comes from Vercel Cron (prevents abuse)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use service role key to bypass RLS for this admin operation
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const DEADLINE_HOURS = 24;
  const deadlineAt = new Date(Date.now() - DEADLINE_HOURS * 60 * 60 * 1000).toISOString();

  // Find all transactions where seller missed the 24h deadline
  const { data: transacoes, error } = await supabase
    .from("transacoes")
    .select("id, valor_total, mp_payment_id, comprador_id, vendedor_id, updated_at")
    .eq("status", "aguardando_transferencia")
    .lt("updated_at", deadlineAt);

  if (error) {
    console.error("[cron/reembolso] DB error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!transacoes || transacoes.length === 0) {
    return NextResponse.json({ processed: 0, message: "No expired transactions found." });
  }

  let refunded = 0;
  let failed = 0;
  const results: { id: string; status: string; reason?: string }[] = [];

  for (const tx of transacoes) {
    try {
      // 1. Issue refund via Mercado Pago (if we have a payment ID)
      if (tx.mp_payment_id) {
        const mpRes = await fetch(
          `https://api.mercadopago.com/v1/payments/${tx.mp_payment_id}/refunds`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}), // empty body = full refund
          }
        );

        if (!mpRes.ok) {
          const mpErr = await mpRes.json();
          throw new Error(`MP refund failed: ${JSON.stringify(mpErr)}`);
        }
      }

      // 2. Update transaction status in DB
      const { error: updateErr } = await supabase
        .from("transacoes")
        .update({
          status: "reembolsado",
          updated_at: new Date().toISOString(),
        })
        .eq("id", tx.id);

      if (updateErr) throw new Error(updateErr.message);

      // 3. Optionally: create a system message in the chat
      await supabase.from("mensagens").insert({
        transacao_id: tx.id,
        remetente_id: tx.vendedor_id, // system message attributed to seller
        conteudo: "⚠️ [Sistema] O prazo de 24h para envio do ingresso expirou. O comprador foi reembolsado automaticamente.",
        is_system: true,
      }).maybeSingle(); // ignore errors if column doesn't exist yet

      refunded++;
      results.push({ id: tx.id, status: "refunded" });
      console.log(`[cron/reembolso] Refunded tx ${tx.id}`);
    } catch (err) {
      failed++;
      const reason = err instanceof Error ? err.message : String(err);
      results.push({ id: tx.id, status: "failed", reason });
      console.error(`[cron/reembolso] Failed tx ${tx.id}:`, reason);
    }
  }

  return NextResponse.json({
    processed: transacoes.length,
    refunded,
    failed,
    results,
  });
}
