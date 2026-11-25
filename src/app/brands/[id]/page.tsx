import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lip/api";
import { getAllProducts } from "@/lib/products";
import { Brand } from "@/types";
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
    <main className="mx-auto max-w-7xl p-6">
      <Link href="/brands" className="text-sm text-green-600 hover:underline">
        ← All brands
      </Link>

      <div className="mb-8 mt-3 flex items-center gap-4">
        <div className="relative h-20 w-32">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            sizes="128px"
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold">{brand.name}</h1>
      </div>

      <h2 className="mb-3 font-semibold">Products ({products.length})</h2>

      {products.length === 0 ? (
        <p className="py-16 text-center text-gray-500">
          No products for this brand.
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