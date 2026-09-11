import Image from "next/image";
import Link from "next/link";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/categories";
import type { Recommendation } from "@/lib/types";
export function RecommendationCard({item,currentUser}:{item:Recommendation;currentUser?:string}){
 const date=new Intl.DateTimeFormat("fr-FR",{day:"numeric",month:"short"}).format(new Date(item.created_at));
 return <article className="card">
  <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
   <div className="relative aspect-[16/9] bg-[#f1e9e3]">{item.image_url?<Image src={item.image_url} alt="" fill className="object-cover" unoptimized/>:<div className="flex h-full items-center justify-center text-5xl text-[#d4c2b9]">{CATEGORY_ICONS[item.category]}</div>}<span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-sm">{CATEGORY_ICONS[item.category]} {CATEGORY_LABELS[item.category]}</span></div>
   <div className="p-4"><div className="mb-2 flex items-center justify-between gap-2"><span className="text-[11px] font-bold uppercase tracking-[.12em] text-[#a18d89]">{item.source_name||item.source_domain}</span><span className="text-xs text-[#a18d89]">↗</span></div><h2 className="serif text-[23px] font-bold leading-[1.12]">{item.title}</h2>{item.comment&&<p className="mt-3 rounded-xl bg-[#fdf2f4] px-3 py-2.5 text-sm leading-relaxed">“{item.comment}”</p>}</div>
  </a>
  <footer className="flex items-center justify-between border-t border-[#f1e8e4] px-4 py-3 text-xs text-[#8b7a7c]"><span>Par <b className="text-[#4d3d3f]">{item.profiles?.first_name||"Une Girlz"}</b> · {date}</span>{currentUser===item.user_id&&<Link href={`/recommendations/${item.id}/edit`} className="font-bold">Modifier</Link>}</footer>
 </article>
}
