"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Heart,
  KeyRound,
  LogOut,
  Menu,
  Package,
  ShoppingBasket,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
];

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-[11px] font-semibold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Navbar() {
  const { token, userName, isReady, logout } = useAuth();
  const { numOfItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // قفل قايمة الموبايل لما الصفحة تتغيّر
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function handleLogout() {
    setOpen(false);
    setMobileOpen(false);
    logout();
    router.push("/login");
  }

  const firstName = userName?.split(" ")[0];

  const iconButton =
    "relative rounded-full p-2 text-stone-600 transition hover:bg-green-50 hover:text-green-700";

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#faf8f4]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6">
        {/* اللوجو */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white">
            <ShoppingBasket className="h-5 w-5" />
          </span>
          <span className="hidden text-xl font-bold tracking-tight text-green-900 min-[400px]:inline">
            FreshCart
          </span>
        </Link>

        {/* اللينكات (ديسكتوب) */}
        {isReady && token && (
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive(l.href)
                    ? "text-green-700"
                    : "text-stone-600 hover:text-green-700"
                }`}
              >
                {l.label}
                {isActive(l.href) && (
                  <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-green-600" />
                )}
              </Link>
            ))}
          </nav>
        )}

        {/* الجزء اليمين */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {isReady &&
            (token ? (
              <>
                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className={iconButton}
                >
                  <Heart className="h-5 w-5" />
                  <Badge count={wishlistItems.length} />
                </Link>

                <Link href="/cart" aria-label="Cart" className={iconButton}>
                  <ShoppingCart className="h-5 w-5" />
                  <Badge count={numOfItems} />
                </Link>

                <div className="relative ml-1" ref={menuRef}>
                  <button
                    onClick={() => setOpen((prev) => !prev)}
                    aria-expanded={open}
                    aria-label="Account menu"
                    className="flex items-center gap-2 rounded-full border border-stone-200 bg-white py-1.5 pl-2 pr-2 text-sm font-medium text-stone-700 transition hover:border-green-600 hover:text-green-700 sm:pr-3"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <User className="h-4 w-4" />
                    </span>
                    <span className="hidden max-w-24 truncate sm:inline">
                      {firstName ?? "Account"}
                    </span>
                    <ChevronDown
                      className={`hidden h-4 w-4 transition sm:block ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {open && (
                    <div className="absolute right-0 z-10 mt-2 w-52 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
                      <Link
                        href="/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-green-50"
                      >
                        <User className="h-4 w-4" /> My Profile
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-green-50"
                      >
                        <Package className="h-4 w-4" /> My Orders
                      </Link>
                      <Link
                        href="/change-password"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-green-50"
                      >
                        <KeyRound className="h-4 w-4" /> Change Password
                      </Link>
                      <div className="my-1 border-t border-stone-100" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* زرار القايمة (موبايل) */}
                <button
                  onClick={() => setMobileOpen((prev) => !prev)}
                  aria-label="Menu"
                  aria-expanded={mobileOpen}
                  className={`${iconButton} md:hidden`}
                >
                  {mobileOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:text-green-700 sm:px-4"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 sm:px-5"
                >
                  Register
                </Link>
              </>
            ))}
        </div>
      </div>

      {/* قايمة الموبايل */}
      {isReady && token && mobileOpen && (
        <nav className="border-t border-stone-200/70 bg-[#faf8f4] px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
                isActive(l.href)
                  ? "bg-green-50 text-green-700"
                  : "text-stone-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}