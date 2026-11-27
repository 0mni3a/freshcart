"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Banknote, CreditCard } from "lucide-react";
import { api } from "@/lip/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

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

const fields = [
  { name: "details", label: "Address details", type: "text" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "city", label: "City", type: "text" },
] as const;

const methods = [
  { value: "cash", title: "Cash on delivery", icon: Banknote },
  { value: "online", title: "Pay online", icon: CreditCard },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { token, isReady } = useAuth();
  const { cart, refreshCart } = useCart();
  const [method, setMethod] = useState<Method>("cash");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isReady && !token) router.push("/login");
  }, [isReady, token, router]);

  const formik = useFormik({
    initialValues: { details: "", phone: "", city: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!cart) return;
      setError("");
      const body = JSON.stringify({ shippingAddress: values });
      const headers = { token: token ?? "" };

      try {
        if (method === "cash") {
          await api(`/orders/${cart._id}`, { method: "POST", headers, body });
          await refreshCart();
          router.push("/orders");
        } else {
          const res = await api<{ session: { url: string } }>(
            `/orders/checkout-session/${cart._id}?url=${window.location.origin}/orders`,
            { method: "POST", headers, body }
          );
          window.location.href = res.session.url;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!isReady || !token) return null;

  if (!cart || cart.products.length === 0) {
    return (
      <main className="mx-auto max-w-3xl p-6 py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold">Your cart is empty</h1>
        <p className="text-gray-500">Add products before checking out.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 p-6 md:grid-cols-3">
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 md:col-span-2"
      >
        <h1 className="text-2xl font-bold">Checkout</h1>

        <h2 className="font-semibold">Shipping address</h2>
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1 block text-sm font-medium">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              value={formik.values[f.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded border p-2 focus:border-green-600 focus:outline-none"
            />
            {formik.touched[f.name] && formik.errors[f.name] && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors[f.name]}
              </p>
            )}
          </div>
        ))}

        <h2 className="pt-2 font-semibold">Payment method</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {methods.map(({ value, title, icon: Icon }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                method === value
                  ? "border-green-600 bg-green-50"
                  : "hover:border-green-400"
              }`}
            >
              <input
                type="radio"
                name="method"
                value={value}
                checked={method === value}
                onChange={() => setMethod(value)}
                className="accent-green-600"
              />
              <Icon className="h-5 w-5 text-green-700" />
              <span className="font-medium">{title}</span>
            </label>
          ))}
        </div>

        {error && (
          <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full rounded bg-green-600 p-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {formik.isSubmitting
            ? "Processing..."
            : method === "cash"
            ? "Place order"
            : "Continue to payment"}
        </button>
      </form>

      <aside className="h-fit rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">Order summary</h2>
        <ul className="space-y-2 text-sm">
          {cart.products.map((item) => (
            <li key={item._id} className="flex justify-between gap-2">
              <span className="line-clamp-1">
                {item.product.title} × {item.count}
              </span>
              <span>{item.price * item.count} EGP</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t pt-3 text-lg font-bold">
          <span>Total</span>
          <span className="text-green-700">{cart.totalCartPrice} EGP</span>
        </div>
      </aside>
    </main>
  );
}