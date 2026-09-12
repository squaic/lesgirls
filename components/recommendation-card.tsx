import Image from "next/image";
import Link from "next/link";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/categories";
import type { Recommendation } from "@/lib/types";

export function RecommendationCard({
  item,
  currentUser,
}: {
  item: Recommendation;
  currentUser?: string;
}) {
  const date = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(new Date(item.created_at));

  const content = (
    <div className="grid grid-cols-[112px_1fr]">
      <div className="relative min-h-[136px] bg-[#f1efe9]">
        {item.image_url ? (
          <Image src={item.image_url} alt="" fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-[#aaa39a]">
            {CATEGORY_ICONS[item.category]}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[.14em] text-[#77716a]">
            {CATEGORY_LABELS[item.category]}
          </span>
          {item.url && <span className="text-xs text-[#77716a]">↗</span>}
        </div>

        <h2 className="text-[18px] font-medium leading-[1.2] tracking-[-.02em]">{item.title}</h2>

        {item.comment && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-[#615d57]">“{item.comment}”</p>
        )}

        <div className="mt-auto pt-4 text-[11px] text-[#8a857e]">
          {item.profiles?.first_name || "Une Girl"} · {date}
        </div>
      </div>
    </div>
  );

  return (
    <article className="card">
      {item.url ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      ) : (
        content
      )}

      {currentUser === item.user_id && (
        <footer className="border-t border-[#e6e2db] px-4 py-2 text-right text-[11px] uppercase tracking-[.08em]">
          <Link href={`/recommendations/${item.id}/edit`} className="font-medium">
            Modifier
          </Link>
        </footer>
      )}
    </article>
  );
}
