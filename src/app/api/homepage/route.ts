import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const homepage = await prisma.homepage.findUnique({ where: { id: "homepage" } });
  return NextResponse.json(homepage);
}

export async function PUT(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const homepage = await prisma.homepage.upsert({
    where: { id: "homepage" },
    update: body,
    create: { id: "homepage", ...body },
  });

  // The homepage ("/") and About Us page ("/about", which renders the
  // gallery images stored here) are rendered from this data at request/build
  // time and can be cached by Next.js. Without this, a saved image (or any
  // other homepage/gallery edit) would not appear on the live site until a
  // full redeploy.
  revalidatePath("/");
  revalidatePath("/about");

  return NextResponse.json(homepage);
}
