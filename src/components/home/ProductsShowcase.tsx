"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

const cards = [
  {
    title: "Air Filters",
    image: "/images/products/air-filters.svg",
    description: "Engine air filters, industrial air filters, compressor filters and custom filter solutions.",
    href: "/products?category=air-filters",
    cta: "View Air Filters",
  },
  {
    title: "Air Compressors",
    image: "/images/products/air-compressors.svg",
    description: "Piston compressors, screw compressors and accessories for all applications.",
    href: "/products?category=air-compressors",
    cta: "View Air Compressors",
  },
];

export default function ProductsShowcase() {
  return (
    <section className="bg-white py-section-mobile md:py-section-tablet lg:py-section-desktop">
      <Container>
        <SectionHeading title="Our Products" />
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-card border border-brand-border bg-brand-light p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <h3 className="font-heading text-xl font-bold text-brand-red">{card.title}</h3>
              <span className="mx-auto mt-2 block h-[2px] w-12 bg-brand-red" />
              <div className="relative mx-auto mt-6 h-48">
                <Image src={card.image} alt={card.title} fill className="object-contain" />
              </div>
              <p className="mx-auto mt-6 max-w-sm text-sm text-brand-text/80">{card.description}</p>
              <Button href={card.href} variant="primary" className="mt-6">
                {card.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
