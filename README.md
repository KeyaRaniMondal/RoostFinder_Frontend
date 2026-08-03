# 🏠 RoostFinder

A modern rental property marketplace UI built with **Next.js 15**, **React 19**, and **Tailwind CSS 4**. RoostFinder connects tenants with landlords — browse listings, request to rent, pay securely via Stripe, and leave reviews.


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
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

This is used by `next.config.ts` to proxy all `/api/:path*` requests to the backend, so the browser never calls the API directly (no CORS setup needed).

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
frontend/
├── next.config.ts              # Rewrites /api/:path* → backend
├── src/
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
│   └── lib/
│       └── api.ts               # Authenticated fetch wrapper (get/post/put/patch/delete)
```

---

## 🔌 API Integration

The browser **never calls the backend directly** — every request goes through the Next.js rewrite proxy (`/api/:path*` → `${NEXT_PUBLIC_BACKEND_URL}/api/:path*`), avoiding CORS entirely. Server components use `serverFetch` to call the backend directly during SSR.

**Auth:** the access token is sent as `Authorization: Bearer <token>` by `lib/api.ts`; the backend also accepts an `accessToken` httpOnly cookie.

**Response envelope:** every backend response follows `{ success, statusCode, message, data, meta? }`. The `api.ts` / `serverFetch` helpers unwrap `.data` (and combine `data` + `meta` into a `Paginated<T>` type for list endpoints).

**Data layer:** every endpoint is wrapped by a hook in `src/hooks/*` using TanStack React Query for caching, invalidation, and loading/error state.

### Endpoint Map

| Area | Endpoint | Auth | Frontend Hook / Page |
|---|---|---|---|
| **Auth** | `POST /api/auth/register` | — | `use-auth.tsx` → `app/auth/register` |
| | `POST /api/auth/login` | — | `use-auth.tsx` → `app/auth/login` |
| | `POST /api/auth/refresh-token` | — | Reserved for API clients (not used by UI) |
| | `GET /api/auth/me` | any | `use-auth.tsx` (`refreshMe`) on app mount |
| **Categories** | `GET /api/categories` | — | `useCategories` → `filter-sidebar.tsx` |
| **Properties** | `GET /api/properties` | — | `useProperties`, `useLandlordProperties` → listings + SSR home |
| | `GET /api/properties/:id` | — | `useProperty` → property detail, landlord edit |
| | `POST /api/properties` | Landlord, Admin | `useCreateProperty` → new property form |
| | `PUT /api/properties/:id` | Landlord, Admin | `useUpdateProperty` → edit property |
| | `DELETE /api/properties/:id` | Landlord, Admin | `useDeleteProperty` |
| **Landlord** | `POST /api/landlord` | any | `useCreateLandlordProfile` |
| | `GET /api/landlord/me` | any | `useMyLandlordProfile` |
| | `PATCH /api/landlord/me` | any | `useUpdateLandlordProfile` |
| | `GET /api/landlord/requests` | Landlord, Admin | `useLandlordRequests` |
| | `PATCH /api/landlord/requests/:id` | Landlord, Admin | `useUpdateRentalRequestStatus` |
| **Rentals** | `POST /api/rentals` | tenant | `useCreateRentalRequest` → `request-rent-modal.tsx` |
| | `GET /api/rentals` | any | `useMyRentalRequests` → tenant dashboard |
| | `GET /api/rentals/:id` | any | `useRentalRequest` → payment page |
| **Payments** | `POST /api/payments/create` | any | `useCreatePaymentSession` → Stripe Checkout |
| | `POST /api/payments/confirm` | any | `useConfirmPayment` → `payments/success` |
| | `GET /api/payments` | any | `useMyPayments` → tenant dashboard |
| | `GET /api/payments/:id` | any | Not used (detail available on list payloads) |
| | `POST /api/payments/webhook` | Stripe signature | Backend-only |
| **Admin** | `GET /api/admin/users` | Admin | `useAdminUsers` |
| | `PATCH /api/admin/users/:id` | Admin | `useUpdateUserStatus` |
| | `GET /api/admin/properties` | Admin | `useAdminProperties` |
| | `GET /api/admin/rentals` | Admin | `useAdminRentals` |
| **Reviews** | `POST /api/reviews` | Tenant | `useCreateReview` → `review-dialog.tsx` |
| | `GET /api/reviews/my-reviews` | Tenant | `useMyReviews` → tenant dashboard |
| | `GET /api/reviews/property/:propertyId` | — | `usePropertyReviews` → `review-section.tsx` |
| | `DELETE /api/reviews/:id` | Tenant | `useDeleteReview` |

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
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Fork the repo and create a feature branch
2. Follow the existing hook/component conventions in `src/hooks` and `src/components`
3. Run `npm run lint` before opening a PR
4. Submit a pull request with a clear description of the change

---

## 📄 License

This project is private and unlicensed for public distribution.