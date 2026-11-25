import Link from "next/link";
import { api } from "@/lip/api";
import { Product, ProductsResponse } from "@/types";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";

const PAGE_SIZE = 12;

type SearchParams = {
  page?: string;
  keyword?: string;
  sort?: string;
  min?: string;
  max?: string;
};

async function getAllProducts(): Promise<Product[]> {
  const first = await api<ProductsResponse>("/products?limit=100&page=1");
  let all = first.data;
  const pages = first.metadata?.numberOfPages ?? 1;

  for (let p = 2; p <= pages; p++) {
    const res = await api<ProductsResponse>(`/products?limit=100&page=${p}`);
    all = all.concat(res.data);
  }
  return all;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const current = Number(sp.page) || 1;
  const kw = sp.keyword?.trim().toLowerCase();
  const min = sp.min ? Number(sp.min) : null;
  const max = sp.max ? Number(sp.max) : null;

  const all = await getAllProducts();

  const list = all.filter((p) => {
    if (
      kw &&
      !(
        p.title.toLowerCase().includes(kw) ||
        p.category.name.toLowerCase().includes(kw) ||
        p.brand.name.toLowerCase().includes(kw)
      )
    ) {
      return false;
    }
    if (min !== null && p.price < min) return false;
    if (max !== null && p.price > max) return false;
    return true;
  });

  if (sp.sort === "price") list.sort((a, b) => a.price - b.price);
  if (sp.sort === "-price") list.sort((a, b) => b.price - a.price);
  if (sp.sort === "-ratingsAverage") {
    list.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
  }

  const numberOfPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const visible = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const filters = new URLSearchParams();
  if (sp.keyword) filters.set("keyword", sp.keyword);
  if (sp.sort) filters.set("sort", sp.sort);
  if (sp.min) filters.set("min", sp.min);
  if (sp.max) filters.set("max", sp.max);

  function pageHref(n: number) {
    const p = new URLSearchParams(filters);
    p.set("page", String(n));
    return `/products?${p.toString()}`;
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Products</h1>

      <ProductFilters
        initial={{
          keyword: sp.keyword ?? "",
          sort: sp.sort ?? "",
          min: sp.min ?? "",
          max: sp.max ?? "",
        }}
      />

      {visible.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {numberOfPages > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {Array.from({ length: numberOfPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={pageHref(n)}
              className={`rounded border px-3 py-1 ${
                n === current
                  ? "bg-green-600 text-white"
                  : "hover:border-green-600"
              }`}
            >
              {n}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}