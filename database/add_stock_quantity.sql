-- Add stock quantity column
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;

-- Update existing products: set stock_quantity based on in_stock
UPDATE public.products SET stock_quantity = CASE WHEN in_stock THEN 10 ELSE 0 END;

-- Create atomic stock decrement function
CREATE OR REPLACE FUNCTION public.decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  current_qty INTEGER;
BEGIN
  SELECT stock_quantity INTO current_qty FROM products WHERE id = p_product_id FOR UPDATE;
  IF current_qty >= p_quantity THEN
    UPDATE products SET stock_quantity = stock_quantity - p_quantity,
      in_stock = (stock_quantity - p_quantity > 0) WHERE id = p_product_id;
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$;
