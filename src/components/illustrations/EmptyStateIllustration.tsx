export default function EmptyStateIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background glow */}
      <circle cx="160" cy="140" r="100" fill="rgba(107,0,179,0.08)" />

      {/* Giant search magnifier */}
      <circle cx="145" cy="125" r="65" stroke="rgba(255,255,255,0.12)" strokeWidth="12" />
      <path d="M195 165 L230 200" stroke="rgba(255,255,255,0.15)" strokeWidth="14" strokeLinecap="round" />

      {/* Person looking through magnifier */}
      {/* Body */}
      <path d="M125 155 Q115 170 110 195 L160 195 Q158 170 148 155 Z" fill="#6b00b3" stroke="#1a0030" strokeWidth="2.5" />
      {/* Head */}
      <circle cx="136" cy="130" r="24" fill="#FDBCB4" stroke="#1a0030" strokeWidth="2.5" />
      {/* Hair */}
      <path d="M114 122 Q116 105 136 102 Q156 105 158 122" fill="#1a0030" />
      {/* Face — confused expression */}
      <path d="M127 138 Q136 134 145 138" stroke="#1a0030" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="128" cy="130" r="3" fill="#1a0030" />
      <circle cx="144" cy="130" r="3" fill="#1a0030" />
      {/* ? above head */}
      <text x="148" y="112" fontSize="18" fill="#e0f809" fontWeight="bold" fontFamily="Syne, sans-serif">?</text>
      {/* Arms */}
      <path d="M125 163 Q105 170 95 180" stroke="#FDBCB4" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M148 163 Q165 175 172 185" stroke="#FDBCB4" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <path d="M120 195 Q115 220 108 238" stroke="#1a0030" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M150 195 Q155 220 162 238" stroke="#1a0030" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="106" cy="242" rx="13" ry="7" fill="#e0408a" stroke="#1a0030" strokeWidth="2" />
      <ellipse cx="164" cy="242" rx="13" ry="7" fill="#0d0010" stroke="#1a0030" strokeWidth="2" />

      {/* Empty ticket */}
      <rect x="195" y="95" width="60" height="38" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="5 3" />
      <path d="M202 108 h46 M202 116 h30 M202 124 h38" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />

      {/* Floating dots */}
      <circle cx="60" cy="80" r="5" fill="#e0408a" opacity="0.5" />
      <circle cx="270" cy="90" r="4" fill="#e0f809" opacity="0.6" />
      <circle cx="50" cy="200" r="4" fill="#6b00b3" opacity="0.5" />
      <circle cx="280" cy="200" r="5" fill="#e0408a" opacity="0.4" />
    </svg>
  );
}
