"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function About({
  heading,
  body,
  imageUrl,
}: {
  heading: string;
  body: string;
  imageUrl?: string | null;
}) {
  const paragraphs = body.split("\n").filter(Boolean);

  return (
    <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop">
      <Container>
        <SectionHeading title={heading} />
        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-brand-text/90"
          >
            {paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed">{p}</p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-72 overflow-hidden rounded-section sm:h-96"
          >
            <Image
              src={imageUrl || "/images/about-building.svg"}
              alt="KOEB office building"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
