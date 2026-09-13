import Link from "next/link";
import { redirect } from "next/navigation";
import { LesGirlsHorizontalLogo } from "@/components/les-girls-horizontal-logo";
import { BottomNav } from "@/components/bottom-nav";
import { RecommendationCard } from "@/components/recommendation-card";
import { isCategory } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import type { Recommendation } from "@/lib/types";
import { createGroup } from "./actions";

const FILTERS = [
  { label: "Tout", href: "/", key: undefined },
  { label: "Livres", href: "/?category=books", key: "books" },
  { label: "Films & séries", href: "/?category=watch", key: "watch" },
  { label: "Adresses", href: "/?category=places", key: "places" },
] as const;

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/auth");

  const { data: members, error: membershipError } = await sb
    .from("group_members")
    .select("group_id, groups(id,name,invite_code)")
    .eq("user_id", user.id)
    .limit(1);

  if (membershipError) throw new Error(membershipError.message);
  const membership = members?.[0] as unknown as
    | { group_id: string; groups: { id: string; name: string; invite_code: string } }
    | undefined;

  if (!membership) {
    return (
      <main className="shell flex min-h-dvh flex-col bg-[#faf8f6] px-7 py-10 text-black">
        <div className="text-center"><LesGirlsHorizontalLogo compact={false} /></div>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="serif mt-7 text-[34px] text-[#2e0002]">Crée votre petit cercle</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#7e7773]">
            Commence un groupe, puis partage son lien privé avec tes amies sur WhatsApp.
          </p>
          <form action={createGroup} className="mt-8 w-full space-y-5">
            <input name="name" className="field" required placeholder="Le nom du groupe" />
            <button className="btn border-[#2e0002] bg-[#2e0002] text-white">Créer notre groupe</button>
          </form>
        </div>
      </main>
    );
  }

  let query = sb
    .from("recommendations")
    .select("*")
    .eq("group_id", membership.group_id)
    .order("created_at", { ascending: false });

  if (category === "watch") query = query.in("category", ["films", "series"]);
  else if (isCategory(category)) query = query.eq("category", category);
  else query = query.limit(10);

  const { data: recommendations, error: recommendationsError } = await query;
  if (recommendationsError) throw new Error(recommendationsError.message);

  const userIds = [...new Set((recommendations || []).map((item) => item.user_id))];
  const { data: profiles, error: profilesError } = userIds.length
    ? await sb.from("profiles").select("id, first_name").in("id", userIds)
    : { data: [], error: null };

  if (profilesError) throw new Error(profilesError.message);
  const firstNames = new Map((profiles || []).map((profile) => [profile.id, profile.first_name]));
  const currentUserFirstName =
    typeof user.user_metadata.first_name === "string" && user.user_metadata.first_name.trim()
      ? user.user_metadata.first_name.trim()
      : "Une Girl";

  const data = (recommendations || []).map((item) => ({
    ...item,
    profiles: {
      first_name:
        firstNames.get(item.user_id) ||
        (item.user_id === user.id ? currentUserFirstName : "Une Girl"),
    },
  })) as Recommendation[];

  return (
    <main className="shell pb-0 text-black">
      <header className="bg-white px-6 pb-3 pt-5">
        <div className="flex items-center justify-between">
          <LesGirlsHorizontalLogo compact />
          <Link
            href="/profile"
            aria-label="Profil"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2e0002] text-sm font-semibold text-white"
          >
            {(user.user_metadata.first_name?.[0] || "G").toUpperCase()}
          </Link>
        </div>
      </header>

      <section className="bg-white px-6 pb-5 pt-6">
        <h1 className="serif text-[36px] leading-[1.05] text-[#2e0002]">Derniers coups de cœur</h1>
        <p className="mt-2 text-[15px] text-[#7e7773]">Ce que vos amies ont aimé cette semaine.</p>
        <nav className="mt-7 flex items-center gap-6 overflow-x-auto pb-1">
          {FILTERS.map((filter) => {
            const active = filter.key ? category === filter.key : !category;
            return (
              <Link
                key={filter.label}
                href={filter.href}
                className={`whitespace-nowrap border-b-[1.5px] pb-2 text-[13px] ${active ? "border-[#2e0002] font-semibold text-[#2e0002]" : "border-transparent text-[#938b87]"}`}
              >
                {filter.label}
              </Link>
            );
          })}
        </nav>
      </section>

      <section className="min-h-[62dvh] bg-white pb-2">
        {data.length ? (
          data.map((item) => <RecommendationCard key={item.id} item={item} currentUser={user.id} />)
        ) : (
          <div className="px-8 py-20 text-center">
            <h2 className="serif text-2xl text-[#2e0002]">Le carnet est encore vide</h2>
            <p className="mt-2 text-sm leading-6 text-[#7e7773]">
              Ajoute le premier coup de cœur dont tout le monde devrait se souvenir.
            </p>
            <Link href="/add" className="btn mt-6 border-[#2e0002] bg-[#2e0002] text-white">Ajouter un coup de cœur</Link>
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
