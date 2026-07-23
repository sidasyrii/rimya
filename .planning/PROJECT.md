# Anubandhan

## What This Is

Anubandhan is a premium luxury gift hamper e-commerce platform built with Next.js and Supabase. It allows customers to browse, customize, and purchase curated gift hampers for various occasions, with seamless checkout and payment processing via Razorpay.

## Core Value

Providing a frictionless, premium shopping experience where users can easily find and purchase high-quality gift hampers with reliable payment and order tracking.

## Requirements

### Validated

- ✓ Browse products via homepage, shop, and product detail pages
- ✓ Cart management and checkout UI with Razorpay integration
- ✓ User authentication and basic profile management
- ✓ Admin panel for product catalog management

### Active

- [ ] Fix critical bugs (tax calculation circular dependency, missing `orders` RLS policies)
- [ ] Implement secure server-side Razorpay payment verification
- [ ] Connect mocked UI components (Search, Category pages, Orders Tab, Filter Sidebar) to Supabase
- [ ] Implement Next.js middleware for Supabase session refresh
- [ ] Build out missing static pages (Contact, Shipping, Returns, Privacy, Terms, Track Order, Wishlist)
- [ ] Fix checkout form state (uncontrolled inputs) and persist gift wrapping preference
- [ ] Add product deletion and orders dashboard to Admin panel
- [ ] Improve SEO by converting key e-commerce pages from client-rendered to server-rendered/ISR

### Out of Scope

- [Coupon System] — UI exists but backend implementation is deferred to a future phase to focus on core stability first.
- [Complex Custom Hampers] — Focus is on pre-curated hampers first before building complex "build-your-own" logic.

## Context

- **Technical Environment:** Next.js 16 App Router, Tailwind CSS 4, Zustand, Supabase (Auth, Postgres, Storage), Razorpay.
- **Current State (Brownfield):** The UI is mostly built but relies heavily on mocked data and `"use client"` directives. Core payment flow is insecure (client-side only verification).
- **Known Issues:** Missing RLS policies prevent orders from being placed. 

## Constraints

- **Tech Stack**: Must use Next.js App Router and Supabase.
- **Security**: Payment verification MUST be handled server-side.
- **Data Fetching**: Move away from client-side fetching where SEO is critical (product pages, shop).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Implement server-side Razorpay verification | Client-side verification is insecure and easily bypassed | — Pending |
| Add Supabase auth middleware | Prevents stale tokens on server-side protected routes | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-23 after project initialization*
