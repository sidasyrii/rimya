import { createClient } from "@/utils/supabase/server";
import { ProductsClient } from "./ProductsClient";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  
  // Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch categories (we catch errors silently in case the migration hasn't run yet)
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
    .catch(() => ({ data: [] }));

  return (
    <ProductsClient 
      initialProducts={products || []} 
      categories={categories || []} 
    />
  );
}
