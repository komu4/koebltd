import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

// Body: { dataUrl: string, name: string, folder?: string }
export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { dataUrl, name, folder } = await req.json();
  if (!dataUrl) return NextResponse.json({ error: "Missing image data" }, { status: 400 });

  const { url, publicId } = await uploadImage(dataUrl, folder ? `koeb/${folder}` : "koeb");

  const media = await prisma.media.create({
    data: { url, publicId, name: name || "untitled", folder: folder || "general" },
  });

  return NextResponse.json(media, { status: 201 });
}

// Body: { id: string, publicId: string }
export async function DELETE(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id, publicId } = await req.json();
  await deleteImage(publicId).catch(() => {});
  await prisma.media.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
