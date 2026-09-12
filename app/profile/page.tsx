import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { LesGirlsHorizontalLogo } from "@/components/les-girls-horizontal-logo";
import { SignOut } from "@/components/sign-out";
import { createClient } from "@/lib/supabase/server";

export default async function Profile() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/auth");

  const { data: membershipData } = await sb
    .from("group_members")
    .select("group_id, role, joined_at, groups(name,invite_code)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  const membership = membershipData as unknown as {
    group_id: string;
    role: string;
    joined_at: string;
    groups: { name: string; invite_code: string };
  } | null;

  let myShares = 0;
  let friends = 0;
  let totalFavorites = 0;
  let recent: { id: string; image_url: string | null }[] = [];

  if (membership) {
    const [{ count: shareCount }, { count: memberCount }, { count: totalCount }, { data: recentData }] = await Promise.all([
      sb.from("recommendations").select("id", { count: "exact", head: true }).eq("group_id", membership.group_id).eq("user_id", user.id),
      sb.from("group_members").select("user_id", { count: "exact", head: true }).eq("group_id", membership.group_id),
      sb.from("recommendations").select("id", { count: "exact", head: true }).eq("group_id", membership.group_id),
      sb.from("recommendations").select("id,image_url").eq("group_id", membership.group_id).eq("user_id", user.id).order("created_at", { ascending: false }).limit(6),
    ]);
    myShares = shareCount || 0;
    friends = Math.max((memberCount || 1) - 1, 0);
    totalFavorites = totalCount || 0;
    recent = recentData || [];
  }

  const firstName = user.user_metadata.first_name || "Une Girl";
  const joinedYear = membership?.joined_at
    ? new Date(membership.joined_at).getFullYear()
    : new Date(user.created_at).getFullYear();

  return (
    <main className="shell flex min-h-dvh flex-col bg-white text-[#423234]">
      <header className="border-b border-[#eee8e2] px-6 py-5">
        <div className="flex items-center justify-between">
          <LesGirlsHorizontalLogo compact />
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eee8e2] bg-[#f7f3ed] text-sm font-medium">
            {String(firstName).charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <section className="px-6 pb-8 pt-10 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f7f3ed] serif text-[42px]">
          {String(firstName).charAt(0).toUpperCase()}
        </div>
        <h1 className="serif mt-5 text-[31px]">{firstName}</h1>
        <p className="mt-1 text-[14px] text-[#a79c98]">Rejointe en {joinedYear}</p>

        <div className="mx-auto mt-9 grid max-w-[390px] grid-cols-3">
          <div className="border-r border-[#eee8e2] px-2">
            <p className="serif text-[27px]">{myShares}</p>
            <p className="mt-1 text-[12px] text-[#a79c98]">Partages</p>
          </div>
          <div className="border-r border-[#eee8e2] px-2">
            <p className="serif text-[27px]">{friends}</p>
            <p className="mt-1 text-[12px] text-[#a79c98]">Amies</p>
          </div>
          <div className="px-2">
            <p className="serif text-[27px]">{totalFavorites}</p>
            <p className="mt-1 text-[12px] text-[#a79c98]">Coups de cœur</p>
          </div>
        </div>
      </section>

      <section className="flex-1 border-t border-[#eee8e2] px-6 pb-10 pt-7">
        <h2 className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#938782]">Mes partages</h2>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {recent.map((item) => (
            <Link key={item.id} href={`/recommendations/${item.id}/edit`} className="relative aspect-square overflow-hidden rounded-[11px] bg-[#f7f3ed]">
              {item.image_url ? <Image src={item.image_url} alt="" fill className="object-cover" unoptimized /> : null}
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center"><SignOut /></div>
      </section>

      <BottomNav />
    </main>
  );
}
