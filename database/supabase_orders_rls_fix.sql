-- 1. Add missing INSERT policy for orders
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Add missing INSERT policy for order_items
-- (order_items needs a policy because it has RLS enabled)
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- 3. Add address_id to orders table so we know where to ship
ALTER TABLE public.orders ADD COLUMN address_id UUID REFERENCES public.user_addresses(id) ON DELETE SET NULL;
