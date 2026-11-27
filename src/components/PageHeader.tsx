import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  image,
  back,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-8">
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          {back.label}
        </Link>
      )}

      <div className={`flex items-center gap-5 ${back ? "mt-4" : ""}`}>
        {image && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <Image
              src={image}
              alt=""
              fill
              sizes="80px"
              className="object-contain p-2"
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-stone-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}