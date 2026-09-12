"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, FilmIcon, HomeIcon, MapPinIcon, PlusIcon, SeriesIcon } from "./icons";

const items = [
  { href: "/", label: "Accueil", Icon: HomeIcon, category: undefined },
  { href: "/?category=books", label: "Livres", Icon: BookIcon, category: "books" },
  { href: "/?category=films", label: "Films", Icon: FilmIcon, category: "films" },
  { href: "/add", label: "Ajouter un coup de cœur", Icon: PlusIcon, category: undefined, add: true },
  { href: "/?category=series", label: "Séries", Icon: SeriesIcon, category: "series" },
  { href: "/?category=places", label: "Adresses", Icon: MapPinIcon, category: "places" },
];
export function BottomNav({ currentCategory }: { currentCategory?: string }) {
  const pathname = usePathname();
  return <nav className="bottom-nav" aria-label="Navigation principale">{items.map(({href,label,Icon,category,add}) => {
    const active = add ? pathname.startsWith("/add") : pathname === "/" && currentCategory === category;
    return <Link key={href} href={href} aria-label={label} aria-current={active ? "page" : undefined} className={`nav-icon ${add ? "nav-icon-add" : ""} ${active ? "nav-icon-active" : ""}`}><Icon /></Link>;
  })}</nav>;
}
