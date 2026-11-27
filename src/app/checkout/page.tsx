"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Banknote, CreditCard, Loader2, ShoppingCart } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import EmptyState from "@/components/EmptyState";
import FormField from "@/components/FormField";

type Method = "cash" | "online";

const validationSchema = Yup.object({
  details: Yup.string()
    .min(5, "Enter your full address")
    .required("Address is required"),
  phone: Yup.string()
    .matches(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number")
    .required("Phone is required"),
  city: Yup.string().required("City is required"),
});

const methods = [
  {
    value: "cash",
    title: "Cash on delivery",
    text: "Pay when your order arrives",
    icon: Banknote,
  },
  {
    value: "online",
    title: "Pay online",
    text: "Secure payment by card",
    icon: CreditCard,
  },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { token, isReady } = useAuth();
  const { cart, refreshCart } = useCart();
  const [method, setMethod] = useState<Method>("cash");

  useEffect(() => {
    if (isReady && !token) router.push("/login");
  }, [isReady, token, router]);

  const formik = useFormik({
    initialValues: { details: "", phone: "", city: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!cart) return;
      const body = JSON.stringify({ shippingAddress: values });
      const headers = { token: token ?? "" };

      try {
        if (method === "cash") {
          await api(`/orders/${cart._id}`, { method: "POST", headers, body });
          await refreshCart();
          toast.success("Your order was placed");
          router.push("/orders");
        } else {
          const res = await api<{ session: { url: string } }>(
            `/orders/checkout-session/${cart._id}?url=${window.location.origin}/orders`,
            { method: "POST", headers, body }
          );
          window.location.href = res.session.url;
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!isReady || !token) return null;

  if (!cart || cart.products.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        text="Add some products before checking out."
        href="/products"
        cta="Browse products"
      />
    );
  }

  const field = (name: "details" | "phone" | "city") => ({
    id: name,
    name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched[name] && formik.errors[name],
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-stone-900">Checkout</h1>

      <form
        onSubmit={formik.handleSubmit}
        className="grid gap-8 lg:grid-cols-3"
      >
        <div className="space-y-8 lg:col-span-2">
          {/* العنوان */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-stone-900">
              Shipping address
            </h2>
            <div className="space-y-5">
              <FormField
                label="Address details"
                autoComplete="street-address"
                {...field("details")}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  {...field("phone")}
                />
                <FormField
                  label="City"
                  autoComplete="address-level2"
                  {...field("city")}
                />
              </div>
            </div>
          </section>

          {/* طريقة الدفع */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-stone-900">
              Payment method
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {methods.map(({ value, title, text, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${
                    method === value
                      ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                      : "border-stone-200 hover:border-green-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={value}
                    checked={method === value}
                    onChange={() => setMethod(value)}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      method === value
                        ? "bg-green-600 text-white"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-stone-900">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-sm text-stone-500">
                      {text}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* ملخص الطلب */}
        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-stone-900">Order summary</h2>

          <ul className="mt-5 space-y-4">
            {cart.products.map((item) => (
              <li key={item._id} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  <Image
                    src={item.product.imageCover}
                    alt={item.product.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-stone-900">
                    {item.product.title}
                  </p>
                  <p className="text-xs text-stone-500">Qty {item.count}</p>
                </div>
                <span className="text-sm font-semibold text-stone-900">
                  {item.price * item.count}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-5">
            <span className="font-semibold text-stone-900">Total</span>
            <span className="text-2xl font-bold text-green-700">
              {cart.totalCartPrice}
              <span className="ml-1 text-sm font-medium text-stone-500">
                EGP
              </span>
            </span>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
          >
            {formik.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {formik.isSubmitting
              ? "Processing..."
              : method === "cash"
              ? "Place order"
              : "Continue to payment"}
          </button>
        </aside>
      </form>
    </main>
  );
}