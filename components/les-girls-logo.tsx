export function LesGirlsLogo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 text-[#423234]">
        <MartiniIcon className="h-8 w-8" />
        <span className="logo-serif text-[27px] leading-none">Les Girls</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-[#423234]" aria-label="Les Girls">
      <MartiniIcon className="h-[118px] w-[142px]" />
      <div className="logo-serif -mt-2 text-[58px] leading-[.9] tracking-[-.055em]">
        Les Girls
      </div>
    </div>
  );
}

function MartiniIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 160"
      className={className}
      role="img"
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="90" cy="29" rx="66" ry="15" fill="#f4e7d7" stroke="currentColor" strokeWidth="2" />
      <path d="M27 35C41 54 58 75 79 96C85 102 95 102 101 96C122 74 139 54 153 35C124 44 56 44 27 35Z" fill="currentColor" />
      <path d="M83 98H97L93 112H87L83 98Z" fill="currentColor" />
      <path d="M88 110H92V142H88V110Z" fill="currentColor" />
      <ellipse cx="90" cy="145" rx="31" ry="5" fill="currentColor" />
      <ellipse cx="75" cy="31" rx="9" ry="5" transform="rotate(-18 75 31)" fill="currentColor" />
      <path d="M69 33C73 30 78 29 82 30" stroke="#f4e7d7" strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="91" cy="23" rx="9" ry="5" transform="rotate(-35 91 23)" fill="currentColor" />
      <path d="M85 26C89 22 94 20 98 20" stroke="#f4e7d7" strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="107" cy="31" rx="9" ry="5" transform="rotate(18 107 31)" fill="currentColor" />
      <path d="M100 30C104 29 109 30 114 33" stroke="#f4e7d7" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M31 36C55 41 125 41 149 36" stroke="#fffaf4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
