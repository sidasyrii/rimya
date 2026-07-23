-- 0. Ensure role column exists on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- 1. Add tracking_number and admin_notes to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- 2. Ensure Admins can read and update all orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

CREATE POLICY "Admins can view all orders" 
ON public.orders FOR SELECT 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  OR auth.uid() = user_id
);

CREATE POLICY "Admins can update orders" 
ON public.orders FOR UPDATE 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
