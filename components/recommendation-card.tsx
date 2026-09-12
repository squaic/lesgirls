import Image from "next/image";
import Link from "next/link";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/categories";
import type { Recommendation } from "@/lib/types";
import { ExternalLinkIcon } from "./icons";

export function RecommendationCard({ item, currentUser }: { item: Recommendation; currentUser?: string }) {
  const date = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(item.created_at));
  const content = <>
    <div className="relative aspect-[16/9] overflow-hidden rounded-[12px] bg-[#f4f1ec]">
      {item.image_url ? <Image src={item.image_url} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.015]" unoptimized /> : (
        <div className="flex h-full flex-col items-center justify-center text-[#8c7f79]">
          <span className="serif text-[44px] font-light">{CATEGORY_ICONS[item.category]}</span>
          <span className="mt-2 text-[9px] uppercase tracking-[.22em]">{CATEGORY_LABELS[item.category]}</span>
        </div>
      )}
    </div>
    <div className="pb-4 pt-4">
      <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[.15em] text-[var(--muted)]">
        <span>{CATEGORY_LABELS[item.category]}{item.source_name || item.source_domain ? ` · ${item.source_name || item.source_domain}` : ""}</span>
        {item.url && <ExternalLinkIcon width={15} height={15} />}
      </div>
      <h2 className="clamp-title serif mt-2 text-[24px] font-medium leading-[1.15] tracking-[-.02em]">{item.title}</h2>
      {item.comment && <p className="mt-3 border-l border-[#cfc4bd] pl-3 text-[13px] italic leading-5 text-[#6f6263]">« {item.comment} »</p>}
    </div>
  </>;
  return <article className="card border-b border-[var(--line)] pb-1">
    {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block">{content}</a> : <div>{content}</div>}
    <footer className="flex items-center justify-between pb-4 text-[11px] text-[var(--muted)]">
      <span>Par <strong className="font-medium text-[var(--ink)]">{item.profiles?.first_name || "Une Girl"}</strong> · {date}</span>
      {currentUser === item.user_id && <Link href={`/recommendations/${item.id}/edit`} className="border-b border-[#b9afaa] pb-0.5 text-[10px] uppercase tracking-[.1em] text-[var(--ink)]">Modifier</Link>}
    </footer>
  </article>;
}
