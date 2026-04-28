# Qrave Bites

Qrave Bites is a full-stack QR-based restaurant ordering platform built with Next.js App Router.
Customers can scan table QR codes, browse menus, place orders, and pay online. Restaurant owners get a dashboard for menu, orders, inventory, analytics, notifications, billing, and table QR management.

## Tech Stack

- Next.js 16 (App Router, Turbopack in dev)
- React 19 + TypeScript
- Prisma 6 + MongoDB Atlas
- Auth.js / NextAuth v5 (JWT session strategy)
- Stripe (order checkout + subscription billing + webhook handling)
- Pusher (real-time order + notification updates)
- AWS S3 (file/image uploads)
- Tailwind CSS + shadcn/ui
- React Query + Zustand

## Core Modules

- Customer flow: city/restaurant pages, cart, checkout, payment success/cancel
- Admin dashboard: live orders, kitchen display, inventory, menu, table QR, reservation, analytics
- Restaurant onboarding: multi-step partner flow
- Auth: credentials + Google OAuth, role-based access
- Billing: plan subscription checkout + Stripe customer portal

## Monorepo Layout (Important Paths)

```txt
src/
  app/
    (userLayout)/...                 # Customer-facing pages
    (adminLayout)/dashboard/...      # Protected owner/admin dashboard
    api/.../route.ts                 # API routes
  components/                        # Shared UI + feature components
  hooks/                             # Custom hooks
  lib/                               # Auth, Prisma, Stripe, Pusher, validators, utils
  providers/                         # Client providers
  proxy.ts                           # Dashboard route protection middleware
prisma/
  schema.prisma                      # MongoDB data model
```

## Prerequisites

- Node.js 20+ recommended
- pnpm (project lockfile is `pnpm-lock.yaml`)
- MongoDB Atlas database
- Stripe account
- Pusher account
- AWS account with S3 bucket
- Google OAuth app

## Quick Start

1) Clone and install

```bash
git clone <your-repo-url>
cd qrave-bites
pnpm install
```

2) Create env file

- Copy `.env.example` if available, otherwise create `.env` locally.
- Add all variables listed in the Environment Variables section below.

3) Generate Prisma client

```bash
pnpm prisma generate
```

4) Sync schema (MongoDB)

```bash
pnpm prisma db push
```

5) Start development server

```bash
pnpm dev
```

6) Verify

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Available Scripts

- `pnpm dev` - Start Next.js dev server with Turbopack
- `pnpm build` - Production build
- `pnpm start` - Start production server
- `pnpm lint` - ESLint checks
- `pnpm postinstall` - Auto-runs `prisma generate`

## Environment Variables

Use placeholder values, never commit real secrets.

### Required

```env
# App/Auth
AUTH_SECRET=replace_with_a_long_random_secret
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority

# Google Auth
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Stripe
MOBEEN_STRIPE_SECRET_KEY=sk_test_or_live_...
MOBEEN_STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
# Optional if used in UI/pricing logic
STRIPE_PRICE_PRO=price_...

# Pusher
NEXT_PUBLIC_PUSHER_KEY=your_public_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap2
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=ap2

# AWS S3 Upload
MOBEEN_AWS_REGION=ap-southeast-2
MOBEEN_AWS_ACCESS_KEY=your_access_key
MOBEEN_AWS_SECRET_KEY=your_secret_key
MOBEEN_AWS_BUCKET_NAME=your_bucket_name

# Maps / geocoding
NEXT_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_key
```

### Optional / Compatibility

```env
# Some code paths still reference this name
MOBEEN_NEXT_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_key
```

## Authentication and Access Control

- Auth.js config is in `src/lib/auth.ts`.
- Session strategy is JWT.
- Dashboard protection is enforced in `src/proxy.ts` for `/dashboard` routes.
- Middleware checks:
  - authenticated token
  - role must be `ADMIN` or `RESTAURANT_OWNER`
  - `restaurantStatus` must be `APPROVED`
  - trial/subscription gating for billing access

