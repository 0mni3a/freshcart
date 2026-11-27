"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  const arrowClass =
    "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow transition hover:bg-white";

  return (
    <div className="min-w-0">
      <div className="group relative aspect-square overflow-hidden rounded-3xl border border-stone-200 bg-white">
        <Image
          key={images[index]}
          src={images[index]}
          alt={title}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className={`${arrowClass} left-3 md:opacity-0 md:group-hover:opacity-100`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className={`${arrowClass} right-3 md:opacity-0 md:group-hover:opacity-100`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <span className="absolute bottom-3 right-3 rounded-full bg-stone-900/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-4 flex max-w-full gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition ${
                i === index
                  ? "border-green-600"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}