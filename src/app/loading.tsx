export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl p-6" aria-busy="true">
      <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-stone-200" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
          >
            <div className="aspect-square animate-pulse bg-stone-200" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-1/3 animate-pulse rounded bg-stone-200" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-stone-200" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-stone-200" />
              <div className="h-10 animate-pulse rounded-full bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}