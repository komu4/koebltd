import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { partnerSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";
import { deleteImage } from "@/lib/cloudinary";

export async function GET() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(partners);
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const parsed = partnerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const partner = await prisma.partner.create({
    data: { ...parsed.data, logoUrl: body.logoUrl, logoPublicId: body.logoPublicId },
  });

  // Partners are shown on both the Homepage ("/") and the Partners page — both
  // read from this same table, so both must be revalidated on every change or
  // one of them will keep serving a stale cached render.
  revalidatePath("/");
  revalidatePath("/partners");

  return NextResponse.json(partner, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const { id, ...rest } = body;
  const parsed = partnerSchema.partial().safeParse(rest);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const partner = await prisma.partner.update({
    where: { id },
    data: { ...parsed.data, logoUrl: rest.logoUrl, logoPublicId: rest.logoPublicId },
  });

  revalidatePath("/");
  revalidatePath("/partners");

  return NextResponse.json(partner);
}

export async function DELETE(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await req.json();
  const partner = await prisma.partner.findUnique({ where: { id } });
  if (partner?.logoPublicId) await deleteImage(partner.logoPublicId).catch(() => {});
  await prisma.partner.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/partners");

  return NextResponse.json({ success: true });
}
