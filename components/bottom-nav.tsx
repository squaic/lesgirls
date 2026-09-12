import Link from "next/link";

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-20 grid grid-cols-3 border-t border-[#d9d5ce] bg-white">
      <Link
        className="flex h-16 items-center justify-center text-[11px] font-medium uppercase tracking-[.08em]"
        href="/"
      >
        Accueil
      </Link>
      <Link
        href="/add"
        className="flex h-16 items-center justify-center border-x border-[#d9d5ce] text-[11px] font-medium uppercase tracking-[.08em]"
        aria-label="Ajouter"
      >
        Ajouter
      </Link>
      <Link
        className="flex h-16 items-center justify-center text-[11px] font-medium uppercase tracking-[.08em]"
        href="/profile"
      >
        Profil
      </Link>
    </nav>
  );
}
