import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_FOLDERS = new Set(["general", "homepage", "about-gallery", "categories", "partners", "products"]);

function parseImageDataUrl(dataUrl: unknown) {
  if (typeof dataUrl !== "string" || dataUrl.length > 7_000_000) return null;
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || !ALLOWED_TYPES.has(match[1])) return null;
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) return null;
  return { dataUrl, mime: match[1] };
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = parseImageDataUrl(body?.dataUrl);
  if (!parsed) return NextResponse.json({ error: "Invalid image. Use JPEG, PNG, WebP or GIF up to 5MB." }, { status: 400 });

  const folder = typeof body?.folder === "string" && ALLOWED_FOLDERS.has(body.folder) ? body.folder : "general";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 160) : "untitled";
  const { url, publicId } = await uploadImage(parsed.dataUrl, `koeb/${folder}`);
  const media = await prisma.media.create({ data: { url, publicId, name: name || "untitled", folder } });
  return NextResponse.json({ id: media.id, url: media.url, publicId: media.publicId }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;
  const body = await req.json().catch(() => null);
  if (typeof body?.id !== "string" || typeof body?.publicId !== "string") return NextResponse.json({ error: "Invalid media reference" }, { status: 400 });
  const media = await prisma.media.findUnique({ where: { id: body.id }, select: { publicId: true } });
  if (!media || media.publicId !== body.publicId) return NextResponse.json({ error: "Media not found" }, { status: 404 });
  await deleteImage(media.publicId).catch(() => {});
  await prisma.media.delete({ where: { id: body.id } });
  return NextResponse.json({ success: true });
}
