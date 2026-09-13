import Link from "next/link";

export function LesGirlsHorizontalLogo({ compact = false, linked = true }: { compact?: boolean; linked?: boolean }) {
  const logo = <span className={`logo-serif text-black ${compact ? "text-[25px]" : "text-[34px]"}`}>Les Girls</span>;
  if (!linked) return logo;
  return <Link href="/" className="inline-flex" aria-label="Les Girls - accueil">{logo}</Link>;
}
