# 🏠 RoostFinder

A modern rental property marketplace UI built with **Next.js 15**, **React 19**, and **Tailwind CSS 4**. RoostFinder connects tenants with landlords — browse listings, request to rent, pay securely via Stripe, and leave reviews.


---
**Home Page**
![Home page](<public/assets/roostfinderfrontend.vercel.app_.png>)

---

# 🔗 Live Links

### 🌐 Live Website
<p>
  <a href="https://roostfinderfrontend.vercel.app/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit-success?style=for-the-badge">
  </a>
</p>

### Github Repository Backend
<p>
  <a href="https://github.com/KeyaRaniMondal/RoostFinder">
    <img src="https://img.shields.io/badge/GitHub-blue?style=for-the-badge&logo=github">
  </a>
</p>

---
## ✨ Features

- 🔍 **Browse & filter** properties by search term, price range, type, and purpose
- 📝 **Rental requests** — tenants request to rent, landlords approve/reject
- 💳 **Stripe Checkout** payments with webhook-backed confirmation
- ⭐ **Reviews** for completed rentals
- 🧑‍💼 **Role-based dashboards** for Tenants, Landlords, and Admins
- 🔐 **JWT auth** via `Authorization: Bearer` header or httpOnly cookie
- ⚡ **React Query** data layer with typed hooks for every endpoint

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) + `tw-animate-css` |
| Components | [shadcn](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/) primitives |
| Icons | [Phosphor Icons](https://phosphoricons.com/) & [Lucide](https://lucide.dev/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation |
| Data Fetching | [TanStack React Query](https://tanstack.com/query) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Language | TypeScript |

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18.18+**
- The RoostFinder backend API running (default: `http://localhost:5000`)

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd roostfinder_frontend

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

This is used by `next.config.ts` to proxy all `/api/:path*` requests to the backend, so the browser never calls the API directly (no CORS setup needed).

### Development

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
pnpm run build
```
---

## 📁 Project Structure

```
roostfinder_frontend/
├── next.config.ts              # Rewrites /api/:path* → backend
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/                # login, register
│   │   ├── properties/          # listing + detail pages
│   │   ├── payments/success/    # Stripe redirect handler
│   │   └── dashboard/
│   │       ├── tenant/          # requests, payments, reviews
│   │       ├── landlord/        # properties, requests, profile
│   │       └── admin/           # users, properties, rentals
│   ├── components/
│   │   ├── forms/               # property-form, etc.
│   │   ├── properties/          # filter-sidebar, review-section, request-rent-modal
│   │   └── dashboard/           # review-dialog, etc.
│   ├── hooks/                   # React Query hooks (one per resource)
│   │   ├── use-auth.tsx
│   │   └── use-properties.ts
│   │── lib/
│   │    └── api.ts               # Authenticated fetch wrapper (get/post/put/patch/delete)
│   │──types 
│       └──index.ts

```
---

## 🔌 API Integration

To view the complete API Integration workflow visit (default: `https://github.com/KeyaRaniMondal/RoostFinder_Frontend/blob/main/API_INTEGRATION.md`)

### Key User Flows

**Browse & filter**
`GET /api/properties` (paginated, React Query) + `GET /api/categories`

**Request to rent**
`POST /api/rentals` → landlord reviews via `GET /api/landlord/requests` → `PATCH /api/landlord/requests/:id` (approve/reject)

**Pay for a rental**
`POST /api/payments/create` (Stripe Checkout session) → `GET /api/rentals/:id` → redirect to Stripe → return to `/payments/success` → `POST /api/payments/confirm`, with `POST /api/payments/webhook` as the reliable server-side fallback

**Leave a review**
`POST /api/reviews` (after rental is ACTIVE/COMPLETED) → manage via `GET /api/reviews/my-reviews`, display publicly via `GET /api/reviews/property/:propertyId`, remove via `DELETE /api/reviews/:id`

---

## 📜 Scripts

| Command | Description |
|---|---|
| `pnpm run build` | Build for production |
| `pnpm dev` | Start the development server |

---

## 🤝 Contributing

1. Fork the repo and create a feature branch
2. Follow the existing hook/component conventions in `/hooks` and `/components`
4. Submit a pull request with a clear description of the change


