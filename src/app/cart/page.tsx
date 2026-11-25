"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import ConfirmDialog from "@/components/ConfirmDialog";

type Pending =
  | { kind: "item"; id: string; title: string }
  | { kind: "all" }
  | null;

export default function CartPage() {
  const router = useRouter();
  const { token, isReady } = useAuth();
  const { cart, removeItem, updateCount, clearCart } = useCart();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Pending>(null);

  useEffect(() => {
    if (isReady && !token) router.push("/login");
  }, [isReady, token, router]);

  async function run(id: string, action: () => Promise<void>) {
    setError("");
    setBusyId(id);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  function handleConfirm() {
    const current = pending;
    setPending(null);
    if (!current) return;

    if (current.kind === "item") {
      run(current.id, () => removeItem(current.id));
    } else {
      run("all", clearCart);
    }
  }

  if (!isReady || !token) return null;

  const items = cart?.products ?? [];

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl p-6 py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-6 text-gray-500">Add some products to get started.</p>
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <button
          onClick={() => setPending({ kind: "all" })}
          disabled={busyId !== null}
          className="text-sm text-red-600 hover:underline disabled:opacity-50"
        >
          Clear cart
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <ul className="space-y-4">
        {items.map((item) => {
          const id = item.product.id;
          const busy = busyId === id || busyId === "all";

          return (
            <li
              key={item._id}
              className="flex gap-6 rounded-lg border bg-white p-4"
            >
              <Link
                href={`/products/${id}`}
                className="relative h-32 w-32 shrink-0 overflow-hidden rounded md:h-40 md:w-40"
              >
                <Image
                  src={item.product.imageCover}
                  alt={item.product.title}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="line-clamp-1 text-lg font-medium">
                    {item.product.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {item.price} EGP each
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        run(id, () => updateCount(id, item.count - 1))
                      }
                      disabled={busy || item.count <= 1}
                      className="h-8 w-8 rounded border hover:border-green-600 disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.count}</span>
                    <button
                      onClick={() =>
                        run(id, () => updateCount(id, item.count + 1))
                      }
                      disabled={busy}
                      className="h-8 w-8 rounded border hover:border-green-600 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      {item.price * item.count} EGP
                    </span>
                    <button
                      onClick={() =>
                        setPending({
                          kind: "item",
                          id,
                          title: item.product.title,
                        })
                      }
                      disabled={busy}
                      className="text-sm text-red-600 hover:underline disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-center justify-between rounded-lg bg-green-50 p-4">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-xl font-bold text-green-700">
          {cart?.totalCartPrice} EGP
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-4 block rounded bg-green-600 p-3 text-center font-semibold text-white hover:bg-green-700"
      >
        Proceed to checkout
      </Link>

      <ConfirmDialog
        open={pending !== null}
        title={pending?.kind === "all" ? "Clear your cart?" : "Remove product?"}
        message={
          pending?.kind === "item"
            ? `"${pending.title}" will be removed from your cart.`
            : "All products will be removed from your cart."
        }
        confirmText={pending?.kind === "all" ? "Yes, clear" : "Yes, remove"}
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
    </main>
  );
}