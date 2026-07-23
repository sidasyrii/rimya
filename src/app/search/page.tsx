"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, History, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";

import { createClient } from "@/utils/supabase/client";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const supabase = createClient();

  useEffect(() => {
    async function searchProducts() {
      if (!query) {
        setProducts([]);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);
      
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    searchProducts();
  }, [query, supabase]);

  const hasResults = products.length > 0;

  useEffect(() => {
    // Load from local storage in real app
    setRecentSearches(["Anniversary", "Chocolate box", "Corporate gifts"]);
  }, []);

  const handlePillClick = (q: string) => {
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 pb-24">
      
      {/* Search Header */}
      {query ? (
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
            Search Results
          </h1>
          <p className="text-foreground/70">
            Showing results for <span className="font-semibold italic">"{query}"</span>
          </p>
        </div>
      ) : (
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
            What are you looking for?
          </h1>
          <p className="text-foreground/70 max-w-lg mx-auto">
            Find the perfect gift hamper by searching for occasions, recipients, or specific items.
          </p>
        </div>
      )}

      {/* Main Content Area */}
      {query && loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-pulse text-xl text-primary font-heading">Searching...</div>
        </div>
      ) : query && hasResults ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
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
        <div className="flex flex-col items-center">
          
          {/* No Results Message */}
          {query && !hasResults && (
            <div className="flex flex-col items-center justify-center py-10 text-center w-full mb-12 bg-muted/30 rounded-2xl border border-border">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <SearchIcon size={24} className="text-muted-foreground" />
              </div>
              <h2 className="text-xl font-heading font-bold text-foreground mb-2">No results found</h2>
              <p className="text-foreground/70 max-w-md">
                We couldn't find any hampers matching "{query}". 
                Try checking your spelling or explore our trending items below.
              </p>
            </div>
          )}

          {/* Discovery Section (Recent / Popular) */}
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="flex items-center gap-2 font-heading font-semibold text-lg mb-4 text-primary">
                <History size={18} /> Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(term => (
                  <button 
                    key={term}
                    onClick={() => handlePillClick(term)}
                    className="px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground border border-border rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="flex items-center gap-2 font-heading font-semibold text-lg mb-4 text-primary">
                <TrendingUp size={18} /> Popular Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Wedding', 'Gourmet', 'Wellness', 'For Her', 'Luxury'].map(term => (
                  <button 
                    key={term}
                    onClick={() => handlePillClick(term)}
                    className="px-4 py-2 bg-background border border-border hover:border-primary hover:text-primary rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trending Products */}
          <div className="w-full">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
              <h3 className="font-heading font-bold text-2xl text-foreground">Trending Hampers</h3>
              <Link href="/shop" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <ProductCard id="3" name="Golden Anniversary Hamper" price={6500} originalPrice={7000} image="https://images.unsplash.com/photo-1577900232427-18219b9166a0?q=80&w=600&auto=format&fit=crop" />
              <ProductCard id="4" name="Self-Care Essentials" price={3200} image="https://images.unsplash.com/photo-1583241475880-083f84372725?q=80&w=600&auto=format&fit=crop" />
              <ProductCard id="5" name="Tea Lover's Paradise" price={1899} image="https://images.unsplash.com/photo-1594910243604-5178d6de41ce?q=80&w=600&auto=format&fit=crop" />
              <ProductCard id="6" name="Executive Corporate Gift" price={8500} image="https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=600&auto=format&fit=crop" />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      <Suspense fallback={<div className="p-24 text-center animate-pulse">Loading search...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </main>
  );
}
