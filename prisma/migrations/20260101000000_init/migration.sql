-- Baseline migration.
--
-- This file represents the database schema as it already existed in
-- production/dev (created previously via `prisma migrate dev --name init`,
-- before the About Us gallery columns were added to the Homepage table).
--
-- If you are ADOPTING Prisma Migrate on a database that already has these
-- tables, do NOT run this file. Instead, mark it as already applied:
--
--   npx prisma migrate resolve --applied 20260101000000_init
--
-- If you are setting up a brand new, empty database, this file (together
-- with the migration that follows it) will create the full schema from
-- scratch — just run `npx prisma migrate deploy`.

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "specifications" JSONB,
    "applications" TEXT[],
    "features" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION,
    "datasheetUrl" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'wrench',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "logoPublicId" TEXT,
    "website" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homepage" (
    "id" TEXT NOT NULL DEFAULT 'homepage',
    "heroTitleLine1" TEXT NOT NULL DEFAULT 'Pure Air.',
    "heroTitleLine2" TEXT NOT NULL DEFAULT 'Powerful Performance.',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'High quality air filters and air compressors built for reliability and efficiency.',
    "heroPrimaryLabel" TEXT NOT NULL DEFAULT 'View Products',
    "heroPrimaryHref" TEXT NOT NULL DEFAULT '/products',
    "heroSecondaryLabel" TEXT NOT NULL DEFAULT 'Our Services',
    "heroSecondaryHref" TEXT NOT NULL DEFAULT '/services',
    "heroImageUrl" TEXT,
    "featureCards" JSONB,
    "aboutHeading" TEXT NOT NULL DEFAULT 'About Us',
    "aboutBody" TEXT NOT NULL DEFAULT 'KOEB is a trusted supplier of high quality air filters and air compressors for industrial, commercial and automotive applications.',
    "aboutImageUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Homepage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "folder" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'settings',
    "address" TEXT NOT NULL DEFAULT '19, Mojidi Street, Off Toyin Street, Ikeja, Lagos, Nigeria',
    "phone" TEXT NOT NULL DEFAULT '08023508817, 08031335765, 08038672377',
    "email" TEXT NOT NULL DEFAULT 'info@koebltd.com',
    "whatsapp" TEXT DEFAULT '2348023508817',
    "mapsUrl" TEXT DEFAULT 'https://www.google.com/maps?q=19+Mojidi+Street,+Off+Toyin+Street,+Ikeja,+Lagos,+Nigeria&output=embed',
    "businessHours" TEXT NOT NULL DEFAULT 'Mon - Fri: 8:00 AM - 6:00 PM',
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
