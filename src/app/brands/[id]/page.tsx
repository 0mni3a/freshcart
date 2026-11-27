import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { getAllProducts } from "@/lib/products";
import { Brand } from "@/types";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";

export default async function BrandDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let brand: Brand;
  try {
    const res = await api<{ data: Brand }>(`/brands/${id}`);
    brand = res.data;
  } catch {
    notFound();
  }

  const all = await getAllProducts();
  const products = all.filter((p) => p.brand._id === id);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title={brand.name}
        subtitle={`${products.length} ${
          products.length === 1 ? "product" : "products"
        }`}
        image={brand.image}
        back={{ href: "/brands", label: "All brands" }}
      />

      {products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-500">
          No products for this brand yet.
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