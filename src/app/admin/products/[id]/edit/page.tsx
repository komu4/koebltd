import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Edit Product</h1>
      <div className="mt-6">
        <ProductForm
          initial={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            categoryId: product.categoryId,
            description: product.description,
            specifications: (product.specifications as Record<string, string>) || {},
            applications: product.applications,
            features: product.features,
            featured: product.featured,
            images: product.images.map((i) => ({ url: i.url, publicId: i.publicId })),
          }}
        />
      </div>
    </div>
  );
}
