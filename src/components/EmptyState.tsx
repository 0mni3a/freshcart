import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  text,
  href,
  cta,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <main className="mx-auto max-w-lg px-6 py-24 text-center">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-700">
        <Icon className="h-9 w-9" />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-stone-900">{title}</h1>
      <p className="mt-2 text-stone-500">{text}</p>
      <Link
        href={href}
        className="mt-8 inline-block rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
      >
        {cta}
      </Link>
    </main>
  );
}