If dashboard redirects to login in production but not localhost, verify:
- `AUTH_SECRET` is set correctly in deployment
- `AUTH_URL` matches deployed domain
- HTTPS/cookie behavior is correct for deployed host

## Database (Prisma + MongoDB)

- Provider: MongoDB (`prisma/schema.prisma`)
- Prisma client generator includes `binaryTargets = ["native", "rhel-openssl-3.0.x"]` for local + common Linux deploy compatibility.
- Typical workflow:

```bash
pnpm prisma generate
pnpm prisma db push
pnpm prisma studio
```

## Stripe Integration

- Order checkout endpoint: `src/app/api/checkout/route.ts` and `src/app/api/stripe/checkout-order/route.ts`
- Subscription checkout endpoint: `src/app/api/stripe/checkout-subscribe/route.ts`
- Customer portal endpoint: `src/app/api/stripe/portal/route.ts`
- Session lookup endpoint: `src/app/api/stripe/session/[sessionId]/route.ts`
- Webhook handler: `src/app/api/stripe/webhook/route.ts`

### Local webhook testing

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Then set `MOBEEN_STRIPE_WEBHOOK_SECRET` from the CLI output.

## Real-time Events (Pusher)

- Server config: `src/lib/pusher.ts`
- Client config: `src/lib/pusher-client.ts`
- Provider: `src/providers/PusherProvider.tsx`
- Used for live dashboard updates and notifications.

## File Uploads (AWS S3)

- Upload API: `src/app/api/upload/route.ts`
- Requires valid IAM credentials and S3 bucket access policy.

## API Surface (Current Route Files)

- Auth: `/api/auth/[...nextauth]`, `/api/login`, `/api/register`
- User/profile: `/api/profile`, `/api/users`
- Restaurant onboarding: `/api/restaurant/step1..step4`, `/api/restaurant/me`, `/api/restaurants`
- Menu/category/inventory: `/api/menu-items`, `/api/categories`, `/api/inventory`
- Cart/orders/kitchen: `/api/cart`, `/api/orders`, `/api/kds/orders`, `/api/kds/items`
- Analytics/notifications: `/api/analytics`, `/api/analytics/revenue`, `/api/notifications`
- Table QR: `/api/table-qr`
- Stripe: `/api/stripe/*`
- Upload: `/api/upload`

## Deployment (Vercel Recommended)

1. Import repo in Vercel.
2. Set all environment variables (Production + Preview as needed).
3. Ensure MongoDB Atlas network access allows your deployment environment.
4. Configure Google OAuth callback URL(s) for deployed domain.
5. Configure Stripe webhook endpoint:
   - `https://<your-domain>/api/stripe/webhook`
6. Deploy and validate:
   - Login
   - Dashboard access
   - Cart/checkout
   - Webhook events

## Troubleshooting

### Prisma connection errors during build

If you see `PrismaClientInitializationError` with DNS/network messages:
- validate `DATABASE_URL`
- check DNS/network reachability to MongoDB Atlas
- check Atlas IP/network access rules

### Redirect loop to `/login` from `/dashboard`

- verify `AUTH_SECRET` and `AUTH_URL` in deployment
- confirm cookies are set for the same host/domain
- confirm user role and restaurant approval status in DB

### Stripe checkout errors

- verify `MOBEEN_STRIPE_SECRET_KEY`
- verify `STRIPE_PRICE_BASIC` exists and is active in Stripe
- verify `NEXT_PUBLIC_APP_URL`/`AUTH_URL` match active environment

## Security Notes

- Never commit `.env` files with real keys.
- Rotate any leaked credentials immediately.
- Use least-privilege IAM policy for S3 access.
- Restrict webhook endpoints and verify signatures.

## Contributing

1. Create a feature branch
2. Implement changes with tests/checks
3. Run:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

4. Open a PR

## License

MIT (or your chosen project license).