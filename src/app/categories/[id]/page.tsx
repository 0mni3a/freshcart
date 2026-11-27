import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { getAllProducts } from "@/lib/products";
import { Category } from "@/types";
import PageHeader from "@/components/PageHeader";
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
    <main className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title={category.name}
        subtitle={`${products.length} ${
          products.length === 1 ? "product" : "products"
        }`}
        image={category.image}
        back={{ href: "/categories", label: "All categories" }}
      />

      {subCategories.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500">
            Subcategories
          </h2>
          <div className="flex flex-wrap gap-2">
            {subCategories.map((sub) => (
              <span
                key={sub._id}
                className="rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm text-stone-700"
              >
                {sub.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-500">
          No products in this category yet.
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