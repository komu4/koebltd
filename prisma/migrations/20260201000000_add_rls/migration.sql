-- =============================================================================
-- Row-Level Security (RLS) for all public tables
--
-- This migration enables RLS on every application table and defines the
-- minimal set of policies required for the app to function correctly:
--
--   • The Next.js server connects as the "prisma_app" role (non-superuser,
--     BYPASSRLS=false) , so RLS is enforced and these policies apply.
--
--   • The "anon" and "authenticated" Supabase roles (used by the Supabase
--     JS client in a browser) are explicitly restricted below.
--
-- Run with: npx prisma migrate deploy
-- Or apply directly in the Supabase SQL editor.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. User  (admin accounts , never readable/writable from the browser)
-- ---------------------------------------------------------------------------
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- No public access; prisma_app has full access for NextAuth login checks
CREATE POLICY "user_no_public_access"
  ON "User"
  AS RESTRICTIVE
  FOR ALL
  TO anon, authenticated
  USING (false);

CREATE POLICY "user_prisma_app_all"
  ON "User"
  FOR ALL
  TO prisma_app
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 2. Category  (public read, admin write)
-- ---------------------------------------------------------------------------
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "category_public_read"
  ON "Category"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "category_prisma_app_all"
  ON "Category"
  FOR ALL
  TO prisma_app
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 3. Service  (public read, admin write)
-- ---------------------------------------------------------------------------
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_public_read"
  ON "Service"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "service_prisma_app_all"
  ON "Service"
  FOR ALL
  TO prisma_app
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 4. Partner  (public read, admin write)
-- ---------------------------------------------------------------------------
ALTER TABLE "Partner" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_public_read"
  ON "Partner"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "partner_prisma_app_all"
  ON "Partner"
  FOR ALL
  TO prisma_app
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 5. Homepage  (public read, admin write)
-- ---------------------------------------------------------------------------
ALTER TABLE "Homepage" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "homepage_public_read"
  ON "Homepage"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "homepage_prisma_app_all"
  ON "Homepage"
  FOR ALL
  TO prisma_app
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 6. Media  (public read, admin write)
-- ---------------------------------------------------------------------------
ALTER TABLE "Media" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "media_public_read"
  ON "Media"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "media_prisma_app_all"
  ON "Media"
  FOR ALL
  TO prisma_app
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 7. ContactMessage  (insert-only for public; full access for prisma_app)
-- ---------------------------------------------------------------------------
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message (the website contact form)
CREATE POLICY "contact_public_insert"
  ON "ContactMessage"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only prisma_app (server / admin API) can read or manage messages
CREATE POLICY "contact_prisma_app_all"
  ON "ContactMessage"
  FOR ALL
  TO prisma_app
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 8. Settings  (public read, admin write)
-- ---------------------------------------------------------------------------
ALTER TABLE "Settings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_public_read"
  ON "Settings"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "settings_prisma_app_all"
  ON "Settings"
  FOR ALL
  TO prisma_app
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 9. Product  (public read, admin write)
-- ---------------------------------------------------------------------------
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_public_read"
  ON "Product"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "product_prisma_app_all"
  ON "Product"
  FOR ALL
  TO prisma_app
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 10. ProductImage  (public read, admin write)
-- ---------------------------------------------------------------------------
ALTER TABLE "ProductImage" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_image_public_read"
  ON "ProductImage"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "product_image_prisma_app_all"
  ON "ProductImage"
  FOR ALL
  TO prisma_app
  USING (true)
  WITH CHECK (true);