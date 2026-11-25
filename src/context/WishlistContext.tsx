"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "@/lip/api";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types";

type WishlistContextType = {
  items: Product[];
  isInWishlist: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
  remove: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [items, setItems] = useState<Product[]>([]);

  const refresh = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }
    try {
      const res = await api<{ data: Product[] }>("/wishlist", {
        headers: { token },
      });
      setItems(res.data);
    } catch {
      setItems([]);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function isInWishlist(productId: string) {
    return items.some((p) => p.id === productId);
  }

  async function remove(productId: string) {
    await api(`/wishlist/${productId}`, {
      method: "DELETE",
      headers: { token: token ?? "" },
    });
    await refresh();
  }

  async function toggle(productId: string) {
    if (isInWishlist(productId)) {
      await remove(productId);
      return;
    }
    await api("/wishlist", {
      method: "POST",
      headers: { token: token ?? "" },
      body: JSON.stringify({ productId }),
    });
    await refresh();
  }

  return (
    <WishlistContext.Provider value={{ items, isInWishlist, toggle, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}