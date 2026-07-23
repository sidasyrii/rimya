# Directory Structure

## Root
- `e:\rimya\`
  - `src/` — Main source code directory
  - `supabase_schema.sql` — DB schema
  - `next.config.ts`, `package.json`, `tailwind.config.ts` — Configs

## `src/` Layout
- `app/` — Next.js App Router routes
  - `api/` — API Routes (e.g., `create-order`)
  - `admin/` — Admin panel routes
  - `shop/`, `product/`, `checkout/`, `account/`, `login/` — Main frontend routes
  - `auth/callback/` — Supabase auth redirect handler
- `components/` — React components
  - `ui/` — Base UI atoms
  - `layout/` — Navbar, Footer
  - `cart/`, `admin/`, `seo/` — Domain components
  - `SupabaseProvider.tsx`, `theme-provider.tsx` — Global providers
- `store/` — Zustand state modules
  - `useCartStore.ts`, `useUserStore.ts`, `useAddressStore.ts`, `useUIStore.ts`, `useWishlistStore.ts`
- `utils/` — Helpers and clients
  - `supabase/client.ts`, `supabase/server.ts` — Supabase initialization
- `lib/` — Utility functions
