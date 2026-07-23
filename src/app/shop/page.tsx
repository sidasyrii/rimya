import { createClient } from "@/utils/supabase/server";
import { ShopClient } from "./ShopClient";

export default async function ShopPage() {
  const supabase = await createClient();
  
  // Fetch initial products with default filters (e.g., maxPrice=20000, sortBy=featured)
  const { data: initialProducts } = await supabase
    .from('products')
    .select('*')
    .lte('price', 20000);

  // Map images as expected by the client
  const mappedProducts = (initialProducts || []).map(p => ({
    ...p,
    image: p.images?.[0] || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop"
  }));

  return <ShopClient initialProducts={mappedProducts} />;
}
