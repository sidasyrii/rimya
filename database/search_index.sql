-- Add full-text search column
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,''))) STORED;

CREATE INDEX IF NOT EXISTS products_fts_idx ON public.products USING gin(fts);
