export type NivelVerificacao = "bronze" | "ouro" | "diamante";

export type SetorIngresso =
  | "pista"
  | "pista_vip"
  | "mezanino"
  | "camarote"
  | "open_bar"
  | "vip"
  | "backstage"
  | "frontstage"
  | "area_vip";

export type GeneroIngresso = "feminino" | "masculino" | "unisex";

export type EntradaIngresso = "inteira" | "meia_entrada" | "cortesia";

/** @deprecated use SetorIngresso */
export type TipoIngresso = SetorIngresso;

export type StatusAnuncio = "ativo" | "pausado" | "vendido" | "expirado";

export type StatusTransacao =
  | "aguardando_pagamento"
  | "pagamento_confirmado"
  | "aguardando_transferencia"
  | "transferencia_enviada"
  | "confirmado_comprador"
  | "em_disputa"
  | "finalizado"
  | "reembolsado";

export type StatusDisputa = "aberta" | "em_analise" | "resolvida" | "fechada";

export type StatusAssinatura = "ativa" | "cancelada" | "vencida";

export type StatusDocumento = "pendente" | "aprovado" | "rejeitado";

// ─────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────
export interface Profile {
  id: string;
  nome: string;
  avatar_url: string | null;
  nivel_verificacao: NivelVerificacao;
  estrelas_media: number;
  total_vendas: number;
  cpf: string | null;
  telefone: string | null;
  bio: string | null;
  disputas_procedentes: number;
  suspenso: boolean;
  created_at: string;
}

// ─────────────────────────────────────────────
// VERIFICACAO DOCUMENTO
// ─────────────────────────────────────────────
export interface VerificacaoDocumento {
  id: string;
  user_id: string;
  tipo: "rg" | "cnh" | "comprovante_residencia" | "selfie";
  arquivo_url: string;
  status: StatusDocumento;
  revisado_por: string | null;
  created_at: string;
}

// ─────────────────────────────────────────────
// EVENTO
// ─────────────────────────────────────────────
export interface Evento {
  id: string;
  nome: string;
  descricao: string | null;
  data: string;
  horario: string;
  local: string;
  cidade: string;
  estado: string;
  endereco: string | null;
  imagem_url: string | null;
  imagem_banner: string | null;
  site_oficial: string | null;
  categoria: string | null;
  classificacao: string | null;
  criado_por: string | null;
  verificado: boolean;
  created_at: string;
  // joined
  lotes?: LoteIngresso[];
}

// ─────────────────────────────────────────────
// LOTE DE INGRESSO (tipos por evento)
// ─────────────────────────────────────────────
export interface LoteIngresso {
  id: string;
  evento_id: string;
  nome: string;              // Ex: "Pista Feminino Meia Entrada"
  setor: SetorIngresso;
  genero: GeneroIngresso;
  entrada: EntradaIngresso;
  preco_face: number | null; // preço original da produtora
  quantidade_total: number | null;
  descricao: string | null;
  ativo: boolean;
  ordem: number;
  created_at: string;
  // joined
  evento?: Evento;
}

// ─────────────────────────────────────────────
// ANUNCIO
// ─────────────────────────────────────────────
export interface Anuncio {
  id: string;
  vendedor_id: string;
  evento_id: string;
  lote_id: string | null;
  setor: SetorIngresso;
  genero: GeneroIngresso;
  entrada: EntradaIngresso;
  quantidade: number;
  preco: number;
  observacoes: string | null;
  imagem_ingresso_url: string | null;
  aceita_transferencia_titular: boolean;
  status: StatusAnuncio;
  destaque: boolean;
  visualizacoes: number;
  created_at: string;
  // joined
  evento?: Evento;
  vendedor?: Profile;
  lote?: LoteIngresso;
}

// ─────────────────────────────────────────────
// TRANSACAO
// ─────────────────────────────────────────────
export interface Transacao {
  id: string;
  anuncio_id: string;
  comprador_id: string;
  vendedor_id: string;
  valor_total: number;
  taxa: number;
  valor_liquido: number;
  status: StatusTransacao;
  mp_payment_id: string | null;
  mp_preference_id: string | null;
  ingresso_enviado_url: string | null;
  prazo_vendedor: string | null;
  prazo_comprador: string | null;
  confirmado_em: string | null;
  created_at: string;
  updated_at: string;
  // joined
  anuncio?: Anuncio;
  comprador?: Profile;
  vendedor?: Profile;
}

// ─────────────────────────────────────────────
// MENSAGEM
// ─────────────────────────────────────────────
export interface Mensagem {
  id: string;
  transacao_id: string;
  remetente_id: string;
  conteudo: string;
  conteudo_original: string | null;
  foi_censurado: boolean;
  tipo: "texto" | "arquivo" | "sistema";
  arquivo_url: string | null;
  created_at: string;
  // joined
  remetente?: Profile;
}

