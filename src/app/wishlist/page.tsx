"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import AddToCartButton from "@/components/AddToCartButton";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";

export default function WishlistPage() {
  const router = useRouter();
  const { token, isReady } = useAuth();
  const { items, remove } = useWishlist();
  const [pending, setPending] = useState<{ id: string; title: string } | null>(
    null
  );

  useEffect(() => {
    if (isReady && !token) router.push("/login");
  }, [isReady, token, router]);

  async function handleConfirm() {
    const current = pending;
    setPending(null);
    if (!current) return;
    try {
      await remove(current.id);
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (!isReady || !token) return null;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        text="Tap the heart on any product to save it here."
        href="/products"
        cta="Browse products"
      />
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">My wishlist</h1>
        <p className="mt-1 text-sm text-stone-500">
          {items.length} saved {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <ul className="space-y-4">
        {items.map((product) => {
          const hasDiscount =
            !!product.priceAfterDiscount &&
            product.priceAfterDiscount < product.price;

          return (
            <li
              key={product.id}
              className="flex gap-5 rounded-2xl border border-stone-200 bg-white p-4"
            >
              <Link
                href={`/products/${product.id}`}
                className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-stone-100 md:h-36 md:w-36"
              >
                <Image
                  src={product.imageCover}
                  alt={product.title}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/products/${product.id}`}
                      className="line-clamp-2 font-semibold text-stone-900 hover:text-green-700"
                    >
                      {product.title}
                    </Link>
                    <p className="mt-1 text-sm text-stone-500">
                      {product.category?.name}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setPending({ id: product.id, title: product.title })
                    }
                    aria-label="Remove from wishlist"
                    className="rounded-full p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
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

                  <AddToCartButton productId={product.id} className="w-44" />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        open={pending !== null}
        title="Remove from wishlist?"
        message={`"${pending?.title}" will be removed from your wishlist.`}
        confirmText="Yes, remove"
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
    </main>
  );
}