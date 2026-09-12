import Link from "next/link";
import type { ReactNode } from "react";

const iconClass = "h-[27px] w-[27px]";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 10.8 12 3l9 7.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 9.5V21h13V9.5M9.2 21v-6.2h5.6V21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M3.5 5.2c0-1.5 1.2-2.7 2.7-2.7H11v17H6.6a3.1 3.1 0 0 0-3.1 2.5V5.2Z" strokeLinejoin="round" />
      <path d="M20.5 5.2c0-1.5-1.2-2.7-2.7-2.7H13v17h4.4a3.1 3.1 0 0 1 3.1 2.5V5.2Z" strokeLinejoin="round" />
    </svg>
  );
}

function FilmIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <rect x="2.7" y="4" width="18.6" height="16" rx="1.4" />
      <path d="M7 4v16M17 4v16M2.7 8.2H7M17 8.2h4.3M2.7 15.8H7M17 15.8h4.3" />
    </svg>
  );
}

function SeriesIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <rect x="2.8" y="6.2" width="18.4" height="13.3" rx="2" />
      <path d="m8.5 3 3.5 3.2L15.5 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m10 10 5 3-5 3v-6Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PlaceIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M12 22s7-6.4 7-12A7 7 0 1 0 5 10c0 5.6 7 12 7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function NavItem({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="flex h-full items-center justify-center text-[#423234] transition-transform active:scale-90"
    >
      {children}
    </Link>
  );
}

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-[#e8e0dc] bg-white/98 px-2 pb-[max(7px,env(safe-area-inset-bottom))] pt-1 backdrop-blur">
      <div className="relative grid h-[62px] grid-cols-6 items-center">
        <NavItem href="/" label="Accueil"><HomeIcon /></NavItem>
        <NavItem href="/?category=books" label="Livres"><BookIcon /></NavItem>
        <NavItem href="/?category=films" label="Films"><FilmIcon /></NavItem>
        <div aria-hidden="true" />
        <NavItem href="/?category=series" label="Séries"><SeriesIcon /></NavItem>
        <NavItem href="/?category=places" label="Adresses"><PlaceIcon /></NavItem>

        <Link
          href="/add"
          aria-label="Ajouter un coup de cœur"
          title="Ajouter"
          className="absolute left-1/2 top-1/2 flex h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[2px] border-[#423234] bg-white text-[#423234] shadow-[0_3px_12px_rgba(66,50,52,.08)] transition-transform active:scale-95"
        >
          <span className="-mt-[3px] text-[36px] font-light leading-none">+</span>
        </Link>
      </div>
    </nav>
  );
}
