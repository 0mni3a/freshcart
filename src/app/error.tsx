"use client";

import { AlertCircle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertCircle className="h-8 w-8" />
      </span>
      <h1 className="mt-5 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-stone-500">
        We could not load this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700"
      >
        Try again
      </button>
    </main>
  );
}