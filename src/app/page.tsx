import Link from "next/link";
import { api } from "@/lip/api";
import { Brand, Category, ProductsResponse } from "@/types";
import Hero from "@/components/Hero";
import CategoriesStrip from "@/components/CategoriesStrip";
import BrandsStrip from "@/components/BrandsStrip";
import Features from "@/components/Features";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const [categoriesRes, brandsRes, productsRes] = await Promise.all([
    api<{ data: Category[] }>("/categories"),
    api<{ data: Brand[] }>("/brands"),
    api<ProductsResponse>("/products?limit=8"),
  ]);

  return (
    <main>
      <Hero />
      <CategoriesStrip categories={categoriesRes.data} />

      <section className="mx-auto max-w-7xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Latest products</h2>
          <Link href="/products" className="text-sm text-green-600 hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {productsRes.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <BrandsStrip brands={brandsRes.data} />
      <Features />
    </main>
  );
}