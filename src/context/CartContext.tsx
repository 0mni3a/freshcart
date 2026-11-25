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
import { Cart } from "@/types";

type CartContextType = {
  cart: Cart | null;
  numOfItems: number;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateCount: (productId: string, count: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);

  const refresh = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }
    try {
      const res = await api<{ data: Cart }>("/cart", { headers: { token } });
      setCart(res.data);
    } catch {
      // مفيش سلة لسه للمستخدم ده
      setCart(null);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addToCart(productId: string) {
    await api("/cart", {
      method: "POST",
      headers: { token: token ?? "" },
      body: JSON.stringify({ productId }),
    });
    await refresh();
  }

  async function removeItem(productId: string) {
    await api(`/cart/${productId}`, {
      method: "DELETE",
      headers: { token: token ?? "" },
    });
    await refresh();
  }

  async function updateCount(productId: string, count: number) {
    await api(`/cart/${productId}`, {
      method: "PUT",
      headers: { token: token ?? "" },
      body: JSON.stringify({ count }),
    });
    await refresh();
  }

  async function clearCart() {
    await api("/cart", {
      method: "DELETE",
      headers: { token: token ?? "" },
    });
    setCart(null);
  }

  const numOfItems = cart?.products.reduce((sum, i) => sum + i.count, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
  cart,
  numOfItems,
  refreshCart: refresh,
  addToCart,
  removeItem,
  updateCount,
  clearCart,
}}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}