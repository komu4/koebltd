import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const category = await prisma.category.create({ data: parsed.data });
  return NextResponse.json(category, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const { id, ...rest } = body;
  const parsed = categorySchema.partial().safeParse(rest);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const category = await prisma.category.update({ where: { id }, data: parsed.data });
  return NextResponse.json(category);
}

export async function DELETE(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await req.json();
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
