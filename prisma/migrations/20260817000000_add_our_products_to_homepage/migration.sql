-- AlterTable
ALTER TABLE "Homepage" ADD COLUMN "ourProductsHeading" TEXT NOT NULL DEFAULT 'Our Products';
ALTER TABLE "Homepage" ADD COLUMN "ourProductsCards" JSONB;
