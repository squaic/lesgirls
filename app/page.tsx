import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { BottomNav } from "@/components/bottom-nav";
import { RecommendationCard } from "@/components/recommendation-card";
import { CATEGORIES, CATEGORY_LABELS, isCategory } from "@/lib/categories";
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
      <main className="shell flex min-h-dvh flex-col px-6 py-10">
        <Brand />
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-5 text-5xl">✿</div>
          <h1 className="serif text-3xl font-bold">Crée votre petit cocon</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#806f71]">
            Commence un groupe, puis partage son lien privé avec tes amies sur WhatsApp.
          </p>
          <form action={createGroup} className="mt-8 w-full space-y-3">
            <input name="name" className="field" required placeholder="Le nom du groupe" />
            <button className="btn btn-primary">Créer notre groupe</button>
          </form>
          <p className="mt-5 text-xs text-[#a18d89]">
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

  if (isCategory(category)) query = query.eq("category", category);

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
      : "Une Girlz";

  const data = (recommendations || []).map((item) => ({
    ...item,
    profiles: {
      first_name:
        firstNames.get(item.user_id) ||
        (item.user_id === user.id ? currentUserFirstName : "Une Girlz"),
    },
  })) as Recommendation[];

  return (
    <main className="shell">
      <header className="px-5 pb-4 pt-7">
        <div className="flex items-center justify-between">
          <div>
            <Brand />
            <p className="mt-0.5 text-xs font-semibold text-[#9b8587]">
              {membership.groups.name} · espace privé
            </p>
          </div>
          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fce7ec] font-bold text-[#e84b72]"
          >
            {user.user_metadata.first_name?.[0] || "G"}
          </Link>
        </div>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          <Link href="/" className={`chip ${!category ? "chip-active" : ""}`}>
            Tous
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/?category=${c}`}
              className={`chip ${category === c ? "chip-active" : ""}`}
            >
              {CATEGORY_LABELS[c]}
            </Link>
          ))}
        </div>
      </header>

      <section className="min-h-[65dvh] space-y-4 bg-[#fbf7f2] px-4 py-5">
        {data.length ? (
          data.map((item) => (
            <RecommendationCard key={item.id} item={item} currentUser={user.id} />
          ))
        ) : (
          <div className="px-7 py-20 text-center">
            <div className="text-5xl">♡</div>
            <h2 className="serif mt-5 text-2xl font-bold">Le carnet est encore vide</h2>
            <p className="mt-2 text-sm leading-6 text-[#806f71]">
              Ajoute le premier bon plan dont tout le monde devrait se souvenir.
            </p>
            <Link href="/add" className="btn btn-primary mt-6">
              Ajouter un bon plan
            </Link>
          </div>
        )}
      </section>
      <BottomNav />
    </main>
  );
}
