import Link from "next/link";
import { redirect } from "next/navigation";
import { MartiniLogo } from "@/components/brand";
import { createClient } from "@/lib/supabase/server";
import { joinGroup } from "./action";
export default async function Join({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params; const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect(`/auth?next=/join/${encodeURIComponent(code)}`);
  const { data: groups } = await supabase.rpc("invited_group", { code }); const group = groups?.[0];
  if (!group) return <main className="shell flex flex-col items-center justify-center px-7 text-center"><MartiniLogo /><h1 className="serif mt-10 text-3xl">Invitation introuvable</h1><p className="mt-3 text-sm text-[var(--muted)]">Ce lien a peut-être expiré ou contient une erreur.</p><Link href="/" className="btn btn-primary mt-8">Retour à l’accueil</Link></main>;
  return <main className="shell flex flex-col items-center justify-center px-7 text-center"><MartiniLogo /><p className="mt-10 text-[9px] uppercase tracking-[.22em] text-[var(--muted)]">Invitation privée</p><h1 className="serif mt-3 text-[34px]">Rejoignez {group.name}</h1><p className="mt-4 max-w-xs text-sm leading-6 text-[var(--muted)]">Retrouvez tous les coups de cœur partagés par vos amies dans un carnet rien qu’à vous.</p><form action={joinGroup.bind(null, code)} className="mt-8 w-full"><button className="btn btn-primary">Rejoindre le groupe</button></form></main>;
}
