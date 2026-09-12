import { LesGirlsLogo } from "@/components/les-girls-logo";
import { AuthForm } from "./auth-form";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="shell flex min-h-dvh flex-col bg-white px-6 py-10 text-[#423234]">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-10 text-center">
          <LesGirlsLogo />
          <h1 className="serif mt-8 text-[30px] leading-tight">
            Nos coups de cœur,
            <br />
            rien qu’entre nous.
          </h1>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[#7f6f70]">
            Films, séries, livres et bonnes adresses : garde précieusement tout ce que tes amies te recommandent.
          </p>
        </div>
        <AuthForm next={next} />
      </div>
      <p className="mt-8 text-center text-[11px] tracking-[.04em] text-[#8d7f7d]">
        Un espace privé, sans likes ni notes.
      </p>
    </main>
  );
}
