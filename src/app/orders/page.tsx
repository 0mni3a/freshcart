"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Banknote, CreditCard, MapPin, Package } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types";
import EmptyState from "@/components/EmptyState";

export default function OrdersPage() {
  const router = useRouter();
  const { token, userId, isReady } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (isReady && !token) router.push("/login");
  }, [isReady, token, router]);

  useEffect(() => {
    if (!token || !userId) return;

    api<Order[] | { data: Order[] }>(`/orders/user/${userId}`, {
      headers: { token },
    })
      .then((res) => {
        const list = Array.isArray(res) ? res : res.data;
        // الأحدث الأول
        setOrders(
          [...list].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      })
      .catch((err) => {
        setOrders([]);
        toast.error(
          err instanceof Error ? err.message : "Could not load your orders"
        );
      });
  }, [token, userId]);

  if (!isReady || !token) return null;

  if (orders === null) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10" aria-busy="true">
        <div className="mb-8 h-9 w-48 animate-pulse rounded-lg bg-stone-200" />
        <div className="space-y-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-stone-200 bg-stone-100"
            />
          ))}
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        text="When you place an order, it will show up here."
        href="/products"
        cta="Start shopping"
      />
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">My orders</h1>
        <p className="mt-1 text-sm text-stone-500">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      <ul className="space-y-6">
        {orders.map((order) => (
          <li
            key={order._id}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
          >
            {/* رأس الطلب */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-stone-50 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  Order #{order._id.slice(-8)}
                </p>
                <p className="text-xs text-stone-500">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-stone-600 ring-1 ring-stone-200">
                  {order.paymentMethodType === "cash" ? (
                    <>
                      <Banknote className="h-3.5 w-3.5" /> Cash
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-3.5 w-3.5" /> Card
                    </>
                  )}
                </span>
                <span
                  className={`rounded-full px-3 py-1 ${
                    order.isPaid
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Not paid"}
                </span>
                <span
                  className={`rounded-full px-3 py-1 ${
                    order.isDelivered
                      ? "bg-green-100 text-green-800"
                      : "bg-sky-100 text-sky-800"
                  }`}
                >
                  {order.isDelivered ? "Delivered" : "In progress"}
                </span>
              </div>
            </div>

            {/* المنتجات */}
            <ul className="divide-y divide-stone-100 px-5">
              {order.cartItems.map((item) => (
                <li key={item._id} className="flex items-center gap-4 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-medium text-stone-900">
                      {item.product.title}
                    </p>
                    <p className="text-sm text-stone-500">
                      {item.count} × {item.price} EGP
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-stone-900">
                    {item.count * item.price} EGP
                  </span>
                </li>
              ))}
            </ul>

            {/* التذييل */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 px-5 py-4">
              {order.shippingAddress ? (
                <span className="flex items-center gap-2 text-sm text-stone-500">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {order.shippingAddress.city} - {order.shippingAddress.details}
                </span>
              ) : (
                <span />
              )}
              <span className="text-lg font-bold text-green-700">
                {order.totalOrderPrice}
                <span className="ml-1 text-xs font-medium text-stone-500">
                  EGP
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}