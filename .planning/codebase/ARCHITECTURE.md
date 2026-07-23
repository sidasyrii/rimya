# Architecture

## Application Structure
- **Pattern:** Standard Next.js App Router pattern (`src/app/`).
- **Rendering:** Heavy use of Client Components (`"use client"`) even for data-fetching pages like `shop`, `category`, and `search`.
- **State Flow:** Global UI state (cart open/close) and persistence (cart items, wishlist, addresses, user auth) are managed by Zustand stores in `src/store/`.

## Data Flow
- **Reads:** Client components use `supabase` client to fetch data on mount (`useEffect`).
- **Writes:** Actions (like adding addresses, placing orders) write to Supabase directly or via Next.js API routes (e.g., Razorpay order creation).
- **Authentication:** Supabase session listener inside `SupabaseProvider.tsx` updates the Zustand `useUserStore`.

## Component Layers
- **UI Components:** Reusable UI atoms in `src/components/ui/` (e.g., `ProductCard`, `Button`, `LoadingSkeleton`).
- **Layout Components:** Shared layout elements in `src/components/layout/` (e.g., `Navbar`, `Footer`).
- **Feature Components:** Domain-specific components like `CartDrawer` and `ProductForm`.
