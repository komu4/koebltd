-- Adds the About Us gallery columns to Homepage (this is what was missing —
-- causing "Prisma error P2022: column Homepage.galleryImage1Url does not
-- exist"). Existing Homepage data is untouched; the new columns are
-- nullable, so no data loss and no default values are forced on it.

-- AlterTable
ALTER TABLE "Homepage"
  ADD COLUMN "galleryImage1Url" TEXT,
  ADD COLUMN "galleryImage1PublicId" TEXT,
  ADD COLUMN "galleryImage2Url" TEXT,
  ADD COLUMN "galleryImage2PublicId" TEXT,
  ADD COLUMN "galleryImage3Url" TEXT,
  ADD COLUMN "galleryImage3PublicId" TEXT,
  ADD COLUMN "galleryImage4Url" TEXT,
  ADD COLUMN "galleryImage4PublicId" TEXT;

-- Update the column defaults for future rows (does not affect any existing
-- row's stored value on its own).
ALTER TABLE "Settings" ALTER COLUMN "whatsapp" SET DEFAULT '2347070070996';
ALTER TABLE "Settings" ALTER COLUMN "facebookUrl" SET DEFAULT 'https://www.facebook.com/profile.php?id=61573895350637';
ALTER TABLE "Settings" ALTER COLUMN "instagramUrl" SET DEFAULT 'https://www.instagram.com/koebindustrialsolutionsltd/';
ALTER TABLE "Settings" ALTER COLUMN "linkedinUrl" SET DEFAULT 'https://www.linkedin.com/company/105698550/admin/edit/?editPageActiveTab=info';

-- Correct the existing singleton Settings row so the official WhatsApp
-- number and social accounts take effect immediately across the site,
-- without waiting on a reseed. There is no admin UI for these fields today,
-- so this is a one-time data fix rather than something an admin's manual
-- edit could conflict with.
UPDATE "Settings"
SET
  "whatsapp" = '2347070070996',
  "facebookUrl" = 'https://www.facebook.com/profile.php?id=61573895350637',
  "instagramUrl" = 'https://www.instagram.com/koebindustrialsolutionsltd/',
  "linkedinUrl" = 'https://www.linkedin.com/company/105698550/admin/edit/?editPageActiveTab=info'
WHERE "id" = 'settings';
