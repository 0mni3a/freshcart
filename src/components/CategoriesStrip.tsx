import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types";

export default function CategoriesStrip({
  categories,
}: {
  categories: Category[];
}) {
  // بنكرر القايمة مرتين عشان اللفة تبان متصلة من غير فراغ
  const items = [...categories, ...categories];

  return (
    <section className="mx-auto max-w-7xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Shop by category</h2>
        <Link href="/categories" className="text-sm text-green-600 hover:underline">
          View all
        </Link>
      </div>

      <div className="marquee overflow-hidden">
        <div className="marquee-track">
          {items.map((c, i) => (
            <Link
              key={`${c._id}-${i}`}
              href={`/categories/${c._id}`}
              aria-hidden={i >= categories.length}
              tabIndex={i >= categories.length ? -1 : 0}
              className="mr-4 w-32 shrink-0 text-center"
            >
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <p className="mt-2 line-clamp-1 text-sm font-medium">{c.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}