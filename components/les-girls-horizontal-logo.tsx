import Link from "next/link";

export function LesGirlsHorizontalLogo({
  compact = false,
  linked = true,
}: {
  compact?: boolean;
  linked?: boolean;
}) {
  const logo = (
    <div
      className={`inline-flex items-center justify-center text-[#423234] ${compact ? "gap-2" : "gap-2.5"}`}
      aria-label="Les Girls"
    >
      <span className={`logo-serif ${compact ? "text-[25px] leading-none" : "text-[34px] leading-none"}`}>
        Les Girls
      </span>
      <svg
        viewBox="0 0 40 52"
        aria-hidden="true"
        className={compact ? "h-7 w-5 shrink-0" : "h-9 w-7 shrink-0"}
        fill="none"
      >
        <ellipse cx="20" cy="7" rx="14" ry="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 8.5 17 27c1.3 2.4 4.7 2.4 6 0L33 8.5" fill="currentColor" />
        <path d="M20 29v15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="20" cy="46" rx="7.5" ry="2" fill="currentColor" />
        <path d="M10.5 8c4 1.8 15 1.8 19 0" stroke="#f7f3ed" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </div>
  );

  if (!linked) return logo;

  return (
    <Link href="/" className="inline-flex" aria-label="Les Girls - accueil">
      {logo}
    </Link>
  );
}
