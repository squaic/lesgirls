export function LesGirlsLogo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 text-[#423234]">
        <span className="logo-serif text-[27px] leading-none">Les Girls</span>
        <MartiniIcon className="h-8 w-7" />
      </div>
    );
  }

  return (
    <div className="inline-flex items-end justify-center gap-3 text-[#423234]" aria-label="Les Girls">
      <span className="logo-serif text-[58px] leading-[0.9] tracking-[-0.06em]">Les Girls</span>
      <MartiniIcon className="h-[66px] w-[51px]" />
    </div>
  );
}

function MartiniIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 92" className={className} aria-hidden="true" fill="none">
      <ellipse cx="36" cy="12" rx="27" ry="8" stroke="currentColor" strokeWidth="2.3" />
      <path d="M11 13.5L31 49c2.2 4 7.8 4 10 0l20-35.5" fill="currentColor" />
      <path d="M36 52v27" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="36" cy="82" rx="14" ry="3.4" fill="currentColor" />
      <path d="M17 12.5c8 3.2 30 3.2 38 0" stroke="#f4e5d5" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="31" cy="14" rx="3.2" ry="1.9" fill="#f4e5d5" transform="rotate(-15 31 14)" />
      <ellipse cx="37" cy="12.5" rx="3.2" ry="1.9" fill="#f4e5d5" transform="rotate(18 37 12.5)" />
      <ellipse cx="42" cy="15" rx="3.2" ry="1.9" fill="#f4e5d5" transform="rotate(7 42 15)" />
    </svg>
  );
}
