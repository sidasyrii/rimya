# External Integrations

## Supabase
- **Authentication:** Email/Password and Google OAuth. Client logic in `src/utils/supabase/client.ts` and `src/utils/supabase/server.ts`.
- **Database:** Direct PostgreSQL queries using `@supabase/supabase-js`.
- **Storage:** Uses a bucket named `product-images` for product gallery images.
- **Row Level Security (RLS):** Extensive use of RLS for data protection (e.g. users can only view their own orders/addresses; admins can modify products).

## Razorpay
- **Payments:** Integrated for processing checkout transactions.
- **Client implementation:** Dynamic script injection in `src/app/checkout/page.tsx` (`<Script src="https://checkout.razorpay.com/v1/checkout.js" />`).
- **Server implementation:** Order creation handled in `src/app/api/create-order/route.ts` via the `razorpay` npm package.

## Unsplash
- **Images:** Image placeholders currently rely on `images.unsplash.com` (allowed via `next.config.ts`).
