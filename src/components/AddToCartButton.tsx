"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const router = useRouter();
  const { token } = useAuth();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await addToCart(productId);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:opacity-70 ${
          done
            ? "bg-green-100 text-green-800"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : done ? (
          <Check className="h-4 w-4" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
        {loading ? "Adding..." : done ? "Added" : "Add to cart"}
      </button>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}