import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lip/api";
import { getAllProducts } from "@/lib/products";
import { Category } from "@/types";
import ProductCard from "@/components/ProductCard";

type SubCategory = { _id: string; name: string; slug: string };

export default async function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let category: Category;
  try {
    const res = await api<{ data: Category }>(`/categories/${id}`);
    category = res.data;
  } catch {
    notFound();
  }

  let subCategories: SubCategory[] = [];
  try {
    const res = await api<{ data: SubCategory[] }>(
      `/categories/${id}/subcategories`
    );
    subCategories = res.data;
  } catch {
    subCategories = [];
  }

  const all = await getAllProducts();
  const products = all.filter((p) => p.category._id === id);

  return (
    <main className="mx-auto max-w-7xl p-6">
      <Link href="/categories" className="text-sm text-green-600 hover:underline">
        ← All categories
      </Link>

      <h1 className="mb-4 mt-2 text-2xl font-bold">{category.name}</h1>

      {subCategories.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-semibold">Subcategories</h2>
          <div className="flex flex-wrap gap-2">
            {subCategories.map((sub) => (
              <span
                key={sub._id}
                className="rounded-full border px-4 py-1 text-sm"
              >
                {sub.name}
              </span>
            ))}
          </div>
        </section>
      )}

      <h2 className="mb-3 font-semibold">Products ({products.length})</h2>

      {products.length === 0 ? (
        <p className="py-16 text-center text-gray-500">
          No products in this category.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}