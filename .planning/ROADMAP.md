# Roadmap

**Project:** Anubandhan
**Created:** 2026-07-23

## Phase 1: Security & Critical Fixes
**Goal:** Fix security vulnerabilities and critical blocking bugs.
- [ ] SEC-01: Server-side Razorpay signature verification
- [ ] SEC-02: `orders` table has `INSERT` RLS policy
- [ ] SEC-03: `order_items` table has `INSERT` RLS policy
- [ ] FIX-01: Checkout tax calculation logic
- [ ] FIX-02: Checkout address form inputs control
- [ ] AUTH-01: Next.js middleware for Supabase session refresh
- [ ] AUTH-02: `SupabaseProvider` memoizes client

## Phase 2: Data Layer Integration
**Goal:** Connect hardcoded mock components to real Supabase data.
- [ ] DATA-01: Search page queries Supabase
- [ ] DATA-02: Category page queries Supabase
- [ ] DATA-03: Orders tab fetches real orders
- [ ] DATA-04: Shop page filter sidebar wires state

## Phase 3: Missing Pages & Admin Features
**Goal:** Build out missing static pages and admin functionality.
- [ ] PAGE-01: `/contact` page
- [ ] PAGE-02: `/order-confirmation` page
- [ ] PAGE-03: `/wishlist` page
- [ ] PAGE-04: Static pages (`/shipping`, `/returns`, etc.)
- [ ] ADM-01: "Delete Product" in Admin
- [ ] ADM-02: Admin Orders dashboard

## Phase 4: UX Polish & SEO
**Goal:** Polish the user experience and optimize for search engines.
- [ ] UX-01: Cart drawer gift wrapping state persistence
- [ ] UX-02: Footer social links SVG icons
- [ ] SEO-01: `next.config.ts` allows images from Supabase
- [ ] SEO-02: Convert key e-commerce pages from client-rendered to server-rendered/ISR

---
*Last updated: 2026-07-23*
