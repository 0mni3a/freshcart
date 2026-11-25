"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
];

export default function Navbar() {
  const { token, isReady, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { numOfItems } = useCart();

  // قفل الـ dropdown لما تدوسي برّاه
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setOpen(false);
    logout();
    router.push("/login");
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-green-600">
          FreshCart
        </Link>

        {isReady && token && (
          <ul className="flex gap-6">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-green-600">
                  {l.label}
                  {l.href === "/cart" && numOfItems > 0 && (
                    <span className="ml-1 rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">
                      {numOfItems}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-3">
          {isReady &&
            (token ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex items-center gap-1 rounded border px-3 py-1 hover:border-green-600 hover:text-green-600"
                >
                  Account
                  <span className="text-xs">{open ? "▲" : "▼"}</span>
                </button>

                {open && (
                  <div className="absolute right-0 z-10 mt-2 w-48 rounded border bg-white shadow-lg">
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/change-password"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Change Password
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            ))}
        </div>
      </div>
    </nav>
  );
}
