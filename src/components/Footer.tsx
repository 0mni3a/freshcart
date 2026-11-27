import Link from "next/link";
import { ShoppingBasket } from "lucide-react";

const shop = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
];

const account = [
  { href: "/cart", label: "Cart" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/orders", label: "Orders" },
  { href: "/profile", label: "Profile" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-green-950 text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white">
              <ShoppingBasket className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold text-white">FreshCart</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-400">
            Your one-stop shop for everyday products, delivered to your door
            with cash or online payment.
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Shop
          </p>
          <ul className="space-y-3 text-sm">
            {shop.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-green-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Account
          </p>
          <ul className="space-y-3 text-sm">
            {account.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-green-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-stone-500">
        © 2026 FreshCart. All rights reserved.
      </div>
    </footer>
  );
}