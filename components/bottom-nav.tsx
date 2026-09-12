import Link from "next/link";
import type { ReactNode } from "react";

const iconClass = "h-[25px] w-[25px]";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M3.5 10.5 12 3.5l8.5 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 9.7V21h13V9.7M9.5 21v-6h5v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" strokeLinejoin="round" />
      <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z" strokeLinejoin="round" />
    </svg>
  );
}

function FilmIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="1.8" />
      <path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4" />
    </svg>
  );
}

function SeriesIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="6" width="18" height="14" rx="2.3" />
      <path d="m8 3 4 3 4-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlaceIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 22s7-6.2 7-12A7 7 0 1 0 5 10c0 5.8 7 12 7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function NavItem({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link href={href} aria-label={label} className="flex h-full items-center justify-center text-[#9f9591] transition-transform active:scale-90">
      {children}
    </Link>
  );
}

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-[#eee8e2] bg-white px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5">
      <div className="grid h-[62px] grid-cols-6 items-center">
        <NavItem href="/" label="Accueil"><HomeIcon /></NavItem>
        <NavItem href="/?category=books" label="Livres"><BookIcon /></NavItem>
        <Link href="/add" aria-label="Ajouter" className="mx-auto flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#423234] text-white shadow-[0_3px_10px_rgba(66,50,52,.12)]">
          <span className="-mt-[3px] text-[34px] font-light leading-none">+</span>
        </Link>
        <NavItem href="/?category=films" label="Films"><FilmIcon /></NavItem>
        <NavItem href="/?category=series" label="Séries"><SeriesIcon /></NavItem>
        <NavItem href="/?category=places" label="Adresses"><PlaceIcon /></NavItem>
      </div>
    </nav>
  );
}
