"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
};

export default function Hero({
  titleLine1,
  titleLine2,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  backgroundImageUrl,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-dark">
      <Image
        key={backgroundImageUrl || "default-hero-bg"}
        src={backgroundImageUrl || "/images/hero-bg.svg"}
        alt="Industrial factory floor"
        fill
        priority
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

      <Container className="relative grid min-h-[560px] grid-cols-1 items-center gap-10 py-20 md:grid-cols-2 md:py-0">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            {titleLine1}
            <br />
            {titleLine2}
          </h1>
          <p className="mt-5 max-w-md text-base text-gray-300 md:text-lg">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={primaryHref} variant="primary">
              {primaryLabel}
            </Button>
            <Button href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative hidden h-[420px] md:block"
        >
          <Image
            src="/images/hero-compressor.svg"
            alt="KOEB industrial air compressor with air filters"
            fill
            className="object-contain object-right"
          />
        </motion.div>
      </Container>
    </section>
  );
}
