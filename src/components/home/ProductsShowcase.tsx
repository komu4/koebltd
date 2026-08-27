"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

type CategoryCard = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
};

export default function ProductsShowcase({ categories }: { categories: CategoryCard[] }) {
  return (
    <section className="bg-white py-section-mobile md:py-section-tablet lg:py-section-desktop">
      <Container>
        <SectionHeading title="Our Products" />
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-card border border-brand-border bg-brand-light p-8 text-center transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)] hover:border-white"
            >
              <h3 className="font-heading text-xl font-bold text-brand-red">{category.name}</h3>
              <span className="mx-auto mt-2 block h-[2px] w-12 bg-brand-red" />
              <div className="relative mx-auto mt-6 h-48">
                {category.imageUrl ? (
                  <Image src={category.imageUrl} alt={category.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.035]" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-brand-text/40">No image</div>
                )}
              </div>
              <Button href={`/products?category=${category.slug}`} variant="primary" className="mt-6">
                View {category.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
