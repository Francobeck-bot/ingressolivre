-- =============================================
-- IngressoLivre — Supabase Schema v2
-- Execute no SQL Editor do Supabase
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE nivel_verificacao   AS ENUM ('bronze', 'ouro', 'diamante');
CREATE TYPE status_anuncio      AS ENUM ('ativo', 'pausado', 'vendido', 'expirado');
CREATE TYPE status_transacao    AS ENUM (
  'aguardando_pagamento',
  'pagamento_confirmado',
  'aguardando_transferencia',
  'transferencia_enviada',
  'confirmado_comprador',
  'em_disputa',
  'finalizado',
  'reembolsado'
);
CREATE TYPE status_disputa      AS ENUM ('aberta', 'em_analise', 'resolvida', 'fechada');
CREATE TYPE status_assinatura   AS ENUM ('ativa', 'cancelada', 'vencida');
CREATE TYPE status_documento    AS ENUM ('pendente', 'aprovado', 'rejeitado');
CREATE TYPE tipo_documento      AS ENUM ('rg', 'cnh', 'comprovante_residencia', 'selfie');

-- Tipos de setor do ingresso
CREATE TYPE setor_ingresso AS ENUM (
  'pista',
  'pista_vip',
  'mezanino',
  'camarote',
  'open_bar',
  'vip',
  'backstage',
  'frontstage',
  'area_vip'
);

-- Gênero do ingresso
CREATE TYPE genero_ingresso AS ENUM ('feminino', 'masculino', 'unisex');

-- Tipo de entrada (desconto)
CREATE TYPE entrada_ingresso AS ENUM ('inteira', 'meia_entrada', 'cortesia');


-- =============================================
-- PROFILES (extends auth.users)
-- =============================================
CREATE TABLE profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome                  TEXT NOT NULL,
  avatar_url            TEXT,
  nivel_verificacao     nivel_verificacao DEFAULT 'bronze',
  estrelas_media        DECIMAL(3,2) DEFAULT 0,
  total_vendas          INTEGER DEFAULT 0,
  cpf                   TEXT UNIQUE,
  telefone              TEXT,
  bio                   TEXT,
  disputas_procedentes  INTEGER DEFAULT 0,
  suspenso              BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- VERIFICACAO DE DOCUMENTOS
-- =============================================
CREATE TABLE verificacao_documentos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tipo          tipo_documento NOT NULL,
  arquivo_url   TEXT NOT NULL,
  status        status_documento DEFAULT 'pendente',
  revisado_por  UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EVENTOS
