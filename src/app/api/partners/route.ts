import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { partnerSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";
import { deleteImage } from "@/lib/cloudinary";

const select = { id: true, name: true, logoUrl: true, logoPublicId: true, website: true, description: true, order: true } as const;

export async function GET() {
  const { response } = await requireAdmin(); if (response) return response;
  return NextResponse.json(await prisma.partner.findMany({ orderBy: { order: "asc" }, select }), { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin(); if (response) return response;
  const parsed = partnerSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !parsed.data.logoUrl) return NextResponse.json({ error: "Invalid partner data" }, { status: 400 });
  const partner = await prisma.partner.create({ data: parsed.data, select });
  revalidatePath("/"); revalidatePath("/partners");
  return NextResponse.json(partner, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { response } = await requireAdmin(); if (response) return response;
  const body = await req.json().catch(() => null);
  if (typeof body?.id !== "string") return NextResponse.json({ error: "Invalid partner id" }, { status: 400 });
  const { id: _id, ...data } = body;
  const parsed = partnerSchema.partial().safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: "Invalid partner data" }, { status: 400 });
  const partner = await prisma.partner.update({ where: { id: body.id }, data: parsed.data, select });
  revalidatePath("/"); revalidatePath("/partners");
  return NextResponse.json(partner);
}

export async function DELETE(req: NextRequest) {
  const { response } = await requireAdmin(); if (response) return response;
  const body = await req.json().catch(() => null);
  if (typeof body?.id !== "string") return NextResponse.json({ error: "Invalid partner id" }, { status: 400 });
  const partner = await prisma.partner.findUnique({ where: { id: body.id }, select: { logoPublicId: true } });
  if (!partner) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (partner.logoPublicId) await deleteImage(partner.logoPublicId).catch(() => {});
  await prisma.partner.delete({ where: { id: body.id } });
  revalidatePath("/"); revalidatePath("/partners");
  return NextResponse.json({ success: true });
}
