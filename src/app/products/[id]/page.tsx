import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { api } from "@/lib/api";
import { getAllProducts } from "@/lib/products";
import { Product } from "@/types";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import ProductReviews from "@/components/ProductReviews";
import ProductCard from "@/components/ProductCard";

const perks = [
  { icon: Truck, text: "Fast delivery to your door" },
  { icon: ShieldCheck, text: "Cash on delivery or secure online payment" },
  { icon: RotateCcw, text: "Easy returns" },
];

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: Product;
  try {
    const res = await api<{ data: Product }>(`/products/${id}`);
    product = res.data;
  } catch {
    notFound();
  }

  const hasDiscount =
    !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.priceAfterDiscount!) / product.price) * 100
      )
    : 0;

  const inStock = product.quantity > 0;
  const lowStock = inStock && product.quantity <= 5;

  // منتجات مشابهة من نفس القسم
  const all = await getAllProducts();
  const related = all
    .filter(
      (p) => p.category._id === product.category._id && p.id !== product.id
    )
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* مسار التنقل */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1 text-sm text-stone-500"
      >
        <Link href="/" className="hover:text-green-700">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-green-700">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/categories/${product.category._id}`}
          className="hover:text-green-700"
        >
          {product.category.name}
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="min-w-0 md:sticky md:top-24 md:self-start">
          <ProductGallery
            images={[product.imageCover, ...product.images]}
            title={product.title}
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/categories/${product.category._id}`}
              className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-green-800 transition hover:bg-green-100"
            >
              {product.category.name}
            </Link>
            <Link
              href={`/brands/${product.brand._id}`}
              className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-700 transition hover:bg-stone-200"
            >
              {product.brand.name}
            </Link>
          </div>

          <h1 className="mt-4 text-2xl font-bold leading-tight text-stone-900 [overflow-wrap:anywhere] sm:text-3xl">
            {product.title}
          </h1>

          {/* التقييم */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="flex">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-4 w-4 ${
                    n <= Math.round(product.ratingsAverage)
                      ? "fill-amber-400 text-amber-400"
                      : "text-stone-300"
                  }`}
                />
              ))}
            </span>
            <span className="font-semibold text-stone-800">
              {product.ratingsAverage}
            </span>
            <span className="text-stone-500">
              ({product.ratingsQuantity} reviews)
            </span>
          </div>

          {/* السعر */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-stone-900 sm:text-4xl">
              {hasDiscount ? product.priceAfterDiscount : product.price}
              <span className="ml-1.5 text-base font-medium text-stone-500">
                EGP
              </span>
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-stone-400 line-through">
                  {product.price}
                </span>
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* حالة المخزون */}
          <p
            className={`mt-3 flex items-center gap-2 text-sm font-medium ${
              !inStock
                ? "text-red-600"
                : lowStock
                ? "text-amber-600"
                : "text-green-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                !inStock
                  ? "bg-red-500"
                  : lowStock
                  ? "bg-amber-500"
                  : "bg-green-600"
              }`}
            />
            {!inStock
              ? "Out of stock"
              : lowStock
              ? `Only ${product.quantity} left`
              : "In stock"}
          </p>

          <p className="mt-6 leading-relaxed text-stone-600 [overflow-wrap:anywhere]">
            {product.description}
          </p>

          {/* الأزرار */}
          <div className="mt-8 flex max-w-sm items-center gap-3">
            <AddToCartButton productId={product.id} className="flex-1" />
            <WishlistButton
              productId={product.id}
              className="shrink-0 border border-stone-200"
            />
          </div>

          {/* مميزات */}
          <ul className="mt-8 space-y-3 border-t border-stone-200 pt-6">
            {perks.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-sm text-stone-600"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                  <Icon className="h-5 w-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ProductReviews productId={product.id} />

      {related.length > 0 && (
        <section className="mt-16 border-t border-stone-200 pt-10">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}