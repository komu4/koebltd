import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const { response } = await requireAdmin(); if (response) return response;
  const services = await prisma.service.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true, slug: true, description: true, icon: true, order: true } });
  return NextResponse.json(services, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin(); if (response) return response;
  const parsed = serviceSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid service data" }, { status: 400 });
  return NextResponse.json(await prisma.service.create({ data: parsed.data }), { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { response } = await requireAdmin(); if (response) return response;
  const body = await req.json().catch(() => null);
  if (typeof body?.id !== "string") return NextResponse.json({ error: "Invalid service id" }, { status: 400 });
  const parsed = serviceSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid service data" }, { status: 400 });
  return NextResponse.json(await prisma.service.update({ where: { id: body.id }, data: parsed.data }));
}

export async function DELETE(req: NextRequest) {
  const { response } = await requireAdmin(); if (response) return response;
  const body = await req.json().catch(() => null);
  if (typeof body?.id !== "string") return NextResponse.json({ error: "Invalid service id" }, { status: 400 });
  await prisma.service.delete({ where: { id: body.id } });
  return NextResponse.json({ success: true });
}
