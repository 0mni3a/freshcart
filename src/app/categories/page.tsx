import Image from "next/image";
import Link from "next/link";
import { api } from "@/lip/api";
import { Category } from "@/types";

export default async function CategoriesPage() {
  const res = await api<{ data: Category[] }>("/categories");

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Categories</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {res.data.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category._id}`}
            className="overflow-hidden rounded-lg border bg-white transition hover:shadow-lg"
          >
            <div className="relative aspect-square">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover"
              />
            </div>
            <h2 className="p-3 text-center font-medium text-green-600">
              {category.name}
            </h2>
          </Link>
        ))}
      </div>
    </main>
  );
}