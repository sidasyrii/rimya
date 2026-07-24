import { createClient } from "@/utils/supabase/server";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
  
  // Fetch latest 4 products to feature
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(4);

  return <HomeClient categories={categories || []} featuredProducts={products || []} />;
}
