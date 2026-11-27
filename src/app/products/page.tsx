import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { getAllProducts } from "@/lib/products";
import PageHeader from "@/components/PageHeader";
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

  const pageClass =
    "flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-medium transition";

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Products"
        subtitle={`${list.length} ${list.length === 1 ? "product" : "products"}`}
      />

      <ProductFilters
        initial={{
          keyword: sp.keyword ?? "",
          sort: sp.sort ?? "",
          min: sp.min ?? "",
          max: sp.max ?? "",
        }}
      />

      {visible.length === 0 ? (
        <div className="py-20 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400">
            <SearchX className="h-7 w-7" />
          </span>
          <h2 className="mt-5 text-lg font-semibold text-stone-900">
            No products found
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Try a different keyword or clear your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {numberOfPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          {current > 1 ? (
            <Link
              href={pageHref(current - 1)}
              aria-label="Previous page"
              className={`${pageClass} border-stone-200 bg-white hover:border-green-600`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span
              className={`${pageClass} border-stone-100 text-stone-300`}
              aria-hidden
            >
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}

          {Array.from({ length: numberOfPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={pageHref(n)}
              aria-current={n === current ? "page" : undefined}
              className={`${pageClass} ${
                n === current
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-stone-200 bg-white hover:border-green-600"
              }`}
            >
              {n}
            </Link>
          ))}

          {current < numberOfPages ? (
            <Link
              href={pageHref(current + 1)}
              aria-label="Next page"
              className={`${pageClass} border-stone-200 bg-white hover:border-green-600`}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span
              className={`${pageClass} border-stone-100 text-stone-300`}
              aria-hidden
            >
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </nav>
      )}
    </main>
  );
}