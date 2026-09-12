import Link from "next/link";

export function Brand({ small = false }: { small?: boolean }) {
  return <Link href="/" className={`brand serif ${small ? "text-[25px]" : "text-[34px]"}`}>Les Girls</Link>;
}

export function MartiniLogo() {
  return (
    <div className="logo-lockup" aria-label="Les Girls">
      <svg className="martini" viewBox="0 0 150 135" role="img" aria-label="Verre espresso martini">
        <path d="M24 28h102L76 80Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M36 41h78L76 78Z" fill="currentColor" opacity=".92" />
        <path d="M76 80v37M55 119h42" fill="none" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="59" cy="44" rx="9" ry="5" transform="rotate(-22 59 44)" fill="#f8f5ef" />
        <path d="M53 46c4-5 8-6 13-5" stroke="currentColor" strokeWidth="1.3" fill="none" />
        <ellipse cx="76" cy="39" rx="9" ry="5" transform="rotate(8 76 39)" fill="#f8f5ef" />
        <path d="M69 38c5-2 10-1 14 2" stroke="currentColor" strokeWidth="1.3" fill="none" />
        <ellipse cx="92" cy="45" rx="9" ry="5" transform="rotate(27 92 45)" fill="#f8f5ef" />
        <path d="M86 42c5 0 9 2 12 6" stroke="currentColor" strokeWidth="1.3" fill="none" />
      </svg>
      <span className="serif text-[43px] leading-none tracking-[-.045em]">Les Girls</span>
      <span className="mt-3 text-[10px] uppercase tracking-[.28em] text-[var(--muted)]">Entre nous</span>
    </div>
  );
}
