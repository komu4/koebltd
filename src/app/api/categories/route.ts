import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true, slug: true, order: true, imageUrl: true, imagePublicId: true, showOnHomepage: true } });
  return NextResponse.json(categories, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin(); if (response) return response;
  const parsed = categorySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid category data" }, { status: 400 });
  const category = await prisma.category.create({ data: parsed.data });
  return NextResponse.json(category, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { response } = await requireAdmin(); if (response) return response;
  const body = await req.json().catch(() => null);
  if (typeof body?.id !== "string") return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid category data" }, { status: 400 });
  const category = await prisma.category.update({ where: { id: body.id }, data: parsed.data });
  return NextResponse.json(category);
}

export async function DELETE(req: NextRequest) {
  const { response } = await requireAdmin(); if (response) return response;
  const body = await req.json().catch(() => null);
  if (typeof body?.id !== "string") return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  await prisma.category.delete({ where: { id: body.id } });
  return NextResponse.json({ success: true });
}
