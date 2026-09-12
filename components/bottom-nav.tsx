"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, PlusIcon, UserIcon } from "./icons";

const items = [
  { href: "/", label: "Accueil", Icon: HomeIcon, match: (path: string) => path === "/" },
  { href: "/add", label: "Ajouter un coup de cœur", Icon: PlusIcon, match: (path: string) => path.startsWith("/add") },
  { href: "/profile", label: "Profil", Icon: UserIcon, match: (path: string) => path.startsWith("/profile") },
];
export function BottomNav() {
  const pathname = usePathname();
  return <nav className="bottom-nav" aria-label="Navigation principale">{items.map(({href,label,Icon,match}) => {
    const active = match(pathname);
    return <Link key={href} href={href} aria-label={label} aria-current={active ? "page" : undefined} className={`nav-icon ${active ? "nav-icon-active" : ""}`}><Icon /></Link>;
  })}</nav>;
}
