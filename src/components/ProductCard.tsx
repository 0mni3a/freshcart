import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.priceAfterDiscount && product.priceAfterDiscount < product.price;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border bg-white transition hover:shadow-lg">
      <WishlistButton
        productId={product.id}
        className="absolute right-2 top-2 z-10"
      />

      <Link href={`/products/${product.id}`} className="block flex-1">
        <div className="relative aspect-square">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-1 p-3">
          <p className="text-sm text-green-600">{product.category.name}</p>
          <h3 className="line-clamp-1 font-medium">{product.title}</h3>

          <div className="flex items-center justify-between text-sm">
            <div>
              {hasDiscount ? (
                <>
                  <span className="font-semibold">
                    {product.priceAfterDiscount} EGP
                  </span>{" "}
                  <span className="text-gray-400 line-through">
                    {product.price}
                  </span>
                </>
              ) : (
                <span className="font-semibold">{product.price} EGP</span>
              )}
            </div>
            <span>⭐ {product.ratingsAverage}</span>
          </div>
        </div>
      </Link>

      <div className="p-3 pt-0">
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
}