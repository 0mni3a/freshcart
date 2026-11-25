"use client";

import { useState } from "react";
import Form from "next/form";
import { useRouter } from "next/navigation";

type Props = {
  initial: { keyword: string; sort: string; min: string; max: string };
};

const inputClass =
  "rounded border p-2 focus:border-green-600 focus:outline-none";

export default function ProductFilters({ initial }: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initial.keyword);
  const [sort, setSort] = useState(initial.sort);
  const [min, setMin] = useState(initial.min);
  const [max, setMax] = useState(initial.max);

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
      className="mb-6 flex flex-wrap items-end gap-3"
    >
      <input
        name="keyword"
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className={`${inputClass} w-full md:w-64`}
      />

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

      <input
        name="min"
        type="number"
        placeholder="Min price"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        className={`${inputClass} w-28`}
      />
      <input
        name="max"
        type="number"
        placeholder="Max price"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        className={`${inputClass} w-28`}
      />

      <button
        type="submit"
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Apply
      </button>
      <button
        type="button"
        onClick={reset}
        className="rounded border px-4 py-2 hover:border-green-600"
      >
        Reset
      </button>
    </Form>
  );
}