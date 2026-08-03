# RoostFinder — API Integration 

**frontend components → backend endpoints**. Backend is an Express 5 API
(root, port `5000`); frontend is Next.js 15 (app, port `3000`).

## Conventions

- **Proxy**: the browser never calls the backend directly. `frontend/next.config.ts` rewrites
  every `/api/:path*` request to `${NEXT_PUBLIC_BACKEND_URL}/api/:path*` (no CORS). Server
  components fetch the backend directly via `serverFetch`.
- **Auth**: access token is sent as `Authorization: Bearer <token>` by `frontend/src/lib/api.ts`
  (`api.get/post/put/patch/delete`). Backend `auth()` middleware also accepts the `accessToken`
  httpOnly cookie.
- **Envelope**: all responses are `{ success, statusCode, message, data, meta? }`. The frontend
  helpers (`api.ts` / `serverFetch`) unwrap `.data` (and pair `data` + `meta` into `Paginated<T>`).
- **Client data layer**: `frontend/src/hooks/*` wraps every endpoint with TanStack React Query.

| Area | Backend endpoint | Auth | Frontend consumer |
|---|---|---|---|
| Auth | `POST /api/auth/register` | — | `hooks/use-auth.tsx` (`register`) → `app/auth/register/page.tsx` |
| Auth | `POST /api/auth/login` | — | `hooks/use-auth.tsx` (`login`) → `app/auth/login/page.tsx` |
| Auth | `POST /api/auth/refresh-token` | — | Not used by the UI (access token is the session); kept for API clients |
| Auth | `GET /api/auth/me` | any | `hooks/use-auth.tsx` (`refreshMe`) on app mount |
| Categories | `GET /api/categories` | — | `hooks/use-properties.ts` (`useCategories`) → `components/properties/filter-sidebar.tsx` (type filter) |
| Properties | `GET /api/properties` (`searchTerm,minPrice,maxPrice,propertyType,purpose,page,limit`) | — | `hooks/use-properties.ts` (`useProperties`, `useLandlordProperties`) → `app/properties/page.tsx`, `app/page.tsx` (SSR), landlord dashboards |
| Properties | `GET /api/properties/:id` | — | `hooks/use-properties.ts` (`useProperty`) + `serverFetch` → `app/properties/[id]/page.tsx`, landlord edit page |
| Properties | `POST /api/properties` | Landlord, Admin | `useCreateProperty` → `app/dashboard/landlord/properties/new/page.tsx` via `components/forms/property-form.tsx` |
| Properties | `PUT /api/properties/:id` | Landlord, Admin | `useUpdateProperty` → `app/dashboard/landlord/properties/[id]/edit/page.tsx` |
| Properties | `DELETE /api/properties/:id` | Landlord, Admin | `useDeleteProperty` → landlord dashboard + properties pages |
| Landlord | `POST /api/landlord` | any | `useCreateLandlordProfile` → `app/dashboard/landlord/profile/page.tsx` |
| Landlord | `GET /api/landlord/me` | any | `useMyLandlordProfile` → landlord dashboard/profile pages |
| Landlord | `PATCH /api/landlord/me` | any | `useUpdateLandlordProfile` → landlord profile page |
| Landlord | `GET /api/landlord/requests` | Landlord, Admin | `useLandlordRequests` → landlord dashboard + `app/dashboard/landlord/requests/page.tsx` |
| Landlord | `PATCH /api/landlord/requests/:id` | Landlord, Admin | `useUpdateRentalRequestStatus` → `app/dashboard/landlord/requests/page.tsx` |
| Rentals | `POST /api/rentals` (`{ propertyId, move_in_date?, message? }`) | any (tenant) | `useCreateRentalRequest` → `components/properties/request-rent-modal.tsx` |
| Rentals | `GET /api/rentals` | any | `useMyRentalRequests` → tenant dashboard + `app/dashboard/tenant/requests/page.tsx` |
| Rentals | `GET /api/rentals/:id` | any | `useRentalRequest` → `app/dashboard/tenant/requests/[id]/pay/page.tsx` |
| Payments | `POST /api/payments/create` (`{ rentalRequestId }`) → `{ payment, checkoutUrl }` | any | `useCreatePaymentSession` → `app/dashboard/tenant/requests/[id]/pay/page.tsx` |
| Payments | `POST /api/payments/confirm` (`{ stripeSessionId }`) | any | `useConfirmPayment` → `app/payments/success/page.tsx` |
| Payments | `GET /api/payments` | any | `useMyPayments` → tenant dashboard + `app/dashboard/tenant/payments/page.tsx` |
| Payments | `GET /api/payments/:id` | any | Not consumed by the UI (detail is available on the rental request / list payloads) |
| Payments | `POST /api/payments/webhook` | Stripe signature | Backend-only (Stripe events), raw-body route in `src/app.ts` |
| Admin | `GET /api/admin/users` (`searchTerm,role,activeStatus,page,limit`) | Admin | `useAdminUsers` → admin dashboard + `app/dashboard/admin/users/page.tsx` |
| Admin | `PATCH /api/admin/users/:id` (`{ activeStatus }`) | Admin | `useUpdateUserStatus` → `app/dashboard/admin/users/page.tsx` |
| Admin | `GET /api/admin/properties` | Admin | `useAdminProperties` → admin dashboard + `app/dashboard/admin/properties/page.tsx` |
| Admin | `GET /api/admin/rentals` | Admin | `useAdminRentals` → admin dashboard + `app/dashboard/admin/rentals/page.tsx` |
| Reviews | `POST /api/reviews` (`{ rentalRequestId, rating, comment? }`) | Tenant | `useCreateReview` → `components/dashboard/review-dialog.tsx` |
| Reviews | `GET /api/reviews/my-reviews` | Tenant | `useMyReviews` → `app/dashboard/tenant/page.tsx` |
| Reviews | `GET /api/reviews/property/:propertyId` | — | `usePropertyReviews` → `components/properties/review-section.tsx` |
| Reviews | `DELETE /api/reviews/:id` | Tenant | `useDeleteReview` → `app/dashboard/tenant/page.tsx` |

## Key flows

- **Browse & filter** → `GET /api/properties` (React Query, paginated) + `GET /api/categories`.
- **Request to rent** → `POST /api/rentals` → landlord sees it via `GET /api/landlord/requests` →
  `PATCH /api/landlord/requests/:id` approve/reject.
- **Pay** → `POST /api/payments/create` (Stripe Checkout) → `GET /api/rentals/:id` →
  redirect to Stripe → back on `/payments/success` → `POST /api/payments/confirm`;
  `POST /api/payments/webhook` is the reliable fallback.
- **Review** → `POST /api/reviews` (after ACTIVE/COMPLETED) → `GET /api/reviews/my-reviews`
  (manage) and `GET /api/reviews/property/:propertyId` (public), `DELETE /api/reviews/:id`.
