"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export type PartnerItem = { id: string; name: string; logoUrl: string };

export default function Partners({ partners }: { partners: PartnerItem[] }) {
  return (
    <section className="bg-brand-light py-section-mobile md:py-section-tablet lg:py-section-desktop">
      <Container>
        <SectionHeading title="Our Partners" />
        <div className="mt-12 grid grid-cols-2 items-center gap-8 sm:grid-cols-4">
          {partners.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative h-14 grayscale transition-all hover:grayscale-0"
            >
              <Image src={p.logoUrl} alt={p.name} fill className="object-contain" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
