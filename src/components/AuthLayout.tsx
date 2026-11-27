import Image from "next/image";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { ReactNode } from "react";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-200/60 lg:grid-cols-2">
        {/* الجانب الترحيبي (بيظهر في الشاشات الكبيرة بس) */}
        <div className="relative isolate hidden flex-col justify-between p-10 text-white lg:flex">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            sizes="50vw"
            className="-z-20 object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-green-950/85 via-green-900/75 to-green-950/90"
          />

          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <ShoppingBasket className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold">FreshCart</span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold leading-tight">
              Everything you need,
              <br />
              <span className="text-green-300">in one place</span>
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-200">
              Shop products across every category and brand, and pay with cash
              or online.
            </p>
          </div>
        </div>

        {/* الفورم */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
          <p className="mt-1 text-sm text-stone-500">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer && (
            <div className="mt-6 text-center text-sm text-stone-500">
              {footer}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}