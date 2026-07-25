import { MetadataRoute } from 'next';

import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://Anubandha.com';
  const supabase = await createClient();

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/corporate-gifting`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/personalized-hampers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  try {
    const { data: products } = await supabase.from('products').select('id, created_at');
    if (products) {
      products.forEach(product => {
        routes.push({
          url: `${baseUrl}/product/${product.id}`,
          lastModified: new Date(product.created_at),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }

    const { data: categories } = await supabase.from('categories').select('slug, created_at');
    if (categories) {
      categories.forEach(category => {
        routes.push({
          url: `${baseUrl}/category/${category.slug}`,
          lastModified: new Date(category.created_at),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
  }

  return routes;
}
