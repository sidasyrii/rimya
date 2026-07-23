# Requirements: Anubandhan

**Defined:** 2026-07-23
**Core Value:** Providing a frictionless, premium shopping experience where users can easily find and purchase high-quality gift hampers with reliable payment and order tracking.

## v1 Requirements (Phase 1)

These requirements cover the "Phase 1" scope to fix bugs, fill data layer gaps, and polish the application.

### Security & Critical Fixes

- [ ] **SEC-01**: Server-side Razorpay signature verification implemented in `/api/verify-payment`
- [ ] **SEC-02**: `orders` table has `INSERT` RLS policy for authenticated users
- [ ] **SEC-03**: `order_items` table has `INSERT` RLS policy for authenticated users
- [ ] **FIX-01**: Checkout tax calculation logic does not circularly depend on `amount`
- [ ] **FIX-02**: Checkout address form inputs are controlled and data is saved to Supabase

### Auth & Middleware

- [ ] **AUTH-01**: Next.js middleware added to refresh Supabase session cookie on protected routes
- [ ] **AUTH-02**: `SupabaseProvider` memoizes client to prevent infinite re-renders

### Data Layer (Dynamic Content)

- [ ] **DATA-01**: Search page (`/search`) queries Supabase `products` instead of hardcoding
- [ ] **DATA-02**: Category page (`/category/[slug]`) queries Supabase `products` by category
- [ ] **DATA-03**: Orders tab in `/account` fetches actual user orders from Supabase
- [ ] **DATA-04**: Shop page filter sidebar wires state to the product query

### Pages & Routing

- [ ] **PAGE-01**: Implement `/contact` page with form and info
- [ ] **PAGE-02**: Implement `/order-confirmation` page after successful payment
- [ ] **PAGE-03**: Implement standalone `/wishlist` page
- [ ] **PAGE-04**: Implement static pages: `/shipping`, `/returns`, `/privacy`, `/terms`, `/track-order`

### Admin Features

- [ ] **ADM-01**: Add "Delete Product" functionality to Admin Products list
- [ ] **ADM-02**: Create Admin Orders dashboard to view and update order status

### UX Polish & SEO

- [ ] **UX-01**: Cart drawer gift wrapping state is persisted to `useCartStore`
- [ ] **UX-02**: Footer social links use actual SVG icons instead of text placeholders
- [ ] **SEO-01**: `next.config.ts` allows images from Supabase Storage domain
- [ ] **SEO-02**: Key commerce pages (Shop, Product, Home) converted from purely `"use client"` where possible to improve SEO

## v2 Requirements

Deferred to future releases.

### Features

- **FEAT-01**: Backend implementation for Coupon Codes
- **FEAT-02**: Complex "Build-Your-Own" hamper builder interface
- **FEAT-03**: Password Reset flow (`/forgot-password`)
- **FEAT-04**: Newsletter subscription backend

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-vendor support | Complex, beyond the scope of a single-brand luxury store |
| Subscriptions | Not a core priority for gifting; focus on one-off orders first |
| Full Coupon System | UI exists but backend complexity is deferred to v2 to focus on core stability |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEC-01 | Phase 1 | Pending |
| SEC-02 | Phase 1 | Pending |
| SEC-03 | Phase 1 | Pending |
| FIX-01 | Phase 1 | Pending |
| FIX-02 | Phase 1 | Pending |
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| DATA-03 | Phase 1 | Pending |
| DATA-04 | Phase 1 | Pending |
| PAGE-01 | Phase 1 | Pending |
| PAGE-02 | Phase 1 | Pending |
| PAGE-03 | Phase 1 | Pending |
| PAGE-04 | Phase 1 | Pending |
| ADM-01 | Phase 1 | Pending |
| ADM-02 | Phase 1 | Pending |
| UX-01 | Phase 1 | Pending |
| UX-02 | Phase 1 | Pending |
| SEO-01 | Phase 1 | Pending |
| SEO-02 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-23*
*Last updated: 2026-07-23 after project initialization*
