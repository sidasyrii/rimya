# Conventions

## Code Style
- **Components:** Functional components using `function` keyword (e.g., `export function ComponentName()`).
- **Styling:** Tailwind CSS utility classes used heavily inline.
- **Client/Server Components:** Widespread use of `"use client"` at the top of pages that need reactivity or use Zustand stores.

## State Management
- **Zustand Patterns:** Stores export a single hook (e.g., `useCartStore`). Some use `persist` middleware (`cart`, `wishlist`, `address`) for `localStorage` persistence.

## Error Handling
- Minimal error boundaries.
- Supabase fetch errors generally log to console or return empty UI states (e.g. `No products found`).
