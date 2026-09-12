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
    <>
      <div className="relative aspect-[16/9] overflow-hidden bg-[#f5f0eb]">
        {item.image_url ? (
          <Image src={item.image_url} alt="" fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-[#b7a9a6]">
            {CATEGORY_ICONS[item.category]}
          </div>
        )}
      </div>

      <div className="px-3.5 pb-3 pt-3 text-[#423234]">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[.08em] text-[#8b7e7f]">
            {item.source_name || CATEGORY_LABELS[item.category]}
          </span>
          {item.url && <span className="text-[13px] text-[#8b7e7f]">↗</span>}
        </div>

        <h2 className="line-clamp-2 text-[17px] font-semibold leading-[1.22] tracking-[-0.02em]">
          {item.title}
        </h2>

        {item.comment && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-[1.4] text-[#756668]">
            {item.comment}
          </p>
        )}
      </div>
    </>
  );

  return (
    <article className="card">
      {item.url ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      ) : (
        <div>{content}</div>
      )}

      <footer className="flex items-center justify-between border-t border-[#eee7e2] px-3.5 py-2.5 text-[11px] text-[#8b7e7f]">
        <span>
          {item.profiles?.first_name || "Une Girl"} · {date}
        </span>
        {currentUser === item.user_id && (
          <Link href={`/recommendations/${item.id}/edit`} className="font-semibold text-[#423234]">
            Modifier
          </Link>
        )}
      </footer>
    </article>
  );
}
