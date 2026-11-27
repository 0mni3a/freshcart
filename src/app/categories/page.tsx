import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Category } from "@/types";
import PageHeader from "@/components/PageHeader";

export default async function CategoriesPage() {
  const res = await api<{ data: Category[] }>("/categories");

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Categories"
        subtitle={`${res.data.length} categories to explore`}
      />

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {res.data.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category._id}`}
            className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/70"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <h2 className="px-4 py-4 text-center font-semibold text-stone-900 transition group-hover:text-green-700">
              {category.name}
            </h2>
          </Link>
        ))}
      </div>
    </main>
  );
}