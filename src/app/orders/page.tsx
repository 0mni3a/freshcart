"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard } from "lucide-react";
import { api } from "@/lip/api";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types";

export default function OrdersPage() {
  const router = useRouter();
  const { token, userId, isReady } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

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
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Something went wrong")
      );
  }, [token, userId]);

  if (!isReady || !token) return null;

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="rounded bg-red-50 p-3 text-red-600">{error}</p>
      </main>
    );
  }

  if (orders === null) {
    return <main className="p-6 text-center text-gray-500">Loading...</main>;
  }

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-3xl p-6 py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold">No orders yet</h1>
        <p className="mb-6 text-gray-500">Your orders will show up here.</p>
        <Link
          href="/products"
          className="rounded bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          Start shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">My Orders ({orders.length})</h1>

      <ul className="space-y-6">
        {orders.map((order) => (
          <li key={order._id} className="rounded-lg border bg-white p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
              <div>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-400">#{order._id.slice(-8)}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1">
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
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Not paid"}
                </span>
                <span
                  className={`rounded-full px-3 py-1 ${
                    order.isDelivered
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.isDelivered ? "Delivered" : "In progress"}
                </span>
              </div>
            </div>

            <ul className="space-y-3">
              {order.cartItems.map((item) => (
                <li key={item._id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-1 font-medium">
                      {item.product.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.count} × {item.price} EGP
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <span className="text-sm text-gray-500">
                {order.shippingAddress &&
                  `${order.shippingAddress.city} - ${order.shippingAddress.details}`}
              </span>
              <span className="font-bold text-green-700">
                {order.totalOrderPrice} EGP
              </span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}