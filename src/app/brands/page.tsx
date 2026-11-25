import Image from "next/image";
import Link from "next/link";
import { api } from "@/lip/api";
import { Brand } from "@/types";

export default async function BrandsPage() {
  const res = await api<{ data: Brand[] }>("/brands");

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Brands</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {res.data.map((brand) => (
          <Link
            key={brand._id}
            href={`/brands/${brand._id}`}
            className="overflow-hidden rounded-lg border bg-white transition hover:shadow-lg"
          >
            <div className="relative aspect-video">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-contain p-4"
              />
            </div>
            <h2 className="p-3 text-center font-medium">{brand.name}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}