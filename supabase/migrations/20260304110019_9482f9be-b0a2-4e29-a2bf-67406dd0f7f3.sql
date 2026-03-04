
ALTER TABLE public.services 
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS packages jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cover_image_url text,
  ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS slug text;

-- Generate slugs from existing titles
UPDATE public.services SET slug = lower(replace(replace(title, ' ', '-'), '''', '')) WHERE slug IS NULL;
