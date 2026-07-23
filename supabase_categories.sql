-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Add category_id to products table
-- We keep the existing 'category' TEXT column for backward compatibility,
-- but add a proper foreign key 'category_id'.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- 3. Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for categories
-- Everyone can view categories
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can insert categories" 
ON public.categories FOR INSERT 
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update categories" 
ON public.categories FOR UPDATE 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete categories" 
ON public.categories FOR DELETE 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 5. Insert some initial categories
INSERT INTO public.categories (name, slug, description, display_order) VALUES 
('Chocolates', 'chocolates', 'Premium artisan chocolates and truffles', 1),
('Gourmet', 'gourmet', 'Handpicked gourmet delights', 2),
('Anniversary', 'anniversary', 'Special hampers for anniversaries', 3),
('Corporate', 'corporate', 'Professional corporate gifting options', 4)
ON CONFLICT (slug) DO NOTHING;
