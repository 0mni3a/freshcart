import Link from "next/link";

const features = [
  { icon: "🚚", text: "Fast delivery" },
  { icon: "💳", text: "Cash or online payment" },
  { icon: "🔒", text: "Secure checkout" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-green-900 via-green-700 to-green-500 text-white">
      {/* نقط خفيفة في الخلفية */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* دواير ضوء ناعمة */}
      <div
        aria-hidden
        className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-green-300/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-lime-300/20 blur-3xl"
      />

      {/* أيقونات تسوّق زخرفية */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden select-none text-5xl opacity-20 md:block"
      >
        <span className="absolute left-[8%] top-[18%] -rotate-12">🛒</span>
        <span className="absolute right-[10%] top-[15%] rotate-12">🥦</span>
        <span className="absolute bottom-[22%] left-[14%] rotate-6">🍎</span>
        <span className="absolute bottom-[25%] right-[14%] -rotate-6">🛍️</span>
      </div>

      {/* المحتوى في النص */}
      <div className="relative mx-auto flex min-h-[520px] max-w-4xl flex-col items-center justify-center px-6 py-20 text-center">
        <span className="mb-5 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm backdrop-blur">
          Welcome to FreshCart
        </span>

        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
          Fresh picks, delivered
          <br />
          <span className="text-lime-200">right to your door</span>
        </h1>

        <p className="mt-5 max-w-xl text-lg text-green-50">
          Browse thousands of products across all categories and brands, and
          pay the way you prefer.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="rounded-lg bg-white px-8 py-3 font-semibold text-green-800 shadow-lg transition hover:bg-green-50"
          >
            Shop now
          </Link>
          <Link
            href="/categories"
            className="rounded-lg border border-white/70 px-8 py-3 font-semibold transition hover:bg-white/10"
          >
            Browse categories
          </Link>
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-green-50">
          {features.map((f) => (
            <li key={f.text} className="flex items-center gap-2">
              <span className="text-lg">{f.icon}</span>
              {f.text}
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
          fill="#ffffff"
        />
      </svg>
    </section>
  );
}