import Link from "next/link";

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <Link
      href="/"
      className={`font-medium uppercase tracking-[.18em] ${small ? "text-lg" : "text-[25px]"}`}
    >
      Les Girls
    </Link>
  );
}
