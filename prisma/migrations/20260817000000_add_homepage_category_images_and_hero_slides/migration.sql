-- Add editable category cards and up to three homepage hero background images.
ALTER TABLE "Category" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Category" ADD COLUMN "imagePublicId" TEXT;
ALTER TABLE "Category" ADD COLUMN "showOnHomepage" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Homepage" ADD COLUMN "heroImageUrls" JSONB;
