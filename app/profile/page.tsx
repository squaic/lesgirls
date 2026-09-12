import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { SignOut } from "@/components/sign-out";
import { BottomNav } from "@/components/bottom-nav";
import { ArrowLeftIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
export default async function Profile() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/auth");
  const { data } = await supabase.from("group_members").select("role, groups(name,invite_code)").eq("user_id", user.id).limit(1).single();
  const membership = data as unknown as { role: string; groups: { name: string; invite_code: string } } | null;
  const invite = membership ? `${process.env.NEXT_PUBLIC_SITE_URL || ""}/join/${membership.groups.invite_code}` : "";
  const firstName = user.user_metadata.first_name || "Une Girl";
  return <main className="shell min-h-dvh"><div className="min-h-[calc(100dvh-62px)] px-4 py-4"><header className="flex items-center justify-between"><Link href="/" className="icon-button" aria-label="Retour"><ArrowLeftIcon /></Link><Brand small /><span className="w-10" /></header><section className="pt-8 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--cream)] serif text-2xl">{firstName[0].toUpperCase()}</div><h1 className="serif mt-5 text-[30px] font-normal">{firstName}</h1><p className="mt-1 text-xs text-[var(--muted)]">{user.email}</p></section>{membership && <section className="mt-8 border-y border-[var(--line)] py-5"><p className="text-[9px] uppercase tracking-[.2em] text-[var(--muted)]">Votre groupe</p><h2 className="serif mt-2 text-[26px]">{membership.groups.name}</h2><p className="mt-1 text-xs text-[var(--muted)]">{membership.role === "owner" ? "Propriétaire" : "Membre"}</p><div className="mt-5 bg-[var(--cream)] p-4"><p className="mb-2 text-[10px] uppercase tracking-[.12em]">Invitation privée</p><p className="break-all text-xs leading-5 text-[var(--muted)]">{invite || `/join/${membership.groups.invite_code}`}</p></div></section>}<div className="mt-9 text-center"><SignOut /></div></div><BottomNav /></main>;
}
