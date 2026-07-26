# D'Magical Touch Empire

Production-ready multi-page website built with Vite, TypeScript, Vercel Functions, Neon Postgres, and Resend.

## Local development

1. Install Node.js 24.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and supply development values.
4. Run `npm run dev`.

The static pages work locally. Vercel Functions are available after deployment or through the Vercel development environment.

## Database

Create a Neon project and execute `database/001_initial.sql` in the Neon SQL editor.

## Vercel environment variables

- `DATABASE_URL` — Neon pooled connection string.
- `RATE_LIMIT_SALT` — a long random secret used only to hash rate-limit identifiers.
- `RESEND_API_KEY` — Resend API key. When omitted, form submissions still persist and their notification status is `not_configured`.
- `CONTACT_TO_EMAIL` — staff inbox receiving contact notifications.
- `RESEND_FROM_EMAIL` — verified Resend sender; the Resend testing sender can be used during initial setup.
- `ALLOWED_ORIGINS` — optional comma-separated additional origins.

Run `npm run check` before deployment.
