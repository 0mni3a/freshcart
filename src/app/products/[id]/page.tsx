import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lip/api";
import { Product } from "@/types";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import ProductReviews from "@/components/ProductReviews";

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
    product.priceAfterDiscount && product.priceAfterDiscount < product.price;

  return (
    <main className="mx-auto grid max-w-7xl gap-8 p-6 md:grid-cols-2">
      <ProductGallery
        images={[product.imageCover, ...product.images]}
        title={product.title}
      />

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{product.title}</h1>

        <div className="flex gap-3 text-sm">
          <Link
            href={`/categories/${product.category._id}`}
            className="text-green-600 hover:underline"
          >
            {product.category.name}
          </Link>
          <span>•</span>
          <Link
            href={`/brands/${product.brand._id}`}
            className="text-green-600 hover:underline"
          >
            {product.brand.name}
          </Link>
        </div>

        <p className="text-gray-600">{product.description}</p>

        <div className="flex items-center gap-4">
          {hasDiscount ? (
            <>
              <span className="text-2xl font-bold">
                {product.priceAfterDiscount} EGP
              </span>
              <span className="text-gray-400 line-through">
                {product.price} EGP
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold">{product.price} EGP</span>
          )}
        </div>

        <p className="text-sm text-gray-500">
          ⭐ {product.ratingsAverage} ({product.ratingsQuantity} reviews) •{" "}
          {product.quantity} in stock
        </p>
        <div className="flex max-w-xs items-center gap-3">
          <AddToCartButton productId={product.id} className="flex-1" />
          <WishlistButton productId={product.id} className="shrink-0" />
        </div>
      </div>
      <div className="md:col-span-2">
        <ProductReviews productId={product.id} />
      </div>
    </main>
  );
}
