"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";

type Pending =
  | { kind: "item"; id: string; title: string }
  | { kind: "all" }
  | null;

export default function CartPage() {
  const router = useRouter();
  const { token, isReady } = useAuth();
  const { cart, removeItem, updateCount, clearCart } = useCart();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);

  useEffect(() => {
    if (isReady && !token) router.push("/login");
  }, [isReady, token, router]);

  async function run(
    id: string,
    action: () => Promise<void>,
    successMessage?: string
  ) {
    setBusyId(id);
    try {
      await action();
      if (successMessage) toast.success(successMessage);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  function handleConfirm() {
    const current = pending;
    setPending(null);
    if (!current) return;

    if (current.kind === "item") {
      run(current.id, () => removeItem(current.id), "Product removed");
    } else {
      run("all", clearCart, "Cart cleared");
    }
  }

  if (!isReady || !token) return null;

  const items = cart?.products ?? [];

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        text="Looks like you have not added anything yet."
        href="/products"
        cta="Browse products"
      />
    );
  }

  const totalCount = items.reduce((sum, i) => sum + i.count, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-end justify-between sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            Shopping cart
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {totalCount} {totalCount === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          onClick={() => setPending({ kind: "all" })}
          disabled={busyId !== null}
          className="text-sm font-medium text-red-600 transition hover:underline disabled:opacity-50"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const id = item.product.id;
            const busy = busyId === id || busyId === "all";

            return (
              <li
                key={item._id}
                className={`flex gap-3 rounded-2xl border border-stone-200 bg-white p-3 transition sm:gap-5 sm:p-4 ${
                  busy ? "opacity-60" : ""
                }`}
              >
                <Link
                  href={`/products/${id}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-28 sm:w-28 md:h-36 md:w-36"
                >
                  <Image
                    src={item.product.imageCover}
                    alt={item.product.title}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${id}`}
                        className="line-clamp-2 text-sm font-semibold text-stone-900 hover:text-green-700 sm:text-base"
                      >
                        {item.product.title}
                      </Link>
                      <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                        {item.price} EGP each
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setPending({
                          kind: "item",
                          id,
                          title: item.product.title,
                        })
                      }
                      disabled={busy}
                      aria-label="Remove product"
                      className="shrink-0 rounded-full p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center rounded-full border border-stone-200">
                      <button
                        onClick={() =>
                          run(id, () => updateCount(id, item.count - 1))
                        }
                        disabled={busy || item.count <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100 disabled:opacity-30"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.count}
                      </span>
                      <button
                        onClick={() =>
                          run(id, () => updateCount(id, item.count + 1))
                        }
                        disabled={busy}
                        aria-label="Increase quantity"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100 disabled:opacity-30"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="text-base font-bold text-stone-900 sm:text-lg">
                      {item.price * item.count}
                      <span className="ml-1 text-xs font-medium text-stone-500">
                        EGP
                      </span>
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* ملخص الطلب */}
        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-stone-900">Order summary</h2>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-stone-600">
              <dt>Items ({totalCount})</dt>
              <dd>{cart?.totalCartPrice} EGP</dd>
            </div>
            <div className="flex justify-between text-stone-600">
              <dt>Shipping</dt>
              <dd>Calculated at checkout</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-5">
            <span className="font-semibold text-stone-900">Total</span>
            <span className="text-2xl font-bold text-green-700">
              {cart?.totalCartPrice}
              <span className="ml-1 text-sm font-medium text-stone-500">
                EGP
              </span>
            </span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-green-600 px-4 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Proceed to checkout
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-sm font-medium text-green-700 hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>

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