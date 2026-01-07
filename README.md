# 🍽️ Qrave Bites

![Next.js](https://img.shields.io/badge/Next.js-15/16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-v6-2D3748?style=for-the-badge&logo=prisma)

**Qrave Bites** is a full-stack QR code-based restaurant ordering platform with real-time order updates, secure payments, and comprehensive restaurant management. Customers scan QR codes at tables to browse menus, place orders, and pay instantly. Restaurant owners get a powerful dashboard to manage operations.

---

## 🔗 Live Demo

> 🌐 [https://qrave-bites.vercel.app](https://qrave-bites.vercel.app)

---

## ✨ Core Features

### 🛍️ For Customers
- **QR Code Scanning** - Instant menu access via table-specific QR codes
- **Digital Menu** - Browse items with images stored on AWS S3
- **Smart Cart** - Add/remove items with real-time updates via Pusher
- **Secure Payments** - Stripe integration for UPI, cards, and digital wallets
- **Order Tracking** - Real-time order status updates

### 🍴 For Restaurant Owners
- **Restaurant Management** - Create, edit, and manage multiple restaurants
- **Menu Management** - Add/update menu items with image uploads to AWS S3
- **Table Management** - Generate and manage table-specific QR codes
- **Orders Dashboard** - Real-time order tracking with Pusher notifications
- **Analytics** - View order history and restaurant performance

### 🔐 Authentication & Security
- **Auth.js (NextAuth v5)** - OAuth (Google, GitHub) and email/password login
- **Role-Based Access** - Customer and restaurant owner roles
- **Secure API Routes** - Protected endpoints with session validation
- **Zod Validation** - Type-safe request/response validation

---

## 🛠️ Tech Stack

| Layer           | Technology                                    |
|-----------------|-----------------------------------------------|
| **Framework**   | Next.js 15/16, TypeScript, React 19           |
| **Styling**     | Tailwind CSS, shadcn/ui components            |
| **State Mgmt**  | Zustand, TanStack Query (React Query)         |
| **Database**    | MongoDB, Prisma ORM v6                        |
| **Auth**        | Auth.js (NextAuth v5), OAuth providers        |
| **Payments**    | Stripe API, Stripe Checkout                   |
| **Real-time**   | Pusher (WebSockets for live updates)          |
| **Storage**     | AWS S3 for images                             |
| **Validation**  | Zod schema validation                         |
| **HTTP Client** | Axios                                         |
| **Hosting**     | Vercel                                        |

---

## 📁 Project Structure

```
qrave-bites/
├── app/                          # Next.js app directory (App Router)
│   ├── api/                      # API routes & webhooks
│   │   ├── auth/                 # Auth.js configuration
│   │   ├── orders/               # Order management endpoints
│   │   ├── restaurants/          # Restaurant management
│   │   ├── menu/                 # Menu management
│   │   ├── stripe/               # Stripe webhooks
│   │   └── pusher/               # Pusher auth & triggers
│   ├── (auth)/                   # Auth pages (login, register)
│   ├── dashboard/                # Protected owner dashboard
│   ├── [city]/                   # Dynamic city routes
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard/                # Dashboard components
│   ├── menu/                     # Menu components
│   └── common/                   # Shared components
├── lib/
│   ├── auth.ts                   # Auth.js configuration
│   ├── db.ts                      # Prisma client singleton
│   ├── prisma.ts                 # Prisma utilities
│   ├── stripe.ts                 # Stripe client setup
│   ├── pusher.ts                 # Pusher client setup
│   ├── aws.ts                    # AWS S3 client setup
│   ├── axios-instance.ts         # Axios with interceptors
│   └── validations/              # Zod schemas
├── store/                         # Zustand stores
│   ├── cartStore.ts              # Shopping cart state
│   ├── authStore.ts              # Auth state
│   └── orderStore.ts             # Order state
├── hooks/                         # Custom React hooks
│   ├── useAuth.ts                # Auth hook
│   ├── useCart.ts                # Cart management
│   └── usePusher.ts              # Real-time subscriptions
├── types/                         # TypeScript interfaces
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── public/                        # Static assets
└── env.ts                         # Environment validation
```

---

## 📦 Prerequisites

- **Node.js** 18+ or **Bun** (latest)
- **MongoDB** Atlas account (free tier available)
- **Stripe** account (for payments)
- **AWS Account** (for S3 storage)
- **Pusher** account (free tier available)
- **OAuth Providers** (Google/GitHub apps configured)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Mobeenkhxn01/qrave-bites.git
cd qrave-bites
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with all required variables:

```env
# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/qrave-bites?retryWrites=true&w=majority

# NextAuth / Auth.js
AUTH_SECRET=your_randomly_generated_secret_key_min_32_chars
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
AUTH_GOOGLE_ID=your_google_oauth_client_id
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret
AUTH_GITHUB_ID=your_github_oauth_client_id
AUTH_GITHUB_SECRET=your_github_oauth_client_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# AWS S3
NEXT_PUBLIC_AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
NEXT_PUBLIC_AWS_S3_BUCKET_NAME=your_s3_bucket_name

# Pusher
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
PUSHER_APP_ID=your_pusher_app_id
PUSHER_SECRET=your_pusher_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Generate Prisma Client

```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
# or
bun run dev
```

Visit `http://localhost:3000` to start exploring Qrave Bites.

---

## 🚀 Deployment on Vercel

### Step-by-Step Guide

1. **Push to GitHub** - Ensure your code is on GitHub

2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `main` branch

3. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Build Command**:
     ```bash
     npm ci && npx prisma generate && npm run build
     ```
   - **Output Directory**: `.next`
   - **Install Command**: `npm ci`

4. **Add Environment Variables** in Vercel Project Settings:

```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/qrave-bites
AUTH_SECRET=your_secure_random_key_32_chars_minimum
AUTH_URL=https://qrave-bites.vercel.app
NEXTAUTH_URL=https://qrave-bites.vercel.app

AUTH_GOOGLE_ID=your_google_oauth_id
AUTH_GOOGLE_SECRET=your_google_oauth_secret
AUTH_GITHUB_ID=your_github_oauth_id
AUTH_GITHUB_SECRET=your_github_oauth_secret

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

NEXT_PUBLIC_AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
NEXT_PUBLIC_AWS_S3_BUCKET_NAME=your_bucket_name

NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=mt1
PUSHER_APP_ID=your_pusher_app_id
PUSHER_SECRET=your_pusher_secret

NEXT_PUBLIC_APP_URL=https://qrave-bites.vercel.app
NODE_ENV=production
```

5. **Deploy** - Click "Deploy" button

6. **Configure Stripe Webhook**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.vercel.app/api/stripe/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

---

## 📊 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/restaurants` | Get all restaurants |
| `POST` | `/api/restaurants` | Create restaurant (owner only) |
| `GET` | `/api/restaurants/[id]/menu` | Get restaurant menu |
| `POST` | `/api/orders` | Create order |
| `GET` | `/api/orders/[id]` | Get order details |
| `PATCH` | `/api/orders/[id]` | Update order status |
| `POST` | `/api/stripe/checkout` | Initiate Stripe checkout |

---

## 🧩 Future Enhancements

- **Advanced Analytics** - Order analytics, revenue reports, peak hours
- **Multi-language Support** - Internationalization (i18n)
- **SMS/WhatsApp Notifications** - Real-time order updates via messaging
- **Mobile App** - React Native companion app
- **Inventory Management** - Stock tracking for menu items
- **Kitchen Display System (KDS)** - Large display for kitchen staff
- **Customer Ratings & Reviews** - Feedback system
- **Loyalty Program** - Points and rewards

---

## 🛡️ License

MIT License. See LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 Author

Developed with 💚 by [@Mobeenkhxn01](https://github.com/Mobeenkhxn01)

For issues, questions, or suggestions, please open an [issue](https://github.com/Mobeenkhxn01/qrave-bites/issues) or [discussion](https://github.com/Mobeenkhxn01/qrave-bites/discussions).

---

## 📞 Support

Need help? Check out:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Auth.js Documentation](https://authjs.dev)
- [Stripe Documentation](https://stripe.com/docs)
- [Pusher Documentation](https://pusher.com/docs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)