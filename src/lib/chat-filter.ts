/**
 * Chat contact filter — blocks phone numbers, social handles, and external
 * contact references to keep all communication within the platform.
 */

const BLOCKED_PATTERNS: RegExp[] = [
  // Phone numbers: 8+ digit sequences with optional formatting
  /\b\d[\d\s\-().+]{7,}\d\b/g,
  // @username handles
  /@[\w.]+/g,
  // Social network keywords
  /\b(zap|whats|whatsapp|insta(gram)?|tiktok|twitter|direct|dm|chama\s*no|me\s*chama|t\.me|telegram)\b/gi,
  // Dots/dashes between digits (disguised phone)
  /\b\d{2}[\s.-]?\d{4,5}[\s.-]?\d{4}\b/g,
];

export interface FilterResult {
  content: string;
  wasCensored: boolean;
  original: string;
}

export function filterMessage(text: string): FilterResult {
  let result = text;
  let wasCensored = false;

  for (const pattern of BLOCKED_PATTERNS) {
    const patternWithReset = new RegExp(pattern.source, pattern.flags);
    if (patternWithReset.test(result)) {
      wasCensored = true;
      result = result.replace(
        new RegExp(pattern.source, pattern.flags),
        "[contato externo não permitido]"
      );
    }
  }

  return {
    content: result,
    wasCensored,
    original: text,
  };
}

export const CENSURA_AVISO =
  "Por segurança, contatos externos são bloqueados. Converse aqui e proteja sua compra.";
