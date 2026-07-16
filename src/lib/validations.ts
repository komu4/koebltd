import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers and hyphens only"),
  categoryId: z.string().min(1, "Choose a category"),
  description: z.string().min(10, "Add a longer description"),
  specifications: z.record(z.string()).optional(),
  applications: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  price: z.number().positive().optional().nullable(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  order: z.number().optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  icon: z.string().optional(),
  order: z.number().optional(),
});

export const partnerSchema = z.object({
  name: z.string().min(2),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  order: z.number().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Tell us a bit more"),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
