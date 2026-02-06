# Reusable Component Generator (Component Gen)

Generate React + Tailwind components from plain English, preview them live, and iterate via chat.

## Tech stack

- Next.js (App Router) + React
- Tailwind CSS
- OpenAI SDK (server action)
- Supabase Auth (SSR + OAuth callback)
- Prisma + Postgres (projects/components/versions/chat history)

## Setup

### 1) Install dependencies

```bash
pnpm install
```

> Note: `pnpm install` runs `prisma generate` via the `postinstall` script.

### 2) Environment variables

Create a `.env` file in the repo root with:

```bash
# OpenAI (used by the server action)
OPENAI_API_KEY=

# Database (Prisma + Postgres)
DATABASE_URL=

# Supabase (SSR + browser client)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Used for OAuth redirect URL (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3) Run the dev server

```bash
pnpm dev
```

Open http://localhost:3000

## App routes

- `/` — landing page
- `/auth/login` — sign in
- `/auth/signup` — sign up
- `/auth/callback` — OAuth callback (GET)
- `/dashboard` — main app (protected)

## Where to look in the code

- AI generation server action: `app/actions/generateComponent.ts`
- Dashboard UI + orchestration: `app/dashboard/page.tsx`
- Supabase helpers: `utils/supabase/*`
- Prisma helpers (server actions): `lib/prisma-actions.ts`

## Scripts

- `pnpm dev` — run locally
- `pnpm build` — production build
- `pnpm start` — run production server
- `pnpm lint` — lint
