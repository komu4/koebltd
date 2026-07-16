import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Container from "@/components/ui/Container";
import { clsx } from "clsx";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse KOEB air filters, air compressors, compressor parts and industrial accessories.",
};

const PAGE_SIZE = 9;

async function getData(searchParams: { [key: string]: string | undefined }) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const q = searchParams.q?.trim() || "";
  const category = searchParams.category || "";

  try {
    const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

    const where = {
      ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
      ...(category ? { category: { slug: category } } : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: { take: 1, orderBy: { order: "asc" } }, category: true },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return { categories, products, total, page };
  } catch {
    return { categories: [], products: [], total: 0, page };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const { categories, products, total, page } = await getData(params);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <section className="bg-brand-dark py-16 text-center text-white">
        <Container>
          <h1 className="font-heading text-4xl font-bold">Our Products</h1>
          <p className="mt-3 text-gray-300">
            Air filters, air compressors, compressor parts and industrial accessories for every application.
          </p>
        </Container>
      </section>

      <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop">
        <Container>
          <form className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" method="get">
            <input
              type="text"
              name="q"
              defaultValue={params.q}
              placeholder="Search products..."
              className="w-full rounded-button border border-brand-border px-4 py-3 text-sm sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              <Link
                href="/products"
                className={clsx(
                  "rounded-button border px-4 py-2 text-sm font-heading font-semibold",
                  !params.category ? "bg-brand-red text-white border-brand-red" : "border-brand-border"
                )}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  className={clsx(
                    "rounded-button border px-4 py-2 text-sm font-heading font-semibold",
                    params.category === c.slug
                      ? "bg-brand-red text-white border-brand-red"
                      : "border-brand-border"
                  )}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </form>

          {products.length === 0 ? (
            <p className="py-20 text-center text-brand-text/60">
              No products yet — connect your database and add products from the admin dashboard to see them here.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group rounded-card border border-brand-border p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-section bg-brand-light">
                    <Image
                      src={p.images[0]?.url || "/images/products/product-gallery-1.svg"}
                      alt={p.name}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-red">
                    {p.category.name}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-bold">{p.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-brand-text/70">{p.description}</p>
                  <span className="mt-3 inline-block font-heading text-sm font-semibold text-brand-red">
                    View Details →
                  </span>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={`/products?${new URLSearchParams({ ...params, page: String(n) } as Record<string, string>).toString()}`}
                  className={clsx(
                    "h-10 w-10 rounded-button border text-sm font-semibold flex items-center justify-center",
                    n === page ? "bg-brand-red text-white border-brand-red" : "border-brand-border"
                  )}
                >
                  {n}
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
