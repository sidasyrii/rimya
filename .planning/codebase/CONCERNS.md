# Concerns & Technical Debt

## Security
- **Payment Verification:** Razorpay success handler blindly accepts the payment on the client side without verifying the signature via a server webhook/API.
- **RLS Policies:** `orders` and `order_items` tables lack `INSERT` policies, meaning authenticated users cannot currently place orders successfully.
- **Auth Middleware:** Missing Next.js middleware to refresh Supabase session cookies on protected routes.

## Performance & SEO
- **Client Rendering:** E-commerce pages (`/shop`, `/product/[id]`, `/search`) are entirely client-rendered (`"use client"`), which is extremely bad for SEO and initial load times.
- **API Calls:** Supabase clients are re-created inside render bodies (`const supabase = createClient();` inside component functions), causing unnecessary re-renders and potential memory leaks.

## Missing Features / Hardcoded Data
- **Search & Categories:** Results are mocked/hardcoded instead of fetching from the database.
- **Orders Dashboard:** Account page orders tab is completely mocked.
- **Checkout Form:** Address inputs are uncontrolled and not passed to the order creation endpoint.
- **Dead Links:** Footer references 10+ pages (`/contact`, `/shipping`, `/privacy`, etc.) that throw 404s.
