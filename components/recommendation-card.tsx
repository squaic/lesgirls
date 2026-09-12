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
      <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[#f5f0eb]">
        {item.image_url ? (
          <Image src={item.image_url} alt="" fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-[#b7a9a6]">
            {CATEGORY_ICONS[item.category]}
          </div>
        )}
      </div>

      <div className="pb-5 pt-4 text-[#423234]">
        <span className="text-[11px] font-medium uppercase tracking-[.18em] text-[#9f9591]">
          {CATEGORY_LABELS[item.category]}
        </span>

        <h2 className="serif mt-2 line-clamp-2 text-[27px] leading-[1.08]">
          {item.title}
        </h2>

        {item.comment && (
          <p className="mt-3 line-clamp-3 text-[15px] leading-6 text-[#756a67]">
            {item.comment}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 text-[13px] text-[#9f9591]">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f7f3ed] font-medium text-[#6f625f]">
              {(item.profiles?.first_name || "G").charAt(0).toUpperCase()}
            </span>
            <span className="truncate">Par {item.profiles?.first_name || "Une Girl"} · {date}</span>
          </div>
          {currentUser === item.user_id && (
            <Link href={`/recommendations/${item.id}/edit`} className="shrink-0 text-[#6f625f] underline underline-offset-4">
              Modifier
            </Link>
          )}
        </div>
      </div>
    </>
  );

  return (
    <article className="card border-b border-[#eee8e2] px-5 pt-5 last:border-b-0">
      {item.url ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      ) : (
        <div>{content}</div>
      )}
    </article>
  );
}
