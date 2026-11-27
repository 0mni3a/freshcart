"use client";

import { useState } from "react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

type Props = {
  initial: { keyword: string; sort: string; min: string; max: string };
};

const inputClass =
  "rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

export default function ProductFilters({ initial }: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initial.keyword);
  const [sort, setSort] = useState(initial.sort);
  const [min, setMin] = useState(initial.min);
  const [max, setMax] = useState(initial.max);

  const hasFilters = keyword || sort || min || max;

  function reset() {
    setKeyword("");
    setSort("");
    setMin("");
    setMax("");
    router.push("/products");
  }

  return (
    <Form
      action="/products"
      className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4"
    >
      <div className="relative min-w-56 flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          name="keyword"
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className={`${inputClass} w-full pl-10`}
        />
      </div>

      <select
        name="sort"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className={inputClass}
      >
        <option value="">Sort by</option>
        <option value="price">Price: low to high</option>
        <option value="-price">Price: high to low</option>
        <option value="-ratingsAverage">Top rated</option>
      </select>

      <div className="flex items-center gap-2">
        <input
          name="min"
          type="number"
          min="0"
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className={`${inputClass} w-24`}
        />
        <span className="text-stone-400">-</span>
        <input
          name="max"
          type="number"
          min="0"
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className={`${inputClass} w-24`}
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
      >
        Apply
      </button>

      {hasFilters && (
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-medium text-stone-500 transition hover:text-red-600"
        >
          <X className="h-4 w-4" /> Reset
        </button>
      )}
    </Form>
  );
}