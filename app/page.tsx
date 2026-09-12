import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { BottomNav } from "@/components/bottom-nav";
import { RecommendationCard } from "@/components/recommendation-card";
import { CATEGORIES, CATEGORY_LABELS, isCategory } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import type { Recommendation } from "@/lib/types";
import { createGroup } from "./actions";

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: members } = await supabase.from("group_members").select("group_id, groups(id,name,invite_code)").eq("user_id", user.id).limit(1);
  const membership = members?.[0] as unknown as { group_id: string; groups: { id: string; name: string; invite_code: string } } | undefined;
  if (!membership) return (
    <main className="shell flex min-h-dvh flex-col px-7 py-10">
      <Brand small />
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-[10px] uppercase tracking-[.25em] text-[var(--muted)]">Votre espace privé</p>
        <h1 className="serif mt-4 text-[38px] font-normal leading-[1.08]">Créez votre<br />carnet entre amies</h1>
        <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--muted)]">Un lieu rien qu’à vous pour rassembler les coups de cœur qui méritent de rester.</p>
        <form action={createGroup} className="mt-9 w-full space-y-3"><input name="name" className="field" required placeholder="Nom du groupe" /><button className="btn btn-primary">Créer notre groupe</button></form>
        <p className="mt-5 text-xs text-[var(--muted)]">Vous avez reçu une invitation ? Ouvrez simplement son lien.</p>
      </div>
    </main>
  );

  let query = supabase.from("recommendations").select("*, profiles(first_name)").eq("group_id", membership.group_id).order("created_at", { ascending: false });
  if (isCategory(category)) query = query.eq("category", category);
  else query = query.limit(10);
  const { data } = await query;
  const firstName = user.user_metadata.first_name || "Girl";

  return <main className="shell">
    <header className="px-5 pb-0 pt-6">
      <div className="flex items-center justify-between">
        <div><Brand small /><p className="mt-1 text-[10px] uppercase tracking-[.13em] text-[var(--muted)]">{membership.groups.name}</p></div>
        <Link href="/profile" aria-label="Ouvrir le profil" className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-xs font-medium">{firstName[0].toUpperCase()}</Link>
      </div>
      <div className="mt-7 flex gap-5 overflow-x-auto border-b border-[var(--line)] [scrollbar-width:none]">
        <Link href="/" className={`filter ${!category ? "filter-active" : ""}`}>Tous</Link>
        {CATEGORIES.map((item) => <Link key={item} href={`/?category=${item}`} className={`filter ${category === item ? "filter-active" : ""}`}>{CATEGORY_LABELS[item]}</Link>)}
      </div>
    </header>
    <section className="min-h-[70dvh] px-5 pb-8 pt-8">
      <div className="mb-7 flex items-end justify-between"><div><p className="text-[9px] uppercase tracking-[.2em] text-[var(--muted)]">Le carnet</p><h1 className="serif mt-1 text-[29px] font-normal">{isCategory(category) ? CATEGORY_LABELS[category] : "Derniers coups de cœur"}</h1></div></div>
      {data?.length ? <div className="space-y-7">{(data as Recommendation[]).map((item) => <RecommendationCard key={item.id} item={item} currentUser={user.id} />)}</div> : (
        <div className="border-y border-[var(--line)] px-5 py-16 text-center"><span className="serif text-4xl">♡</span><h2 className="serif mt-4 text-2xl">Le carnet est encore vide</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Ajoutez le premier coup de cœur dont tout le monde devrait se souvenir.</p><Link href="/add" className="btn btn-primary mt-7">Ajouter un coup de cœur</Link></div>
      )}
    </section>
    <BottomNav />
  </main>;
}
