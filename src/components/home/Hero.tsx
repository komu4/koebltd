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
    const configured = (backgroundImageUrls || [])
      .filter(Boolean)
      .slice(0, 3);

    return configured.length > 0
      ? configured
      : [backgroundImageUrl || "/images/hero-bg.svg"];
  }, [backgroundImageUrl, backgroundImageUrls]);

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-brand-dark">
      {/* Background image slider only */}
      <HeroBackground
        images={images}
        reduceMotion={shouldReduceMotion}
      />

      {/* Hero content */}
      <Container className="relative z-10 flex min-h-[560px] items-center py-20 md:py-24">
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -22,
                }
          }
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.75,
            ease: heroEase,
          }}
          className="relative max-w-2xl"
        >
          {/* Very subtle glass surface behind text.
              No gradient and does not cover the hero. */}
          <div
            className="
              pointer-events-none
              absolute
              -inset-6
              -z-10
              rounded-3xl
              bg-black/10
              backdrop-blur-[2px]
            "
          />

          {/* Heading */}
          <motion.h1
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 12,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.08,
              ease: heroEase,
            }}
            className="
              font-heading
              text-4xl
              font-black
              leading-[1.02]
              tracking-[-0.035em]
              text-white
              drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)]
              sm:text-5xl
              md:text-[3.75rem]
              lg:text-7xl
            "
          >
            {titleLine1}
            <br />
            {titleLine2}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 10,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.18,
              ease: heroEase,
            }}
            className="
              mt-5
              max-w-lg
              text-base
              font-medium
              leading-7
              tracking-[0.005em]
              text-white/90
              drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]
              md:text-lg
              md:leading-8
            "
          >
            {subtitle}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 10,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.28,
              ease: heroEase,
            }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Button
              href={primaryHref}
              variant="primary"
            >
              {primaryLabel}
            </Button>

            <Button
              href={secondaryHref}
              variant="secondary"
            >
              {secondaryLabel}
            </Button>
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

  /* Keep active slide valid if images change */
  useEffect(() => {
    setActive((current) =>
      Math.min(current, images.length - 1)
    );
  }, [images.length]);

  /* Automatic slider */
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setActive(
        (current) => (current + 1) % images.length
      );
    }, 6000);

    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-dark">
      {images.map((image, index) => {
        const isActive = index === active;

        return (
          <motion.div
            key={`${image}-${index}`}
            initial={false}
            animate={
              isActive
                ? reduceMotion
                  ? {
                      opacity: 1,
                      scale: 1,
                    }
                  : {
                      opacity: 1,
                      scale: 1.035,
                    }
                : {
                    opacity: 0,
                    scale: 1,
                  }
            }
            transition={{
              opacity: {
                duration: reduceMotion
                  ? 0.2
                  : 1.35,
                ease: "easeInOut",
              },
              scale: {
                duration: 6.4,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            className="
              absolute
              inset-0
              will-change-[opacity,transform]
            "
            aria-hidden={!isActive}
          >
            <Image
              src={image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="
                object-cover
                object-center
              "
            />
          </motion.div>
        );
      })}

      {/* Slider indicators */}
      {images.length > 1 && (
        <div
          className="
            absolute
            bottom-6
            left-1/2
            z-10
            flex
            -translate-x-1/2
            items-center
            gap-2
            rounded-full
            border
            border-white/15
            bg-black/15
            px-3
            py-2
            shadow-lg
            backdrop-blur-md
          "
        >
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show hero slide ${index + 1}`}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className="
                group
                flex
                h-3
                items-center
              "
            >
              <span
                className={`
                  block
                  h-1.5
                  rounded-full
                  transition-all
                  duration-500
                  ${
                    index === active
                      ? "w-7 bg-white"
                      : "w-1.5 bg-white/45 group-hover:bg-white/75"
                  }
                `}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}