// ─────────────────────────────────────────────
// AVALIACAO
// ─────────────────────────────────────────────
export interface Avaliacao {
  id: string;
  transacao_id: string;
  avaliador_id: string;
  avaliado_id: string;
  nota: number;
  comentario: string | null;
  created_at: string;
  // joined
  avaliador?: Profile;
}

// ─────────────────────────────────────────────
// DISPUTA
// ─────────────────────────────────────────────
export interface Disputa {
  id: string;
  transacao_id: string;
  aberta_por: string;
  motivo: string;
  evidencias: string[] | null;
  status: StatusDisputa;
  resolucao: string | null;
  resolvido_por: string | null;
  created_at: string;
  // joined
  transacao?: Transacao;
}

// ─────────────────────────────────────────────
// ASSINATURA
// ─────────────────────────────────────────────
export interface Assinatura {
  id: string;
  user_id: string;
  mp_subscription_id: string;
  status: StatusAssinatura;
  proximo_vencimento: string;
  created_at: string;
}

// ─────────────────────────────────────────────
// FAVORITO
// ─────────────────────────────────────────────
export interface Favorito {
  id: string;
  user_id: string;
  anuncio_id: string;
  created_at: string;
  // joined
  anuncio?: Anuncio;
}

// ─────────────────────────────────────────────
// NOTIFICACAO
// ─────────────────────────────────────────────
export interface Notificacao {
  id: string;
  user_id: string;
  titulo: string;
  mensagem: string;
  tipo: "venda" | "compra" | "disputa" | "sistema" | "avaliacao";
  lida: boolean;
  link: string | null;
  created_at: string;
}

// ─────────────────────────────────────────────
// DATABASE (tipo raiz p/ Supabase client)
// ─────────────────────────────────────────────
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "estrelas_media" | "total_vendas" | "disputas_procedentes" | "suspenso">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      eventos: {
        Row: Evento;
        Insert: Omit<Evento, "id" | "created_at" | "verificado" | "lotes">;
        Update: Partial<Omit<Evento, "id" | "created_at" | "lotes">>;
      };
      lotes_ingresso: {
        Row: LoteIngresso;
        Insert: Omit<LoteIngresso, "id" | "created_at" | "evento">;
        Update: Partial<Omit<LoteIngresso, "id" | "created_at" | "evento">>;
      };
      anuncios: {
        Row: Anuncio;
        Insert: Omit<Anuncio, "id" | "created_at" | "visualizacoes" | "evento" | "vendedor" | "lote">;
        Update: Partial<Omit<Anuncio, "id" | "created_at" | "evento" | "vendedor" | "lote">>;
      };
      transacoes: {
        Row: Transacao;
        Insert: Omit<Transacao, "id" | "created_at" | "updated_at" | "anuncio" | "comprador" | "vendedor">;
        Update: Partial<Omit<Transacao, "id" | "created_at" | "anuncio" | "comprador" | "vendedor">>;
      };
      mensagens: {
        Row: Mensagem;
        Insert: Omit<Mensagem, "id" | "created_at" | "remetente">;
        Update: Partial<Omit<Mensagem, "id" | "created_at" | "remetente">>;
      };
      avaliacoes: {
        Row: Avaliacao;
        Insert: Omit<Avaliacao, "id" | "created_at" | "avaliador">;
        Update: Partial<Omit<Avaliacao, "id" | "created_at" | "avaliador">>;
      };
      disputas: {
        Row: Disputa;
        Insert: Omit<Disputa, "id" | "created_at" | "transacao">;
        Update: Partial<Omit<Disputa, "id" | "created_at" | "transacao">>;
      };
      assinaturas: {
        Row: Assinatura;
        Insert: Omit<Assinatura, "id" | "created_at">;
        Update: Partial<Omit<Assinatura, "id" | "created_at">>;
      };
      verificacao_documentos: {
        Row: VerificacaoDocumento;
        Insert: Omit<VerificacaoDocumento, "id" | "created_at">;
        Update: Partial<Omit<VerificacaoDocumento, "id" | "created_at">>;
      };
      favoritos: {
        Row: Favorito;
        Insert: Omit<Favorito, "id" | "created_at" | "anuncio">;
        Update: never;
      };
      notificacoes: {
        Row: Notificacao;
        Insert: Omit<Notificacao, "id" | "created_at" | "lida">;
        Update: Partial<Pick<Notificacao, "lida">>;
      };
    };
  };
}
