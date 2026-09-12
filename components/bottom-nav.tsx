import Link from "next/link";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M3 10.8 12 3l9 7.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 9.5V21h13V9.5M9.5 21v-6h5v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.7-4.1 3.3-6.2 7.5-6.2s6.8 2.1 7.5 6.2" strokeLinecap="round" />
    </svg>
  );
}

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-20 grid h-[62px] grid-cols-3 border-t border-[#e7dfda] bg-white/95 text-[#423234] backdrop-blur">
      <Link className="flex items-center justify-center" href="/" aria-label="Accueil">
        <HomeIcon />
      </Link>
      <Link className="flex items-center justify-center" href="/add" aria-label="Ajouter un coup de cœur">
        <PlusIcon />
      </Link>
      <Link className="flex items-center justify-center" href="/profile" aria-label="Profil">
        <UserIcon />
      </Link>
    </nav>
  );
}
