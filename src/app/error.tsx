"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-5xl">😕</p>
      <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-gray-500">
        We could not load this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded bg-green-600 px-6 py-3 text-white hover:bg-green-700"
      >
        Try again
      </button>
    </main>
  );
}