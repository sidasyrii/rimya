"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Format slug to Title Case
  const title = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ') : 'Category';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCategory() {
      setLoading(true);
      let query = supabase.from('products').select('*');
      if (slug.toLowerCase() !== 'all') {
        query = query.ilike('category', `%${slug}%`);
      }
      const { data } = await query;
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchCategory();
  }, [slug, supabase]);

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />

      {/* Category Hero */}
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-primary/90 z-10"></div>
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground mb-4">
            {title} Hampers
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Discover the perfect {title.toLowerCase()} gifts curated to express your deepest emotions.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-24">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-pulse text-xl text-primary font-heading">Loading...</div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(p => (
              <ProductCard 
                key={p.id} 
                id={p.id} 
                name={p.name} 
                price={p.price} 
                originalPrice={p.original_price} 
                image={p.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop'} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <h2 className="text-2xl font-heading font-bold mb-4">No products found</h2>
            <p className="text-foreground/70">Check back later for new {title.toLowerCase()} hampers.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
