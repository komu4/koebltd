"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

type HeroProps = {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  backgroundImageUrl?: string | null;
  backgroundImageUrls?: string[];
};

const heroEase = [0.22, 1, 0.36, 1] as const;

export default function Hero({
  titleLine1,
  titleLine2,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  backgroundImageUrl,
  backgroundImageUrls,
}: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const images = useMemo(() => {
    const configured = (backgroundImageUrls || []).filter(Boolean).slice(0, 3);
    return configured.length > 0 ? configured : [backgroundImageUrl || "/images/hero-bg.svg"];
  }, [backgroundImageUrl, backgroundImageUrls]);

  return (
    <section className="relative overflow-hidden bg-brand-dark">
      <HeroBackground images={images} reduceMotion={shouldReduceMotion} />
      {/* Left-side scrim: covers the text column, fades cleanly to transparent
          so the right half of the background image shows without any tint. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.75)_30%,rgba(0,0,0,0.30)_52%,transparent_68%)]" />

      {/* Subtle top/bottom vignette so the image edges don't feel clipped */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18)_0%,transparent_18%,transparent_80%,rgba(0,0,0,0.22)_100%)]" />

      <Container className="relative grid min-h-[560px] grid-cols-1 items-center gap-10 py-20 md:grid-cols-2 md:py-0">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease: heroEase }}
        >
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: heroEase }}
            className="font-heading text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-[3.75rem] lg:text-7xl"
          >
            {titleLine1}
            <br />
            {titleLine2}
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: heroEase }}
            className="mt-5 max-w-md text-base text-gray-300 md:text-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28, ease: heroEase }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Button href={primaryHref} variant="primary">
              {primaryLabel}
            </Button>
            <Button href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: 24, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: heroEase, delay: 0.12 }}
          className="relative hidden h-[420px] md:block"
        >
          <motion.div
            animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image
              src="/images/hero-compressor.svg"
              alt="KOEB industrial air compressor with air filters"
              fill
              className="object-contain object-right"
            />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function HeroBackground({
  images,
  reduceMotion,
}: {
  images: string[];
  reduceMotion: boolean | null;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive((current) => Math.min(current, images.length - 1));
  }, [images.length]);

  // Keep the hero as an automatic slider. The slider itself always advances;
  // reduced-motion only changes how the visual transition is rendered.
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-dark">
      {images.map((image, index) => {
        const isActive = index === active;

        return (
          <motion.div
            key={`${image}-${index}`}
            initial={false}
            animate={
              isActive
                ? reduceMotion
                  ? { opacity: 0.72, scale: 1 }
                  : { opacity: 0.72, scale: 1.035 }
                : { opacity: 0, scale: 1 }
            }
            transition={{
              opacity: { duration: reduceMotion ? 0.2 : 1.35, ease: "easeInOut" },
              scale: { duration: 6.4, ease: [0.16, 1, 0.3, 1] },
            }}
            className="absolute inset-0 will-change-[opacity,transform]"
            aria-hidden={!isActive}
          >
            <Image
              src={image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        );
      })}

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/15 px-3 py-2 shadow-lg backdrop-blur-md">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show hero slide ${index + 1}`}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className="group flex h-3 items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  index === active ? "w-7 bg-white" : "w-1.5 bg-white/45 group-hover:bg-white/75"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
