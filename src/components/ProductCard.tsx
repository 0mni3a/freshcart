import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Product } from "@/types";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.priceAfterDiscount!) / product.price) * 100
      )
    : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/70">
      {hasDiscount && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
          -{discountPercent}%
        </span>
      )}

      <WishlistButton
        productId={product.id}
        className="absolute right-3 top-3 z-10"
      />

      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
            {product.category.name}
          </p>

          <h3 className="line-clamp-2 min-h-[2.75rem] font-medium leading-snug text-stone-900">
            {product.title}
          </h3>

          <div className="mt-1 flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-stone-900">
                {hasDiscount ? product.priceAfterDiscount : product.price}
                <span className="ml-1 text-xs font-medium text-stone-500">
                  EGP
                </span>
              </span>
              {hasDiscount && (
                <span className="text-sm text-stone-400 line-through">
                  {product.price}
                </span>
              )}
            </div>

            <span className="flex items-center gap-1 text-sm text-stone-600">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {product.ratingsAverage}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
}