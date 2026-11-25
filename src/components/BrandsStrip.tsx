import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/types";

export default function BrandsStrip({ brands }: { brands: Brand[] }) {
  const items = [...brands, ...brands];

  return (
    <section className="mx-auto max-w-7xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Top brands</h2>
        <Link href="/brands" className="text-sm text-green-600 hover:underline">
          View all
        </Link>
      </div>

      <div className="marquee overflow-hidden">
        <div className="marquee-track">
          {items.map((b, i) => (
            <Link
              key={`${b._id}-${i}`}
              href={`/brands/${b._id}`}
              aria-hidden={i >= brands.length}
              tabIndex={i >= brands.length ? -1 : 0}
              className="mr-4 w-40 shrink-0 rounded-lg border bg-white p-3 transition hover:shadow-md"
            >
              <div className="relative h-16">
                <Image
                  src={b.image}
                  alt={b.name}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}