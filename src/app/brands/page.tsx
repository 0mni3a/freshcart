import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Brand } from "@/types";
import PageHeader from "@/components/PageHeader";

export default async function BrandsPage() {
  const res = await api<{ data: Brand[] }>("/brands");

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Brands"
        subtitle={`${res.data.length} brands you can shop`}
      />

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {res.data.map((brand) => (
          <Link
            key={brand._id}
            href={`/brands/${brand._id}`}
            className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-green-600 hover:shadow-lg"
          >
            <div className="relative h-36">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-contain p-6 transition duration-500 group-hover:scale-105"
              />
            </div>
            <h2 className="border-t border-stone-100 px-4 py-3 text-center text-sm font-semibold text-stone-800">
              {brand.name}
            </h2>
          </Link>
        ))}
      </div>
    </main>
  );
}