"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const router = useRouter();
  const { token } = useAuth();
  const { isInWishlist, toggle } = useWishlist();
  const [loading, setLoading] = useState(false);

  const active = isInWishlist(productId);

  async function handleClick() {
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      await toggle(productId);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex h-10 w-10 items-center justify-center rounded-full border bg-white text-xl shadow-sm hover:border-red-400 disabled:opacity-50 ${className}`}
    >
      {active ? "❤️" : "🤍"}
    </button>
  );
}