"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart } from "lucide-react";
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
      toast.success(active ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110 disabled:opacity-60 ${className}`}
    >
      <Heart
        className={`h-4.5 w-4.5 transition ${
          active ? "fill-red-500 text-red-500" : "text-stone-600"
        }`}
      />
    </button>
  );
}