import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

// Same query shape as the Products page / Products API route:
// same include (first image + category), same orderBy, just capped to 18
// so the homepage always mirrors whatever the Products page shows first.
async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      include: { images: { take: 1, orderBy: { order: "asc" } }, category: true },
      orderBy: { createdAt: "desc" },
      take: 18,
    });
  } catch {
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="bg-brand-light py-section-mobile md:py-section-tablet lg:py-section-desktop">
      <Container>
        <SectionHeading title="Featured Products" />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="group rounded-card border border-brand-border bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-48 w-full overflow-hidden rounded-section bg-brand-light">
                <Image
                  src={p.images[0]?.url || "/images/products/product-gallery-1.svg"}
                  alt={p.name}
                  fill
                  loading="lazy"
                  className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-center font-heading text-lg font-bold">{p.name}</h3>
            </Link>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button href="/products" variant="primary">
            View All Products
          </Button>
        </div>
      </Container>
    </section>
  );
}
