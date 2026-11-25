import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-6xl font-bold text-green-600">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-gray-500">
        The page you are looking for does not exist or was moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded bg-green-600 px-6 py-3 text-white hover:bg-green-700"
      >
        Back to home
      </Link>
    </main>
  );
}