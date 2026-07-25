-- Add COD setting if it doesn't exist
INSERT INTO public.site_settings (key, value) VALUES
('cod', '{"enabled": true, "max_limit": 10000, "fee": 50}')
ON CONFLICT (key) DO NOTHING;

-- Update order status check constraint to include cod_pending
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'paid', 'cod_pending', 'processing', 'shipped', 'delivered', 'cancelled'));
