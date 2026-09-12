import Link from "next/link";
import type { ReactNode } from "react";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3.5 10.5 12 3.5l8.5 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 9.5V21h13V9.5M9.5 21v-6h5v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" strokeLinejoin="round" />
      <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z" strokeLinejoin="round" />
    </svg>
  );
}

function FilmIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4" />
    </svg>
  );
}

function SeriesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="6" width="18" height="14" rx="2.5" />
      <path d="m8 3 4 3 4-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m10 10 5 3-5 3v-6Z" strokeLinejoin="round" />
    </svg>
  );
}

function PlaceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 22s7-6.2 7-12A7 7 0 1 0 5 10c0 5.8 7 12 7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function NavItem({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link href={href} aria-label={label} className="flex min-w-0 flex-col items-center justify-center gap-0.5 text-[#423234]">
      {children}
      <span className="max-w-full truncate text-[8px] font-medium leading-none">{label}</span>
    </Link>
  );
}

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-[#e7dfda] bg-white/95 px-2 pb-[max(6px,env(safe-area-inset-bottom))] pt-1.5 text-[#423234] backdrop-blur">
      <div className="relative grid h-[58px] grid-cols-6 items-center">
        <NavItem href="/" label="Accueil"><HomeIcon /></NavItem>
        <NavItem href="/?category=books" label="Livres"><BookIcon /></NavItem>
        <NavItem href="/?category=films" label="Films"><FilmIcon /></NavItem>
        <div aria-hidden="true" />
        <NavItem href="/?category=series" label="Séries"><SeriesIcon /></NavItem>
        <NavItem href="/?category=places" label="Adresses"><PlaceIcon /></NavItem>

        <Link
          href="/add"
          aria-label="Ajouter un coup de cœur"
          className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#423234] bg-white text-[30px] font-light leading-none shadow-[0_2px_10px_rgba(66,50,52,.10)]"
        >
          <span className="-mt-0.5">+</span>
        </Link>
      </div>
    </nav>
  );
}
