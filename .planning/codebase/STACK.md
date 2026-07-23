# Tech Stack

## Core Technologies
- **Framework:** Next.js 16.2.10 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.0.0
- **State Management:** Zustand (v5)

## Dependencies & Packages
- `lucide-react`: Icon set
- `framer-motion`: Animations and transitions
- `@supabase/ssr` / `@supabase/supabase-js`: Supabase integration
- `razorpay`: Payment gateway SDK

## Data & Database
- **Database:** PostgreSQL (hosted on Supabase)
- **Schema Management:** Raw SQL scripts (`supabase_schema.sql`, `supabase_admin_patch.sql`, `supabase_account_migration.sql`)
- **Key Tables:** `profiles`, `products`, `orders`, `order_items`, `user_addresses`

## Build & Environment
- **Node Environment:** Standard Next.js server/client environments
- **Config:** `next.config.ts` (configured with allowed image domains)
