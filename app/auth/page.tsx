import { MartiniLogo } from "@/components/brand";
import { AuthForm } from "./auth-form";
export default async function AuthPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <main className="shell flex min-h-dvh flex-col px-7 py-9"><div className="flex flex-1 flex-col justify-center"><div className="mb-10 text-center"><MartiniLogo /><h1 className="serif mt-8 text-[29px] font-normal leading-tight">Nos coups de cœur,<br />précieusement gardés.</h1><p className="mx-auto mt-4 max-w-xs text-[13px] leading-6 text-[var(--muted)]">Films, séries, livres et adresses à retrouver dans un carnet privé, entre amies.</p></div><AuthForm next={next} /></div><p className="mt-8 text-center text-[9px] uppercase tracking-[.18em] text-[var(--muted)]">Privé · Sans notes · Sans likes</p></main>;
}
