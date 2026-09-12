import { LesGirlsHorizontalLogo } from "@/components/les-girls-horizontal-logo";
import { AuthForm } from "./auth-form";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="shell flex min-h-dvh flex-col bg-[#f7f3ed] px-8 py-10 text-[#423234]">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center pb-10 text-center">
          <div className="flex h-[118px] w-[118px] items-center justify-center bg-[#f2e7d8]">
            <LesGirlsHorizontalLogo linked={false} compact />
          </div>
          <p className="mt-6 max-w-[290px] text-[16px] leading-6 text-[#a79c98]">
            Le carnet d&apos;adresses, de livres et de films de vos amies.
          </p>
        </div>

        <div className="pb-6">
          <AuthForm next={next} />
        </div>
      </div>
    </main>
  );
}
