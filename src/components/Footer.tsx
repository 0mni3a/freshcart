import Link from "next/link";

const shop = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
];

const account = [
  { href: "/cart", label: "Cart" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/orders", label: "Orders" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-green-400">FreshCart</p>
          <p className="mt-2 text-sm">
            Your one-stop shop for fresh picks, delivered to your door.
          </p>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Shop</p>
          <ul className="space-y-2 text-sm">
            {shop.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-green-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Account</p>
          <ul className="space-y-2 text-sm">
            {account.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-green-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm">
        © 2026 FreshCart. All rights reserved.
      </div>
    </footer>
  );
}