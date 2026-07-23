-- 1. Add Role to Profiles Table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- 2. Update Products RLS (Allow Admins to modify)
-- Drop existing insert/update/delete policies if they exist (just in case)
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Create new policies
CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 3. Create Storage Bucket for Product Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage Policies for product-images
-- Allow public to read images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'product-images' );

-- Allow admins to upload/update/delete images
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'product-images' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'product-images' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
