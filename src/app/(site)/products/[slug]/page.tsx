import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import InquiryForm from "@/components/products/InquiryForm";

async function getProduct(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: "asc" } }, category: true },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await (async () => {
    try {
      return await prisma.product.findMany({
        where: { categoryId: product.categoryId, NOT: { id: product.id } },
        include: { images: { take: 1 } },
        take: 3,
      });
    } catch {
      return [];
    }
  })();

  const specs = (product.specifications as Record<string, string> | null) || {};
  const images = product.images.length
    ? product.images
    : [{ id: "placeholder", url: "/images/products/product-gallery-1.svg" }];

  return (
    <Container className="py-section-mobile md:py-section-tablet lg:py-section-desktop">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <div className="relative h-96 w-full overflow-hidden rounded-section bg-brand-light">
            <Image src={images[0].url} alt={product.name} fill className="object-contain p-6" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative h-20 overflow-hidden rounded-button bg-brand-light">
                  <Image src={img.url} alt={product.name} fill className="object-contain p-2" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
            {product.category.name}
          </p>
          <h1 className="mt-1 font-heading text-3xl font-bold">{product.name}</h1>
          {product.price && (
            <p className="mt-3 font-heading text-2xl font-bold text-brand-red">
              ${product.price.toLocaleString()}
            </p>
          )}
          <p className="mt-4 leading-relaxed text-brand-text/80">{product.description}</p>

          {product.features.length > 0 && (
            <ul className="mt-6 space-y-2 text-sm">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-red" /> {f}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            {product.datasheetUrl && (
              <Button href={product.datasheetUrl} variant="dark">
                Download Datasheet
              </Button>
            )}
            <Button href="#inquiry" variant="primary">
              Request a Quote
            </Button>
          </div>
        </div>
      </div>

      {Object.keys(specs).length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-bold">Specifications</h2>
          <table className="mt-4 w-full border-collapse overflow-hidden rounded-section border border-brand-border text-sm">
            <tbody>
              {Object.entries(specs).map(([key, value], i) => (
                <tr key={key} className={i % 2 === 0 ? "bg-brand-light" : "bg-white"}>
                  <td className="border-b border-brand-border px-4 py-3 font-semibold">{key}</td>
                  <td className="border-b border-brand-border px-4 py-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {product.applications.length > 0 && (
        <div className="mt-12">
          <h2 className="font-heading text-2xl font-bold">Applications</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {product.applications.map((a) => (
              <span key={a} className="rounded-button bg-brand-light px-4 py-2 text-sm">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-bold">Related Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <a
                key={r.id}
                href={`/products/${r.slug}`}
                className="rounded-card border border-brand-border p-4 transition hover:shadow-lg"
              >
                <div className="relative h-32 bg-brand-light rounded-button">
                  <Image
                    src={r.images[0]?.url || "/images/products/product-gallery-1.svg"}
                    alt={r.name}
                    fill
                    className="object-contain p-3"
                  />
                </div>
                <p className="mt-3 font-heading font-semibold text-sm">{r.name}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      <div id="inquiry" className="mt-16 max-w-xl">
        <h2 className="font-heading text-2xl font-bold">Product Inquiry</h2>
        <p className="mt-2 text-sm text-brand-text/70">
          Interested in {product.name}? Send us your requirements and we'll get back to you.
        </p>
        <InquiryForm productName={product.name} />
      </div>
    </Container>
  );
}
