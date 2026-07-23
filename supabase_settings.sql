-- 1. Create Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert Default Settings
INSERT INTO public.site_settings (key, value) VALUES
('store_info', '{"name": "Anubandhan", "email": "contact@anubandhan.com", "phone": "+91 9876543210"}'),
('shipping', '{"free_threshold": 5000, "flat_rate": 100}'),
('social_links', '{"instagram": "https://instagram.com", "facebook": "https://facebook.com", "twitter": "https://twitter.com", "youtube": "https://youtube.com"}')
ON CONFLICT (key) DO NOTHING;

-- 3. Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Public can read settings (needed for frontend)
CREATE POLICY "Public can view settings" 
ON public.site_settings FOR SELECT 
USING (true);

-- Admins can update settings
CREATE POLICY "Admins can manage settings" 
ON public.site_settings FOR ALL 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
