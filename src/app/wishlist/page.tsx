"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import AddToCartButton from "@/components/AddToCartButton";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function WishlistPage() {
  const router = useRouter();
  const { token, isReady } = useAuth();
  const { items, remove } = useWishlist();
  const [pending, setPending] = useState<{ id: string; title: string } | null>(
    null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (isReady && !token) router.push("/login");
  }, [isReady, token, router]);

  async function handleConfirm() {
    const current = pending;
    setPending(null);
    if (!current) return;
    setError("");
    try {
      await remove(current.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (!isReady || !token) return null;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl p-6 py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mb-6 text-gray-500">
          Tap the heart on any product to save it here.
        </p>
        <Link
          href="/products"
          className="rounded bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-bold">My Wishlist ({items.length})</h1>

      {error && (
        <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <ul className="space-y-4">
        {items.map((product) => (
          <li
            key={product.id}
            className="flex gap-6 rounded-lg border bg-white p-4"
          >
            <Link
              href={`/products/${product.id}`}
              className="relative h-32 w-32 shrink-0 overflow-hidden rounded md:h-40 md:w-40"
            >
              <Image
                src={product.imageCover}
                alt={product.title}
                fill
                sizes="160px"
                className="object-cover"
              />
            </Link>

            <div className="flex flex-1 flex-col justify-between gap-3">
              <div>
                <h2 className="line-clamp-1 text-lg font-medium">
                  {product.title}
                </h2>
                <p className="font-semibold text-green-700">
                  {product.price} EGP
                </p>
              </div>

              <div className="flex items-center gap-4">
                <AddToCartButton
                  productId={product.id}
                  className="w-40"
                />
                <button
                  onClick={() =>
                    setPending({ id: product.id, title: product.title })
                  }
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
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