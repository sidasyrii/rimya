"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useWishlistStore } from "@/store/useWishlistStore";
import { ProductCard } from "@/components/ui/ProductCard";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (items.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      
      const { data } = await supabase
        .from('products')
        .select('*')
        .in('id', items);
        
      if (data) {
        setProducts(data);
      }
      setIsLoading(false);
    }
    
    fetchWishlistProducts();
  }, [items, supabase]);

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />

      <div className="bg-muted py-12 mb-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">My Wishlist</h1>
          <p className="text-foreground/70">Save your favorite luxury hampers for later.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-24">
        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Heart size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-heading font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-foreground/70 mb-8 max-w-md">
              You haven't saved any items yet. Browse our collection and click the heart icon to add them here.
            </p>
            <Link href="/shop">
              <Button size="lg">Explore Collection</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(p => (
              <ProductCard 
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                originalPrice={p.original_price}
                image={p.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48'} 
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
