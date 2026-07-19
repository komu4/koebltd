# KOEB Industrial Website

A production-ready Next.js website for KOEB (Air Filters, Air Compressors, Compressor Parts &
Industrial Accessories), rebuilt from the supplied homepage design with a full admin dashboard.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Prisma · PostgreSQL ·
NextAuth (Credentials) · Cloudinary · React Hook Form + Zod

## Applying the latest migration (About Us gallery columns)

This update adds new `galleryImage1Url` … `galleryImage4Url`/`PublicId` columns to the
`Homepage` table (fixes `Prisma error P2022: column Homepage.galleryImage1Url does not exist`)
and corrects the `Settings` row's WhatsApp/social links to the official accounts.

**If your database already has data in it** (the common case — you already ran `migrate dev
--name init` before and seeded it), adopt the new migration folder without re-running the
baseline SQL, since your tables already exist:

```bash
npx prisma migrate resolve --applied 20260101000000_init
npx prisma migrate deploy
```

The first command just marks the old baseline as already-applied in Prisma's migration history
table (it does not touch your data). The second command then actually runs the new migration
that adds the gallery columns and fixes the Settings row.

**If you're setting up a brand new, empty database**, just run:

```bash
npx prisma migrate deploy
```

and both migrations (the full baseline + the gallery columns) will run in order.

## 1. Install dependencies

```bash
npm install
```

> Note: `npm install` runs `prisma generate` automatically (via `postinstall`). This needs normal
> internet access to Prisma's binary CDN — if it fails in a locked-down/offline environment, just
> run `npx prisma generate` again once you have full network access.

## 2. Configure environment variables

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL` — a PostgreSQL connection string (Vercel Postgres, Supabase, Neon, Railway, or your own instance all work)
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — used once by the seed script to create your first admin login

## 3. Set up the database

```bash
npx prisma migrate dev --name init
npm run db:seed
```

This creates all tables and seeds: your admin user, default homepage content, product categories,
two sample products, the four partner logos, and the services list — all editable afterwards from
`/admin`.

## 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login` for the admin
dashboard (log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set before seeding).

## 5. Deploy

Push to GitHub and import into Vercel. Add the same environment variables in the Vercel project
settings, then run the migration against your production database (`npx prisma migrate deploy`)
either locally pointed at the prod `DATABASE_URL`, or via a Vercel build step.

## What's editable from the admin dashboard

- **Homepage** — hero heading/subtitle/buttons/background image, the four feature cards, the About
  section text and image
- **Products** — full CRUD, multiple images per product, specs table, applications, features
- **Categories** — full CRUD
- **Services** — full CRUD
- **Partners** — full CRUD with logo upload and display order
- **Messages** — inbox for the contact form, mark read/unread, delete, export CSV

Every image uploaded through the dashboard goes to Cloudinary; only the resulting URL is stored in
Postgres, and deleting an image from the dashboard also removes it from Cloudinary.

## Placeholder images

Every image referenced in `public/images` right now is a plain SVG placeholder — this sandbox has
no access to stock-photo sites, so nothing here is an AI-generated image, but nothing is a real
photo either. Swap in real stock JPGs and transparent PNGs (hero background, compressor/filter
cutouts, office building, partner logos) either by replacing the files directly or, once Cloudinary
is configured, by uploading through the admin dashboard — every image slot on the site reads its
URL from the database and is replaceable without touching code.

## Project structure

```
src/
  app/
    (site)/            → public site: home, products, about, services, partners, contact
    admin/             → password-protected dashboard
    api/               → route handlers (products, categories, services, partners, contact, upload, auth)
    sitemap.ts, robots.ts
  components/
    layout/            → Navbar, Footer
    home/               → Hero, FeatureStrip, About, ProductsShowcase, Partners
    products/, contact/ → forms
    admin/              → sidebar, image uploader, product form
    ui/                 → Button, Container, SectionHeading
  lib/                  → prisma client, auth config, cloudinary helper, zod schemas
prisma/
  schema.prisma         → Users, Products, Categories, ProductImages, Services, Partners,
                          Homepage, Media, ContactMessages, Settings
  seed.ts
```

## Known limitation from this build environment

This project was generated in a sandbox with no access to a live Postgres instance, no Cloudinary
account, and no access to Prisma's binary CDN — so it could not be run end-to-end or screenshot-
tested here. The code has been type-checked (`tsc --noEmit`) and every remaining error at hand-off
time is an "implicit any" caused by Prisma Client types not being generated offline — not a logic
bug. Run through steps 1–4 above in your own environment to bring it fully to life, and open an
issue-style note back if anything doesn't behave as expected.
