import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { imageAssetSchema, productSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";
import { deleteImage } from "@/lib/cloudinary";

const imageListSchema = imageAssetSchema.array().max(12);

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin(); if (response) return response;
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { images: true, category: true } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin(); if (response) return response;
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const { images: _images, ...productData } = body && typeof body === "object" ? body : {};
  const parsed = productSchema.partial().safeParse(productData);
  if (!parsed.success) return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
  const images = _images === undefined ? undefined : imageListSchema.safeParse(_images);
  if (images && !images.success) return NextResponse.json({ error: "Invalid product images" }, { status: 400 });

  if (images) {
    const existing = await prisma.productImage.findMany({ where: { productId: id }, select: { publicId: true } });
    await Promise.allSettled(existing.map((img) => deleteImage(img.publicId)));
    await prisma.productImage.deleteMany({ where: { productId: id } });
  }

  const product = await prisma.product.update({ where: { id }, data: { ...parsed.data, ...(images ? { images: images.data.length ? { create: images.data.map((img, i) => ({ ...img, order: i })) } : undefined } : {}) }, include: { images: true } });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin(); if (response) return response;
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { images: { select: { publicId: true } } } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await Promise.allSettled(product.images.map((img) => deleteImage(img.publicId)));
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
