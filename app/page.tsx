import Link from "next/link";
import { redirect } from "next/navigation";
import { LesGirlsHorizontalLogo } from "@/components/les-girls-horizontal-logo";
import { BottomNav } from "@/components/bottom-nav";
import { RecommendationCard } from "@/components/recommendation-card";
import { CATEGORY_LABELS, isCategory } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import type { Recommendation } from "@/lib/types";
import { createGroup } from "./actions";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

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

  if (!membership)
    return (
      <main className="shell flex min-h-dvh flex-col px-6 py-10 text-[#423234]">
        <div className="text-center">
          <LesGirlsHorizontalLogo compact={false} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="serif mt-8 text-3xl">Crée votre petit cercle</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#7f6f70]">
            Commence un groupe, puis partage son lien privé avec tes amies sur WhatsApp.
          </p>
          <form action={createGroup} className="mt-8 w-full space-y-3">
            <input name="name" className="field" required placeholder="Le nom du groupe" />
            <button className="btn btn-primary">Créer notre groupe</button>
          </form>
          <p className="mt-5 text-xs text-[#8b7e7f]">
            Tu as reçu une invitation ? Ouvre simplement son lien.
          </p>
        </div>
      </main>
    );

  let query = sb
    .from("recommendations")
    .select("*")
    .eq("group_id", membership.group_id)
    .order("created_at", { ascending: false });

  if (isCategory(category)) {
    query = query.eq("category", category);
  } else {
    query = query.limit(10);
  }

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
    <main className="shell pb-0 text-[#423234]">
      <header className="border-b border-[#eee7e2] bg-white px-5 pb-4 pt-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <LesGirlsHorizontalLogo compact />
            <p className="mt-1 text-[10px] uppercase tracking-[.11em] text-[#918385]">
              {membership.groups.name} · espace privé
            </p>
          </div>
          <Link
            href="/profile"
            aria-label="Profil"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9cdca] text-sm font-semibold text-[#423234]"
          >
            {user.user_metadata.first_name?.[0] || "G"}
          </Link>
        </div>
      </header>

      <section className="min-h-[65dvh] bg-[#faf7f2] px-4 pb-6 pt-5">
        <div className="mb-4 flex items-end justify-between">
          <h1 className="serif text-[28px] leading-none">
            {isCategory(category) ? CATEGORY_LABELS[category] : "Derniers coups de cœur"}
          </h1>
          {!isCategory(category) && <span className="text-[11px] text-[#918385]">10 derniers</span>}
        </div>

        <div className="space-y-5">
          {data.length ? (
            data.map((item) => (
              <RecommendationCard key={item.id} item={item} currentUser={user.id} />
            ))
          ) : (
            <div className="px-7 py-20 text-center">
              <h2 className="serif text-2xl">Le carnet est encore vide</h2>
              <p className="mt-2 text-sm leading-6 text-[#7f6f70]">
                Ajoute le premier coup de cœur dont tout le monde devrait se souvenir.
              </p>
              <Link href="/add" className="btn btn-primary mt-6">
                Ajouter un coup de cœur
              </Link>
            </div>
          )}
        </div>
      </section>
      <BottomNav />
    </main>
  );
}
