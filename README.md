# 🍽️ Qrave Bites

![Render](https://img.shields.io/badge/Deployed%20on-Render-blueviolet?style=for-the-badge&logo=render)
![Bun](https://img.shields.io/badge/Runtime-Bun.js-black?style=for-the-badge&logo=bun)

**Qrave Bites** is a full-stack QR code-based restaurant ordering platform that enables restaurant owners to onboard their restaurants, generate unique table QR codes, and allow customers to scan, order, and pay directly from their smartphones.

---

## 🔗 Live Demo

> 🌐 [https://qrave-bites.onrender.com](https://qrave-bites.onrender.com)

---

## ✨ Features

### 🛍️ For Customers
- Scan QR code at a table to view the menu
- Browse digital menu and add items to cart
- Place orders without staff intervention
- Secure online payment via **Stripe**

### 🍴 For Restaurant Owners
- Register and authenticate via **NextAuth**
- Create and manage restaurants and menu items
- Generate table-specific **QR codes**
- View and manage customer orders

### 🧑‍💻 Admin Experience
- Full control over restaurant, table, and menu management
- Real-time order tracking dashboard
- Automatic QR generation and download

---

## 🛠️ Tech Stack

| Layer        | Technology                        |
|-------------|------------------------------------|
| Frontend     | Next.js, TypeScript, Tailwind CSS |
| Backend      | Next.js API Routes                |
| Runtime      | Bun.js                            |
| Database     | MongoDB, Prisma ORM               |
| Auth         | NextAuth (OAuth/email login)      |
| Payments     | Stripe                            |
| QR Codes     | `qrcode` NPM package              |
| Hosting      | Render                            |

---

## 📁 Project Structure

```
qrave-bites/
├── app/                    # Next.js app directory
├── components/             # Reusable UI components
├── lib/                    # Utility functions (auth, db, Stripe, etc.)
├── prisma/                 # Prisma schema and DB client
├── public/                 # Static assets
├── styles/                 # Tailwind & global CSS
├── types/                  # TypeScript types
├── pages/                  # Custom API routes
└── README.md
```

---

## 📦 Prerequisites

- [Bun](https://bun.sh/docs/installation) runtime installed globally

```bash
curl -fsSL https://bun.sh/install | bash
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Mobeenkhxn01/qrave-bites.git
cd qrave-bites
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root with the following keys:

```env
DATABASE_URL=your_mongodb_connection_string
NEXTMOBEEN_AUTH_SECRET=your_MOBEEN_AUTH_SECRET
NEXTAUTH_URL=https://qrave-bites.onrender.com
MOBEEN_STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLIC_KEY=your_stripe_public
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

> Note: Use `npx` for Prisma commands until full Bun support is available.

### 5. Run the App

```bash
bun run dev
```

Visit `http://localhost:3000` to start using Qrave Bites.

---

## 🖨️ QR Code Example

Each table QR code links to:

```
https://yourdomain.com/restaurant/[restaurantId]/table/[tableId]
```

Customers scanning the QR code are taken to a table-specific digital menu where they can place orders.

---

## 💳 Payments

Integrated with **Stripe Checkout**. Users can pay securely using UPI, card, or other supported methods.

---

## 🔐 Authentication

Implemented using **NextAuth** with support for:
- OAuth Providers (Google, GitHub, etc.)
- Email/password login

---

## 🚀 Deploying on Render

Qrave Bites is fully deployable on [Render](https://render.com/). Here's how:

### 🛠️ Render Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New Web Service"**
3. Connect your GitHub repo and choose the `main` branch
4. Set the **Build Command** to:

```bash
bun install && npx prisma generate && bun run build
```

5. Set the **Start Command** to:

```bash
bun run start
```

6. Add the following **Environment Variables**:

```env
MOBEEN_AUTH_GOOGLE_ID="google client id"
MOBEEN_AUTH_GOOGLE_SECRET="google secret"
MOBEEN_AUTH_SECRET="your auth secret"
MOBEEN_AWS_ACCESS_KEY="your aws access key"
MOBEEN_AWS_BUCKET_NAME="aws bucket name"
MOBEEN_AWS_REGION="aws region"
MOBEEN_AWS_SECRET_KEY="your aws secret key"
DATABASE_URL="mongodb url"
MOBEEN_JWT_SECRET="jwt secret token"
```

7. Hit Deploy!

---

## 🧩 Future Enhancements

- Order status tracking with WebSockets
- Multi-language and accessibility support
- SMS/WhatsApp order notifications
- Restaurant analytics dashboard

---

## 🛡️ License

MIT License. You’re free to use, modify, and deploy this project.

---

## 👨‍💻 Author

Developed with 💚 by [@Mobeenkhxn01](https://github.com/Mobeenkhxn01)

Feel free to open issues or contribute to improve Qrave Bites!
