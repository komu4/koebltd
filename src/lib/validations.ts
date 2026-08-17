import { z } from "zod";

const shortText = (min: number, max: number) => z.string().trim().min(min).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional();
const idSchema = z.string().trim().min(1).max(100);
const safeUrl = z.string().trim().url().max(2048);

export const productSchema = z.object({
  name: shortText(2, 160),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers and hyphens only"),
  categoryId: idSchema,
  description: shortText(10, 10000),
  specifications: z.record(z.string().trim().max(500)).optional(),
  applications: z.array(z.string().trim().min(1).max(300)).max(50).optional(),
  features: z.array(z.string().trim().min(1).max(300)).max(50).optional(),
  featured: z.boolean().optional(),
  price: z.number().positive().max(1_000_000_000).optional().nullable(),
  datasheetUrl: safeUrl.optional().or(z.literal("")),
  metaTitle: optionalText(180),
  metaDescription: optionalText(500),
});

export const imageAssetSchema = z.object({
  url: safeUrl,
  publicId: z.string().trim().min(1).max(300),
});

export const categorySchema = z.object({
  name: shortText(2, 120),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/),
  order: z.number().int().min(0).max(10000).optional(),
  imageUrl: safeUrl.optional().nullable(),
  imagePublicId: z.string().trim().max(300).optional().nullable(),
  showOnHomepage: z.boolean().optional(),
});

export const serviceSchema = z.object({
  title: shortText(2, 160),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/),
  description: shortText(10, 5000),
  icon: z.string().trim().max(40).regex(/^[a-z0-9-]+$/).optional(),
  order: z.number().int().min(0).max(10000).optional(),
});

export const partnerSchema = z.object({
  name: shortText(2, 160),
  website: z.string().trim().url().max(2048).optional().or(z.literal("")),
  description: optionalText(3000),
  order: z.number().int().min(0).max(10000).optional(),
  logoUrl: safeUrl.optional(),
  logoPublicId: z.string().trim().max(300).optional().nullable(),
});

export const contactSchema = z.object({
  name: shortText(2, 120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().max(200).optional(),
  message: shortText(10, 10000),
  website: z.string().trim().max(200).optional(),
});

export const homepageSchema = z.object({
  heroTitleLine1: optionalText(160),
  heroTitleLine2: optionalText(160),
  heroSubtitle: optionalText(1000),
  heroPrimaryLabel: optionalText(80),
  heroPrimaryHref: z.string().trim().max(2048).regex(/^(\/|https:\/\/)/).optional(),
  heroSecondaryLabel: optionalText(80),
  heroSecondaryHref: z.string().trim().max(2048).regex(/^(\/|https:\/\/)/).optional(),
  heroImageUrl: safeUrl.optional().nullable(),
  heroImageUrls: z.array(safeUrl).max(3).optional().nullable(),
  featureCards: z.array(z.object({
    icon: z.string().trim().max(40),
    title: shortText(1, 100),
    description: shortText(1, 500),
  })).max(8).optional().nullable(),
  aboutHeading: optionalText(160),
  aboutBody: optionalText(10000),
  aboutImageUrl: safeUrl.optional().nullable(),
  galleryImage1Url: safeUrl.optional().nullable(),
  galleryImage1PublicId: z.string().trim().max(300).optional().nullable(),
  galleryImage2Url: safeUrl.optional().nullable(),
  galleryImage2PublicId: z.string().trim().max(300).optional().nullable(),
  galleryImage3Url: safeUrl.optional().nullable(),
  galleryImage3PublicId: z.string().trim().max(300).optional().nullable(),
  galleryImage4Url: safeUrl.optional().nullable(),
  galleryImage4PublicId: z.string().trim().max(300).optional().nullable(),
}).strict();

export const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(256),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
