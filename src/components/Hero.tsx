import Image from "next/image";
import Link from "next/link";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";

const features = [
  { icon: Truck, text: "Fast delivery" },
  { icon: CreditCard, text: "Cash or online payment" },
  { icon: ShieldCheck, text: "Secure checkout" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-green-900 text-white">
      {/* الصورة */}
      <Image
        src="/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />

      {/* طبقة غامقة عشان الكلام يبان */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-green-950/80 via-green-900/70 to-green-950/85"
      />

      {/* المحتوى في النص */}
      <div className="relative mx-auto flex min-h-[560px] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <span className="mb-6 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur">
          Fresh · Fast · Reliable
        </span>

        <h1 className="text-4xl font-bold leading-[1.1] md:text-6xl">
          Everything you need,
          <br />
          <span className="text-green-300">delivered to your door</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-200">
          Browse our full range of products across every category and brand,
          and pay the way that suits you.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-green-900 shadow-lg transition hover:bg-green-50"
          >
            Shop now
          </Link>
          <Link
            href="/categories"
            className="rounded-full border border-white/60 px-8 py-3.5 text-sm font-semibold transition hover:bg-white/10"
          >
            Browse categories
          </Link>
        </div>

        <ul className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-stone-200">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-green-300" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* موجة في آخر القسم */}
      <svg
        aria-hidden
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-12 w-full md:h-20"
      >
        <path
          d="M0,40 C240,90 480,0 720,30 C960,60 1200,90 1440,40 L1440,80 L0,80 Z"
          fill="#faf8f4"
        />
      </svg>
    </section>
  );
}