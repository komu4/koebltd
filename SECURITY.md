# KOEB Security Setup

This build keeps all database, Cloudinary, NextAuth, SMTP and encryption credentials server-side.

## Required environment variables

Copy `.env.example` to `.env.local` (or configure the same variables in your hosting provider):

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CONTACT_ENCRYPTION_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD` when seeding
- SMTP variables when email notifications are required

Generate secrets with a cryptographically secure generator, for example:

```bash
openssl rand -base64 32
```

`CONTACT_ENCRYPTION_KEY` must decode to exactly 32 bytes.

## Database security

Run:

```bash
npx prisma migrate deploy
```

The migrations enable row-level security. The browser does not connect directly to Postgres. Prisma remains server-side.

## Existing exposed credentials

If an earlier `.env` file was ever committed to GitHub or shared outside the deployment environment, rotate every credential that was present in it. Removing the file from a new commit does not remove secrets from Git history.

Rotate at minimum:

- Supabase/Postgres database password
- Cloudinary API secret
- NextAuth secret
- SMTP password/API key
- Admin password

## Security checks

```bash
npm run security:secrets
npm run security:scan
```

The dependency audit should be run with network access because `npm audit` requires the npm advisory service.
