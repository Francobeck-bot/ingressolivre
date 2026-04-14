export default function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background glow circles */}
      <circle cx="260" cy="210" r="180" fill="rgba(107,0,179,0.12)" />
      <circle cx="260" cy="210" r="120" fill="rgba(224,64,138,0.08)" />

      {/* Confetti */}
      <rect x="60" y="50" width="12" height="12" rx="2" fill="#e0f809" transform="rotate(20 60 50)" opacity="0.9" />
      <rect x="420" y="70" width="10" height="10" rx="2" fill="#e0408a" transform="rotate(-15 420 70)" opacity="0.9" />
      <circle cx="100" cy="120" r="6" fill="#6b00b3" opacity="0.8" />
      <rect x="450" y="130" width="8" height="8" rx="1" fill="#e0f809" transform="rotate(35 450 130)" opacity="0.8" />
      <circle cx="80" cy="320" r="5" fill="#e0408a" opacity="0.7" />
      <rect x="430" y="300" width="10" height="10" rx="2" fill="#6b00b3" transform="rotate(-20 430 300)" opacity="0.8" />
      <circle cx="490" cy="200" r="7" fill="#e0f809" opacity="0.6" />
      <rect x="30" y="230" width="8" height="8" rx="1" fill="#e0408a" transform="rotate(45 30 230)" opacity="0.7" />

      {/* Stars */}
      <path d="M80 160 L82 154 L84 160 L90 160 L85 164 L87 170 L82 166 L77 170 L79 164 L74 160 Z" fill="#e0f809" opacity="0.7" />
      <path d="M440 180 L442 174 L444 180 L450 180 L445 184 L447 190 L442 186 L437 190 L439 184 L434 180 Z" fill="#e0f809" opacity="0.6" />
      <path d="M180 40 L181 37 L182 40 L185 40 L183 42 L184 45 L181 43 L178 45 L179 42 L177 40 Z" fill="white" opacity="0.5" />
      <path d="M380 30 L381 27 L382 30 L385 30 L383 32 L384 35 L381 33 L378 35 L379 32 L377 30 Z" fill="white" opacity="0.5" />

      {/* Person 1 — Dancing (left) */}
      {/* Head */}
      <circle cx="155" cy="155" r="28" fill="#FDBCB4" stroke="#1a0030" strokeWidth="3" />
      {/* Hair */}
      <path d="M130 148 Q132 125 155 122 Q178 125 180 148" fill="#1a0030" stroke="#1a0030" strokeWidth="2" />
      {/* Body */}
      <path d="M140 183 Q130 200 125 230 L185 230 Q180 200 170 183 Z" fill="#6b00b3" stroke="#1a0030" strokeWidth="2.5" />
      {/* Left arm raised up */}
      <path d="M140 195 Q115 175 105 155" stroke="#FDBCB4" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Right arm */}
      <path d="M170 195 Q190 210 200 230" stroke="#FDBCB4" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <path d="M145 230 Q140 260 130 280" stroke="#1a0030" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M175 230 Q180 260 190 280" stroke="#1a0030" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Shoes */}
      <ellipse cx="128" cy="284" rx="15" ry="8" fill="#0d0010" stroke="#1a0030" strokeWidth="2" />
      <ellipse cx="192" cy="284" rx="15" ry="8" fill="#e0408a" stroke="#1a0030" strokeWidth="2" />
      {/* Face smile */}
      <path d="M145 162 Q155 170 165 162" stroke="#1a0030" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="147" cy="155" r="3" fill="#1a0030" />
      <circle cx="163" cy="155" r="3" fill="#1a0030" />

      {/* Ticket in raised hand */}
      <rect x="90" y="130" width="40" height="24" rx="4" fill="#e0f809" stroke="#1a0030" strokeWidth="2" />
      <line x1="110" y1="130" x2="110" y2="154" stroke="#1a0030" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M95 138 h10 M95 144 h7" stroke="#1a0030" strokeWidth="1.5" strokeLinecap="round" />

      {/* Person 2 — Jumping (center) */}
      {/* Head */}
      <circle cx="265" cy="130" r="32" fill="#C68642" stroke="#1a0030" strokeWidth="3" />
      {/* Afro hair */}
      <path d="M233 125 Q236 92 265 88 Q294 92 297 125 Q295 108 265 104 Q235 108 233 125 Z" fill="#1a0030" />
      <circle cx="245" cy="106" r="14" fill="#1a0030" />
      <circle cx="285" cy="106" r="14" fill="#1a0030" />
      <circle cx="265" cy="98" r="14" fill="#1a0030" />
      {/* Body */}
      <path d="M248 162 Q235 178 232 210 L298 210 Q295 178 282 162 Z" fill="#e0408a" stroke="#1a0030" strokeWidth="2.5" />
      {/* Arms spread wide */}
      <path d="M248 170 Q220 160 200 165" stroke="#C68642" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M282 170 Q310 160 330 165" stroke="#C68642" strokeWidth="11" strokeLinecap="round" fill="none" />
      {/* Legs bent (jumping pose) */}
      <path d="M252 210 Q245 240 235 260" stroke="#1a0030" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M278 210 Q285 240 295 260" stroke="#1a0030" strokeWidth="11" strokeLinecap="round" fill="none" />
      {/* Shoes */}
      <ellipse cx="233" cy="265" rx="17" ry="9" fill="#e0f809" stroke="#1a0030" strokeWidth="2" />
      <ellipse cx="297" cy="265" rx="17" ry="9" fill="#e0f809" stroke="#1a0030" strokeWidth="2" />
      {/* Face */}
      <path d="M252 140 Q265 150 278 140" stroke="#1a0030" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="253" cy="131" r="4" fill="#1a0030" />
      <circle cx="277" cy="131" r="4" fill="#1a0030" />

      {/* Person 3 — Hands up (right) */}
      {/* Head */}
      <circle cx="375" cy="155" r="28" fill="#F1C27D" stroke="#1a0030" strokeWidth="3" />
      {/* Hair bun */}
      <path d="M350 148 Q352 128 375 125 Q398 128 400 148" fill="#8B4513" stroke="#1a0030" strokeWidth="2" />
      <circle cx="375" cy="120" r="15" fill="#8B4513" stroke="#1a0030" strokeWidth="2" />
      {/* Body */}
      <path d="M360 183 Q350 200 347 230 L403 230 Q400 200 390 183 Z" fill="#6b00b3" stroke="#1a0030" strokeWidth="2.5" />
      {/* Both arms raised */}
      <path d="M360 192 Q340 170 325 155" stroke="#F1C27D" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M390 192 Q410 170 425 155" stroke="#F1C27D" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <path d="M365 230 Q358 260 348 282" stroke="#1a0030" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M395 230 Q402 260 412 282" stroke="#1a0030" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Shoes */}
      <ellipse cx="346" cy="286" rx="15" ry="8" fill="#e0408a" stroke="#1a0030" strokeWidth="2" />
      <ellipse cx="414" cy="286" rx="15" ry="8" fill="#0d0010" stroke="#1a0030" strokeWidth="2" />
      {/* Face */}
      <path d="M364 162 Q375 170 386 162" stroke="#1a0030" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="366" cy="155" r="3" fill="#1a0030" />
      <circle cx="384" cy="155" r="3" fill="#1a0030" />

      {/* Music notes */}
      <path d="M470 90 Q475 82 480 90 L480 110 Q470 115 470 105 Z" fill="#e0f809" opacity="0.8" />
      <path d="M490 75 Q497 65 502 75 L502 98 Q490 103 490 93 Z" fill="#e0f809" opacity="0.7" />
      <circle cx="474" cy="109" r="7" fill="#e0f809" opacity="0.8" />
      <circle cx="494" cy="97" r="7" fill="#e0f809" opacity="0.7" />

      {/* Ground line */}
      <path d="M60 310 Q260 305 480 310" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />

      {/* Balloons */}
      <ellipse cx="185" cy="70" rx="18" ry="22" fill="#e0408a" stroke="#1a0030" strokeWidth="2.5" />
      <path d="M185 92 Q187 102 185 108" stroke="#1a0030" strokeWidth="1.5" />
      <ellipse cx="195" cy="68" rx="14" ry="18" fill="#6b00b3" stroke="#1a0030" strokeWidth="2" opacity="0.9" />
      <path d="M195 86 Q197 96 195 102" stroke="#1a0030" strokeWidth="1.5" />
    </svg>
  );
}
