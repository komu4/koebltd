/**
 * Custom Next.js image loader for Cloudinary.
 *
 * For Cloudinary URLs this injects width/quality transformations directly into
 * the Cloudinary URL so images are served from Cloudinary's CDN without
 * proxying through /_next/image (which was timing out at 7–18 s).
 *
 * For any other URL (local public assets, etc.) the src is returned as-is so
 * nothing else in the app is affected.
 */

type LoaderParams = { src: string; width: number; quality?: number };

export default function cloudinaryLoader({ src, width, quality }: LoaderParams): string {
  // Only transform Cloudinary URLs — leave everything else untouched.
  if (!src.includes("res.cloudinary.com")) {
    return src;
  }

  const q = quality ?? 75;

  // Cloudinary URLs look like:
  //   https://res.cloudinary.com/<cloud>/image/upload/<version>/<path>
  // Insert a transformation segment after "/upload/".
  const transformed = src.replace(
    "/upload/",
    `/upload/w_${width},q_${q},f_auto/`
  );

  return transformed;
}
