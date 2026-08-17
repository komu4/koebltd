import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { homepageSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const homepage = await prisma.homepage.findUnique({ where: { id: "homepage" } });
  if (!homepage) return NextResponse.json(null);
  return NextResponse.json(homepage, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PUT(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const parsed = homepageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid homepage data" }, { status: 400 });

  const homepage = await prisma.homepage.upsert({
    where: { id: "homepage" },
    update: parsed.data,
    create: { id: "homepage", ...parsed.data },
  });

  revalidatePath("/");
  revalidatePath("/about");
  return NextResponse.json(homepage);
}