-- =============================================
CREATE TABLE eventos (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome            TEXT NOT NULL,
  descricao       TEXT,
  data            DATE NOT NULL,
  horario         TIME NOT NULL,
  local           TEXT NOT NULL,
  cidade          TEXT NOT NULL,
  estado          CHAR(2) NOT NULL,
  endereco        TEXT,                        -- rua, número, bairro
  imagem_url      TEXT,
  imagem_banner   TEXT,                        -- banner maior para página do evento
  site_oficial    TEXT,                        -- link do evento original
  categoria       TEXT,                        -- 'festa universitária', 'show', 'festival', etc.
  classificacao   TEXT,                        -- '18+', '16+', 'livre'
  criado_por      UUID REFERENCES profiles(id), -- admin que cadastrou
  verificado      BOOLEAN DEFAULT FALSE,        -- evento confirmado pelo time
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX eventos_data_idx    ON eventos(data);
CREATE INDEX eventos_cidade_idx  ON eventos(cidade);
CREATE INDEX eventos_estado_idx  ON eventos(estado);

-- =============================================
-- LOTES DE INGRESSO (tipos por evento)
-- Define quais ingressos cada evento tem,
-- com setor, gênero e tipo de entrada.
-- =============================================
CREATE TABLE lotes_ingresso (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evento_id         UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  nome              TEXT NOT NULL,              -- Ex: "Pista Feminino Meia Entrada"
  setor             setor_ingresso NOT NULL,    -- pista, camarote, etc.
  genero            genero_ingresso NOT NULL,   -- feminino, masculino, unisex
  entrada           entrada_ingresso NOT NULL,  -- inteira, meia_entrada, cortesia
  preco_face        DECIMAL(10,2),              -- preço original da produtora (referência)
  quantidade_total  INTEGER,                    -- quantidade total emitida (se souber)
  descricao         TEXT,                       -- detalhes extras do lote
  ativo             BOOLEAN DEFAULT TRUE,
  ordem             INTEGER DEFAULT 0,          -- ordenação na listagem
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX lotes_evento_idx ON lotes_ingresso(evento_id);

-- =============================================
-- ANUNCIOS (ingressos à venda)
-- =============================================
CREATE TABLE anuncios (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendedor_id                 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  evento_id                   UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  lote_id                     UUID REFERENCES lotes_ingresso(id),  -- vínculo ao lote (opcional p/ retrocompat)

  -- Campos herdados do lote (preenchidos pelo vendedor se lote não existir)
  setor                       setor_ingresso NOT NULL,
  genero                      genero_ingresso NOT NULL DEFAULT 'unisex',
  entrada                     entrada_ingresso NOT NULL DEFAULT 'inteira',

  quantidade                  INTEGER NOT NULL CHECK (quantidade > 0),
  preco                       DECIMAL(10,2) NOT NULL CHECK (preco > 0),
  observacoes                 TEXT,
  imagem_ingresso_url         TEXT,            -- foto do ingresso (com QR coberto)
  aceita_transferencia_titular BOOLEAN DEFAULT FALSE,
  status                      status_anuncio DEFAULT 'ativo',
  destaque                    BOOLEAN DEFAULT FALSE,
  visualizacoes               INTEGER DEFAULT 0,
  created_at                  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX anuncios_evento_idx    ON anuncios(evento_id);
CREATE INDEX anuncios_vendedor_idx  ON anuncios(vendedor_id);
CREATE INDEX anuncios_status_idx    ON anuncios(status);
CREATE INDEX anuncios_lote_idx      ON anuncios(lote_id);
CREATE INDEX anuncios_destaque_idx  ON anuncios(destaque DESC);

-- =============================================
-- TRANSACOES
-- =============================================
CREATE TABLE transacoes (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anuncio_id          UUID NOT NULL REFERENCES anuncios(id),
  comprador_id        UUID NOT NULL REFERENCES profiles(id),
  vendedor_id         UUID NOT NULL REFERENCES profiles(id),
  valor_total         DECIMAL(10,2) NOT NULL,   -- valor pago pelo comprador
  taxa                DECIMAL(10,2) NOT NULL,   -- taxa da plataforma (4%)
  valor_liquido       DECIMAL(10,2) NOT NULL,   -- valor que o vendedor recebe
  status              status_transacao DEFAULT 'aguardando_pagamento',
  mp_payment_id       TEXT,                     -- ID do pagamento no Mercado Pago
  mp_preference_id    TEXT,                     -- ID da preferência de pagamento
  ingresso_enviado_url TEXT,                    -- URL do ingresso enviado pelo vendedor
  prazo_vendedor      TIMESTAMPTZ,              -- deadline para vendedor enviar (24h)
  prazo_comprador     TIMESTAMPTZ,              -- deadline para comprador confirmar (7d)
  confirmado_em       TIMESTAMPTZ,              -- quando comprador confirmou
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX transacoes_comprador_idx ON transacoes(comprador_id);
CREATE INDEX transacoes_vendedor_idx  ON transacoes(vendedor_id);
CREATE INDEX transacoes_status_idx    ON transacoes(status);
CREATE INDEX transacoes_anuncio_idx   ON transacoes(anuncio_id);

-- =============================================
-- MENSAGENS (Chat por transação)
-- =============================================
CREATE TABLE mensagens (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transacao_id      UUID NOT NULL REFERENCES transacoes(id) ON DELETE CASCADE,
  remetente_id      UUID NOT NULL REFERENCES profiles(id),
  conteudo          TEXT NOT NULL,              -- conteúdo exibido (pode ser censurado)
  conteudo_original TEXT,                       -- original antes da censura
  foi_censurado     BOOLEAN DEFAULT FALSE,
  tipo              TEXT DEFAULT 'texto',       -- 'texto', 'arquivo', 'sistema'
  arquivo_url       TEXT,                       -- se tipo = 'arquivo'
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX mensagens_transacao_idx ON mensagens(transacao_id);

-- =============================================
-- AVALIACOES
-- =============================================
CREATE TABLE avaliacoes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transacao_id  UUID NOT NULL REFERENCES transacoes(id),
  avaliador_id  UUID NOT NULL REFERENCES profiles(id),
  avaliado_id   UUID NOT NULL REFERENCES profiles(id),
  nota          INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(transacao_id, avaliador_id)
);

CREATE INDEX avaliacoes_avaliado_idx ON avaliacoes(avaliado_id);

-- =============================================
-- DISPUTAS
-- =============================================
CREATE TABLE disputas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transacao_id  UUID NOT NULL REFERENCES transacoes(id),
  aberta_por    UUID NOT NULL REFERENCES profiles(id),
  motivo        TEXT NOT NULL,
  evidencias    TEXT[],                        -- array de URLs de prints/evidências
  status        status_disputa DEFAULT 'aberta',
  resolucao     TEXT,
  resolvido_por UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ASSINATURAS DIAMANTE
-- =============================================
CREATE TABLE assinaturas (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mp_subscription_id    TEXT NOT NULL,
  status                status_assinatura DEFAULT 'ativa',
  proximo_vencimento    TIMESTAMPTZ NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FAVORITOS
-- =============================================
CREATE TABLE favoritos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  anuncio_id  UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, anuncio_id)
);

-- =============================================
-- NOTIFICACOES
-- =============================================
CREATE TABLE notificacoes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  titulo      TEXT NOT NULL,
  mensagem    TEXT NOT NULL,
  tipo        TEXT NOT NULL,   -- 'venda', 'compra', 'disputa', 'sistema', 'avaliacao'
  lida        BOOLEAN DEFAULT FALSE,
  link        TEXT,            -- rota para navegar ao clicar
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX notificacoes_user_idx  ON notificacoes(user_id);
CREATE INDEX notificacoes_lida_idx  ON notificacoes(lida);

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-criar profile quando usuário se cadastra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nome, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Atualizar updated_at nas transações
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transacoes_updated_at
  BEFORE UPDATE ON transacoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Recalcular média de estrelas do vendedor após avaliação
CREATE OR REPLACE FUNCTION update_seller_stars()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET
    estrelas_media = (SELECT AVG(nota)::DECIMAL(3,2) FROM avaliacoes WHERE avaliado_id = NEW.avaliado_id),
    total_vendas   = (SELECT COUNT(*) FROM transacoes WHERE vendedor_id = NEW.avaliado_id AND status = 'finalizado')
  WHERE id = NEW.avaliado_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_avaliacao_insert
  AFTER INSERT ON avaliacoes
  FOR EACH ROW EXECUTE FUNCTION update_seller_stars();

-- Suspender vendedor com 3+ disputas procedentes
CREATE OR REPLACE FUNCTION check_seller_suspension()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'resolvida' AND NEW.resolucao ILIKE '%procedente%' THEN
    UPDATE profiles
    SET disputas_procedentes = disputas_procedentes + 1
    WHERE id = (SELECT vendedor_id FROM transacoes WHERE id = NEW.transacao_id);

    UPDATE profiles
    SET suspenso = TRUE
    WHERE id = (SELECT vendedor_id FROM transacoes WHERE id = NEW.transacao_id)
      AND disputas_procedentes >= 3;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_disputa_resolve
  AFTER UPDATE ON disputas
  FOR EACH ROW EXECUTE FUNCTION check_seller_suspension();

-- Marcar anúncio como vendido quando transação é finalizada
CREATE OR REPLACE FUNCTION marcar_anuncio_vendido()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'finalizado' AND OLD.status != 'finalizado' THEN
    UPDATE anuncios SET status = 'vendido' WHERE id = NEW.anuncio_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_transacao_finalizada
  AFTER UPDATE ON transacoes
  FOR EACH ROW EXECUTE FUNCTION marcar_anuncio_vendido();

-- Incrementar visualizações do anúncio (chamar via RPC no front)
CREATE OR REPLACE FUNCTION increment_visualizacoes(anuncio_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE anuncios SET visualizacoes = visualizacoes + 1 WHERE id = anuncio_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE verificacao_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos                ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes_ingresso         ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncios               ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens              ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputas               ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas            ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos              ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes           ENABLE ROW LEVEL SECURITY;

-- Profiles: qualquer um lê, só dono edita
CREATE POLICY "profiles_select_all"  ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own"  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Eventos: qualquer um lê, autenticado insere
CREATE POLICY "eventos_select_all"   ON eventos FOR SELECT USING (true);
CREATE POLICY "eventos_insert_auth"  ON eventos FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Lotes: qualquer um lê (info pública)
CREATE POLICY "lotes_select_all"     ON lotes_ingresso FOR SELECT USING (true);
CREATE POLICY "lotes_insert_auth"    ON lotes_ingresso FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Anúncios: ativos são públicos; dono vê todos os seus
CREATE POLICY "anuncios_select_active" ON anuncios FOR SELECT USING (status = 'ativo' OR vendedor_id = auth.uid());
CREATE POLICY "anuncios_insert_own"    ON anuncios FOR INSERT WITH CHECK (auth.uid() = vendedor_id);
CREATE POLICY "anuncios_update_own"    ON anuncios FOR UPDATE USING (auth.uid() = vendedor_id);

-- Transações: só comprador e vendedor veem
CREATE POLICY "transacoes_select_parties" ON transacoes FOR SELECT USING (comprador_id = auth.uid() OR vendedor_id = auth.uid());
CREATE POLICY "transacoes_insert_buyer"   ON transacoes FOR INSERT WITH CHECK (auth.uid() = comprador_id);
CREATE POLICY "transacoes_update_parties" ON transacoes FOR UPDATE USING (comprador_id = auth.uid() OR vendedor_id = auth.uid());

-- Mensagens: só partes da transação
CREATE POLICY "mensagens_select_parties" ON mensagens FOR SELECT USING (
  EXISTS (SELECT 1 FROM transacoes t WHERE t.id = transacao_id AND (t.comprador_id = auth.uid() OR t.vendedor_id = auth.uid()))
);
CREATE POLICY "mensagens_insert_parties" ON mensagens FOR INSERT WITH CHECK (
  auth.uid() = remetente_id AND
  EXISTS (SELECT 1 FROM transacoes t WHERE t.id = transacao_id AND (t.comprador_id = auth.uid() OR t.vendedor_id = auth.uid()))
);

-- Avaliações: qualquer um lê, dono insere
CREATE POLICY "avaliacoes_select_all"  ON avaliacoes FOR SELECT USING (true);
CREATE POLICY "avaliacoes_insert_own"  ON avaliacoes FOR INSERT WITH CHECK (auth.uid() = avaliador_id);

-- Documentos de verificação: só o dono
CREATE POLICY "verificacao_select_own" ON verificacao_documentos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "verificacao_insert_own" ON verificacao_documentos FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Disputas
CREATE POLICY "disputas_select_parties" ON disputas FOR SELECT USING (
  auth.uid() = aberta_por OR
  EXISTS (SELECT 1 FROM transacoes t WHERE t.id = transacao_id AND t.vendedor_id = auth.uid())
);
CREATE POLICY "disputas_insert_parties" ON disputas FOR INSERT WITH CHECK (auth.uid() = aberta_por);

-- Assinaturas: só o dono
CREATE POLICY "assinaturas_select_own" ON assinaturas FOR SELECT USING (auth.uid() = user_id);

-- Favoritos: só o dono
CREATE POLICY "favoritos_select_own"  ON favoritos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favoritos_insert_own"  ON favoritos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favoritos_delete_own"  ON favoritos FOR DELETE USING (auth.uid() = user_id);

-- Notificações: só o destinatário
CREATE POLICY "notificacoes_select_own" ON notificacoes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notificacoes_update_own" ON notificacoes FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- STORAGE BUCKETS (criar no painel Supabase)
-- =============================================
-- Criar manualmente no painel > Storage:
--   • "avatars"    — público, max 2MB, imagens
--   • "ingressos"  — privado, max 5MB, imagens/pdf
--   • "eventos"    — público, max 5MB, imagens
--   • "documentos" — privado, max 10MB, imagens/pdf
