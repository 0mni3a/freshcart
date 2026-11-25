"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg border">
        <Image
          src={selected}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img) => (
            <button
              key={img}
              onClick={() => setSelected(img)}
              className={`relative h-20 w-20 overflow-hidden rounded border-2 ${
                img === selected ? "border-green-600" : "border-transparent"
              }`}
            >
              <Image src={img} alt={title} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}