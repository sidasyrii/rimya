-- ==========================================
-- UNIFIED ADMIN PANEL SUPABASE SETUP SCRIPT
-- ==========================================
-- This script safely applies all necessary schema changes, 
-- columns, tables, and RLS policies for the Admin Panel.
-- You can run this entire script safely multiple times.

-- 1. PROFILES & ADMIN ROLE
-- ------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- Helper function to check admin status without causing infinite recursion in RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN COALESCE(user_role = 'admin', false);
END;
$$;

-- Fix Profiles RLS (Admins can view/update all, Users view/update their own)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Profiles viewable by owner or admin" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Profiles updatable by owner or admin" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id OR public.is_admin());

-- 2. CATEGORIES
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (public.is_admin());

-- 3. ORDERS (TRACKING & NOTES)
-- ------------------------------------------
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.is_admin());

-- 4. ADDRESSES (ADMIN VIEW)
-- ------------------------------------------
DROP POLICY IF EXISTS "Admins can view all addresses" ON public.addresses;
CREATE POLICY "Admins can view all addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- 5. COUPONS
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'flat')) NOT NULL,
  discount_value INTEGER NOT NULL,
  min_order_value INTEGER DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active coupons" ON public.coupons;
CREATE POLICY "Public can view active coupons" ON public.coupons FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL USING (public.is_admin());

-- 6. SITE SETTINGS
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.site_settings (key, value) VALUES
('store_info', '{"name": "Anubandhan", "email": "contact@anubandhan.com", "phone": "+91 9876543210"}'),
('shipping', '{"free_threshold": 5000, "flat_rate": 100}'),
('social_links', '{"instagram": "https://instagram.com", "facebook": "https://facebook.com", "twitter": "https://twitter.com", "youtube": "https://youtube.com"}')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view settings" ON public.site_settings;
CREATE POLICY "Public can view settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL USING (public.is_admin());

-- 7. UPDATE EXISTING PRODUCT POLICIES TO USE is_admin()
-- ------------------------------------------
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (public.is_admin());
