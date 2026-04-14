"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, Shield, AlertCircle, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import StatusBadge from "@/components/StatusBadge";
import { filterMessage, CENSURA_AVISO } from "@/lib/chat-filter";
import { formatDateTime } from "@/lib/utils";
import type { Transacao, Mensagem, Profile } from "@/types/database";
import type { RealtimeChannel } from "@supabase/supabase-js";

function ChatPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("transacao"));
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [hasCensura, setHasCensura] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [onlineUsers] = useState<Set<string>>(new Set());

  // Auth + load conversations
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login?next=/chat"); return; }
      setUserId(data.user.id);
      loadConversations(data.user.id);
    });
  }, []);

  async function loadConversations(uid: string) {
    const { data } = await supabase
      .from("transacoes")
      .select("*, anuncio:anuncios(*, evento:eventos(*)), comprador:profiles(*), vendedor:profiles(*)")
      .or(`comprador_id.eq.${uid},vendedor_id.eq.${uid}`)
      .in("status", ["aguardando_transferencia", "transferencia_enviada", "confirmado_comprador", "em_disputa", "pagamento_confirmado"])
      .order("updated_at", { ascending: false });

    setTransacoes((data as Transacao[]) ?? []);
    setLoadingChats(false);

    // Auto-select from URL param
    if (searchParams.get("transacao") && !selectedId) {
      setSelectedId(searchParams.get("transacao"));
    } else if (!selectedId && data && data.length > 0) {
      setSelectedId((data as Transacao[])[0].id);
    }
  }

  // Load messages + subscribe to realtime
  const loadMessages = useCallback(async (transacaoId: string) => {
    setLoadingMsgs(true);
    const { data } = await supabase
      .from("mensagens")
      .select("*, remetente:profiles(nome, avatar_url)")
      .eq("transacao_id", transacaoId)
      .order("created_at", { ascending: true });

    setMensagens((data as Mensagem[]) ?? []);
    setLoadingMsgs(false);

    // Unsubscribe from previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Subscribe to new messages in real time
    const channel = supabase
      .channel(`chat:${transacaoId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensagens", filter: `transacao_id=eq.${transacaoId}` },
        async (payload) => {
          // Fetch joined row
          const { data: msg } = await supabase
            .from("mensagens")
            .select("*, remetente:profiles(nome, avatar_url)")
            .eq("id", payload.new.id)
            .single();
          if (msg) setMensagens((prev) => [...prev, msg as Mensagem]);
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, [supabase]);

  useEffect(() => {
    if (selectedId) loadMessages(selectedId);
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [selectedId, loadMessages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !selectedId || !userId || sending) return;

    const { content, wasCensored, original } = filterMessage(input.trim());
    setSending(true);
    setHasCensura(wasCensored);

    await supabase.from("mensagens").insert({
      transacao_id: selectedId,
      remetente_id: userId,
      conteudo: content,
      conteudo_original: wasCensored ? original : null,
      foi_censurado: wasCensored,
    });

    setInput("");
    setSending(false);
  }

  const selectedTransacao = transacoes.find((t) => t.id === selectedId);
  const otherParty = selectedTransacao
    ? userId === selectedTransacao.comprador_id
      ? (selectedTransacao as Transacao & { vendedor?: Profile })?.vendedor
      : (selectedTransacao as Transacao & { comprador?: Profile })?.comprador
    : null;

  return (
    <div className="min-h-dvh flex" style={{ height: "calc(100dvh - 64px)" }}>
      {/* Conversations sidebar */}
      <aside className={`w-full sm:w-80 flex-shrink-0 border-r border-white/10 flex flex-col ${selectedId ? "hidden sm:flex" : "flex"}`}>
        <div className="p-4 border-b border-white/10">
          <h1 className="text-white font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
            Mensagens
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingChats ? (
            <div className="p-4 space-y-3">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-10 h-10 skeleton rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 skeleton rounded w-3/4" />
                    <div className="h-3 skeleton rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : transacoes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-white/30 text-sm">Nenhuma conversa ativa</p>
            </div>
          ) : (
            transacoes.map((t) => {
              const isSelected = t.id === selectedId;
              const other = userId === t.comprador_id
                ? (t as Transacao & { vendedor?: Profile })?.vendedor
                : (t as Transacao & { comprador?: Profile })?.comprador;
              const ev = t.anuncio?.evento;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-all border-b border-white/5 hover:bg-white/5 ${
                    isSelected ? "bg-white/8 border-l-2 border-l-[#e0408a]" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-main flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                      {other?.avatar_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={other.avatar_url} alt={other.nome} className="w-full h-full object-cover" />
                        : other?.nome?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <Circle
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${
                        onlineUsers.has(other?.id ?? "") ? "text-green-400 fill-green-400" : "text-gray-600 fill-gray-700"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate" style={{ fontFamily: "Syne, sans-serif" }}>
                      {other?.nome ?? "Usuário"}
                    </p>
                    <p className="text-white/40 text-xs truncate mt-0.5">{ev?.nome ?? "Evento"}</p>
                    <StatusBadge status={t.status} className="mt-1 scale-90 origin-left" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${!selectedId ? "hidden sm:flex" : "flex"}`}>
        {!selectedId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4">
                <Send className="w-7 h-7 text-white/20" />
              </div>
              <p className="text-white/40 text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
                Selecione uma conversa
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <button
                className="sm:hidden p-2 text-white/50 hover:text-white"
                onClick={() => setSelectedId(null)}
              >
                ← Voltar
              </button>
              {otherParty && (
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-main flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                      {otherParty.avatar_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={otherParty.avatar_url} alt={otherParty.nome} className="w-full h-full object-cover" />
                        : otherParty.nome.charAt(0).toUpperCase()}
                    </div>
                    <Circle className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${
                      onlineUsers.has(otherParty.id) ? "text-green-400 fill-green-400" : "text-gray-600 fill-gray-700"
                    }`} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>
                      {otherParty.nome}
                    </p>
                    <p className="text-white/40 text-xs">
                      {selectedTransacao?.anuncio?.evento?.nome ?? ""}
                    </p>
                  </div>
                  {selectedTransacao && (
                    <div className="ml-auto">
                      <StatusBadge status={selectedTransacao.status} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Safety notice pinned at top */}
              <div className="flex gap-2 p-3 rounded-xl bg-[#6b00b3]/10 border border-[#6b00b3]/20 mb-4">
                <Shield className="w-4 h-4 text-[#6b00b3] flex-shrink-0 mt-0.5" />
                <p className="text-white/50 text-xs">{CENSURA_AVISO}</p>
              </div>

              {loadingMsgs ? (
                <div className="space-y-3">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                      <div className={`h-10 skeleton rounded-2xl ${i % 2 === 0 ? "w-48" : "w-36"}`} />
                    </div>
                  ))}
                </div>
              ) : (
                mensagens.map((m) => {
                  const isMe = m.remetente_id === userId;
                  return (
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}>
                      {!isMe && (
                        <div className="w-7 h-7 rounded-full bg-gradient-main flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-1 overflow-hidden">
                          {m.remetente?.avatar_url
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={m.remetente.avatar_url} alt="" className="w-full h-full object-cover" />
                            : m.remetente?.nome?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                      )}
                      <div className={`max-w-[72%] space-y-1 ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMe
                              ? "bg-gradient-main text-white rounded-tr-md"
                              : "glass-card text-white/90 rounded-tl-md"
                          } ${m.foi_censurado ? "opacity-70" : ""}`}
                        >
                          {m.conteudo}
                          {m.foi_censurado && (
                            <span className="block text-xs text-yellow-400/80 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Contato externo bloqueado
                            </span>
                          )}
                        </div>
                        <p className="text-white/25 text-xs px-1">{formatDateTime(m.created_at)}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Censura warning */}
            {hasCensura && (
              <div className="mx-4 mb-2 flex gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {CENSURA_AVISO}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="p-4 border-t border-white/10 flex items-end gap-3"
            >
              <textarea
                value={input}
                onChange={(e) => { setInput(e.target.value); setHasCensura(false); }}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(e as unknown as React.FormEvent); }}}
                placeholder="Digite sua mensagem..."
                rows={1}
                className="flex-1 px-4 py-3 rounded-2xl glass-card border border-white/10 focus:border-[rgba(224,248,9,0.3)] text-white bg-transparent outline-none text-sm placeholder-white/30 resize-none max-h-32"
                style={{ minHeight: "48px" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="w-11 h-11 rounded-2xl bg-gradient-main flex items-center justify-center text-white disabled:opacity-40 flex-shrink-0 shadow-glow-sm transition-all hover:shadow-glow disabled:cursor-not-allowed"
                aria-label="Enviar"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageInner />
    </Suspense>
  );
}
