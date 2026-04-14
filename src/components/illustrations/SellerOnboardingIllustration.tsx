export default function SellerOnboardingIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background */}
      <circle cx="180" cy="150" r="120" fill="rgba(107,0,179,0.1)" />

      {/* Coins / money raining */}
      <circle cx="80" cy="60" r="16" fill="#e0f809" stroke="#1a0030" strokeWidth="2.5" />
      <text x="73" y="66" fontSize="14" fill="#1a0030" fontWeight="bold">R$</text>
      <circle cx="290" cy="80" r="14" fill="#e0f809" stroke="#1a0030" strokeWidth="2" />
      <text x="284" y="86" fontSize="12" fill="#1a0030" fontWeight="bold">R$</text>
      <circle cx="60" cy="160" r="10" fill="#e0f809" stroke="#1a0030" strokeWidth="2" opacity="0.7" />
      <circle cx="310" cy="160" r="10" fill="#e0f809" stroke="#1a0030" strokeWidth="2" opacity="0.7" />

      {/* Phone device */}
      <rect x="150" y="55" width="80" height="140" rx="14" fill="#1a0030" stroke="rgba(224,248,9,0.3)" strokeWidth="2" />
      <rect x="156" y="68" width="68" height="110" rx="4" fill="rgba(107,0,179,0.3)" />
      <circle cx="190" cy="61" r="4" fill="rgba(255,255,255,0.3)" />
      <circle cx="190" cy="202" r="6" fill="rgba(255,255,255,0.2)" />
      {/* App UI on phone */}
      <rect x="162" y="74" width="56" height="8" rx="3" fill="rgba(224,248,9,0.5)" />
      <rect x="162" y="88" width="36" height="5" rx="2" fill="rgba(255,255,255,0.3)" />
      <rect x="162" y="98" width="50" height="18" rx="4" fill="rgba(224,64,138,0.4)" stroke="rgba(224,64,138,0.6)" strokeWidth="1" />
      <rect x="162" y="122" width="50" height="18" rx="4" fill="rgba(107,0,179,0.4)" stroke="rgba(107,0,179,0.6)" strokeWidth="1" />
      <rect x="162" y="146" width="40" height="14" rx="6" fill="#e0f809" />
      <rect x="162" y="166" width="56" height="4" rx="2" fill="rgba(255,255,255,0.15)" />

      {/* Person next to phone */}
      {/* Head */}
      <circle cx="115" cy="130" r="26" fill="#C68642" stroke="#1a0030" strokeWidth="2.5" />
      {/* Hair */}
      <path d="M92 122 Q94 104 115 101 Q136 104 138 122" fill="#1a0030" />
      {/* Body */}
      <path d="M100 156 Q90 172 87 200 L143 200 Q140 172 130 156 Z" fill="#e0408a" stroke="#1a0030" strokeWidth="2.5" />
      {/* Face — happy */}
      <path d="M106 138 Q115 146 124 138" stroke="#1a0030" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="107" cy="129" r="3.5" fill="#1a0030" />
      <circle cx="123" cy="129" r="3.5" fill="#1a0030" />
      {/* Hand pointing at phone */}
      <path d="M130 164 Q142 155 148 148" stroke="#C68642" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Other arm */}
      <path d="M100 164 Q82 172 75 182" stroke="#C68642" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <path d="M105 200 Q100 225 94 244" stroke="#1a0030" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M132 200 Q138 225 144 244" stroke="#1a0030" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="92" cy="248" rx="14" ry="7" fill="#0d0010" stroke="#1a0030" strokeWidth="2" />
      <ellipse cx="146" cy="248" rx="14" ry="7" fill="#6b00b3" stroke="#1a0030" strokeWidth="2" />

      {/* Diamond badge floating above */}
      <circle cx="260" cy="130" r="22" fill="rgba(107,0,179,0.2)" stroke="rgba(224,64,138,0.5)" strokeWidth="2" />
      <path d="M260 115 L265 124 L275 124 L267 130 L270 140 L260 134 L250 140 L253 130 L245 124 L255 124 Z"
        fill="#e0f809" stroke="#e0f809" strokeWidth="0.5" />

      {/* Arrow from person to phone */}
      <path d="M147 150 L150 148" stroke="#e0f809" strokeWidth="2" strokeLinecap="round" />

      {/* Upward trend arrow */}
      <path d="M270 220 L280 200 L290 210 L300 185" stroke="#e0f809" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M295 183 L300 185 L298 190" stroke="#e0f809" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Stars */}
      <path d="M40 100 L42 95 L44 100 L49 100 L45 103 L47 108 L42 105 L37 108 L39 103 L35 100 Z" fill="#e0f809" opacity="0.8" />
      <path d="M320 120 L322 115 L324 120 L329 120 L325 123 L327 128 L322 125 L317 128 L319 123 L315 120 Z" fill="#e0f809" opacity="0.6" />
    </svg>
  );
}
