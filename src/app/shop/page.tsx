"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterSidebar } from "@/components/ui/FilterSidebar";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { SlidersHorizontal, LayoutGrid, List as ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const supabase = createClient();
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from('products').select('*');
      
      if (selectedCategories.length > 0) {
        query = query.in('category', selectedCategories);
      }
      
      query = query.lte('price', maxPrice);
      
      if (inStockOnly) {
        query = query.eq('in_stock', true);
      }
      
      if (sortBy === "price-low") {
        query = query.order('price', { ascending: true });
      } else if (sortBy === "price-high") {
        query = query.order('price', { ascending: false });
      } else if (sortBy === "newest") {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (data) {
        // Map database fields to expected component props if needed
        const mappedProducts = data.map(p => ({
          ...p,
          image: p.images?.[0] || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop"
        }));
        setProducts(mappedProducts);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [supabase, selectedCategories, maxPrice, inStockOnly, sortBy]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
    openCart();
  };

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />

      {/* Page Header */}
      <div className="bg-muted py-12 mb-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">All Hampers</h1>
          <p className="text-foreground/70 max-w-2xl">
            Explore our meticulously curated collection of luxury gift hampers. 
            Whether you're celebrating a milestone or expressing gratitude, find the perfect gesture here.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-24">
        
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          <p className="text-sm text-foreground/70 font-medium">
            Showing <span className="text-primary font-bold">{loading ? "..." : products.length}</span> results
          </p>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-muted rounded-md p-1">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <ListIcon size={18} />
              </button>
            </div>
            
            <button 
              className="md:hidden flex items-center gap-2 text-sm font-medium"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            
            <select 
              className="bg-transparent border border-border rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:border-primary"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar Filters */}
          <div className={`md:block ${showMobileFilters ? 'block' : 'hidden'}`}>
            <FilterSidebar 
              onCategoryChange={setSelectedCategories}
              onPriceChange={setMaxPrice}
              onInStockChange={setInStockOnly}
            />
          </div>

          {/* Product Grid / List */}
          <div className="flex-1">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-8"}>
                {products.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-muted-foreground">No products found.</div>
                ) : (
                  products.map(product => (
                    <div key={product.id} className={viewMode === "list" ? "flex flex-col sm:flex-row gap-6 bg-card border border-border/50 rounded-lg overflow-hidden p-4 items-center" : ""}>
                      {viewMode === "list" ? (
                        <>
                          <div className="relative w-full sm:w-48 aspect-square rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                          </div>
                          <div className="flex-1 flex flex-col items-start text-left">
                            <h3 className="font-heading font-semibold text-2xl mb-2 hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
                            <div className="flex items-baseline gap-2 mb-4">
                              <span className="font-bold text-xl text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                              {product.original_price && (
                                <span className="text-sm text-muted-foreground line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
                              )}
                            </div>
                            <p className="text-foreground/70 text-sm mb-6 max-w-xl line-clamp-3">
                              {product.description || "A curated selection of the finest luxury items, beautifully presented in our signature eco-friendly packaging. Perfect for making any occasion unforgettable."}
                            </p>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleAddToCart(product)}>
                              Add to Cart
                            </Button>
                          </div>
                        </>
                      ) : (
                        <ProductCard 
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          originalPrice={product.original_price}
                          image={product.image}
                          isNew={product.created_at ? new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : false}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
            
            {!loading && products.length > 0 && (
              <div className="mt-16 flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-4">You've viewed {products.length} products</p>
                <div className="w-64 h-1 bg-muted rounded-full mb-6 overflow-hidden">
                  <div className="h-full bg-primary w-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
