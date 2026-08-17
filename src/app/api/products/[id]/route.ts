import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";
import { deleteImage } from "@/lib/cloudinary";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json();
  const { images, ...rest } = body;
  const parsed = productSchema.partial().safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (images) {
    const existing = await prisma.productImage.findMany({ where: { productId: id } });
    await Promise.allSettled(existing.map((img) => deleteImage(img.publicId)));
    await prisma.productImage.deleteMany({ where: { productId: id } });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      images: images?.length
        ? {
            create: images.map((img: { url: string; publicId: string }, i: number) => ({
              url: img.url,
              publicId: img.publicId,
              order: i,
            })),
          }
        : undefined,
    },
    include: { images: true },
  });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await Promise.allSettled(product.images.map((img) => deleteImage(img.publicId)));
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
