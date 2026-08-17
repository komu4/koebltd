import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { imageAssetSchema, productSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";

const imageListSchema = imageAssetSchema.array().max(12);

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin(); if (response) return response;
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category")?.trim().slice(0, 120);
  const q = searchParams.get("q")?.trim().slice(0, 100);
  const products = await prisma.product.findMany({
    where: { ...(category ? { category: { slug: category } } : {}), ...(q ? { name: { contains: q, mode: "insensitive" } } : {}) },
    include: { images: { select: { id: true, url: true, publicId: true, order: true } }, category: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json(products, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin(); if (response) return response;
  const body = await req.json().catch(() => null);
  const { images: _images, ...productData } = body && typeof body === "object" ? body : {};
  const parsed = productSchema.safeParse(productData);
  if (!parsed.success) return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
  const images = imageListSchema.safeParse(_images ?? []);
  if (!images.success) return NextResponse.json({ error: "Invalid product images" }, { status: 400 });
  const product = await prisma.product.create({ data: { ...parsed.data, images: images.data.length ? { create: images.data.map((img, i) => ({ ...img, order: i })) } : undefined }, include: { images: true } });
  return NextResponse.json(product, { status: 201 });
}
