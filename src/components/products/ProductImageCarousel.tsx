"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

type CarouselImage = { id: string; url: string };

export default function ProductImageCarousel({
  images,
  alt,
}: {
  images: CarouselImage[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Single image: keep the exact same markup/behavior as before, no controls.
  if (images.length <= 1) {
    return (
      <div className="relative h-96 w-full overflow-hidden rounded-section bg-brand-light">
        <Image src={images[0].url} alt={alt} fill className="object-contain p-6" />
      </div>
    );
  }

  const goTo = (i: number) => setIndex((i + images.length) % images.length);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  return (
    <div>
      <div
        className="group relative h-96 w-full select-none overflow-hidden rounded-section bg-brand-light"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((img, i) => (
          <div
            key={img.id}
            className={clsx(
              "absolute inset-0 transition-opacity duration-500 ease-in-out",
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <Image
              src={img.url}
              alt={`${alt} — image ${i + 1} of ${images.length}`}
              fill
              className="object-contain p-6"
              priority={i === 0}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-text shadow-md transition-opacity duration-200 hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next image"
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-text shadow-md transition-opacity duration-200 hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
              className={clsx(
                "h-1.5 rounded-full transition-all duration-200",
                i === index ? "w-5 bg-brand-red" : "w-1.5 bg-white/80"
              )}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`View image ${i + 1}`}
            className={clsx(
              "relative h-20 overflow-hidden rounded-button bg-brand-light transition-all duration-200",
              i === index ? "ring-2 ring-brand-red" : "opacity-70 hover:opacity-100"
            )}
          >
            <Image src={img.url} alt="" fill className="object-contain p-2" />
          </button>
        ))}
      </div>
    </div>
  );
}
