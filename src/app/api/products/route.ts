import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category: { slug: category } } : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const { images, ...rest } = body;
  const parsed = productSchema.safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.create({
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
  return NextResponse.json(product, { status: 201 });
}
