import { createClient } from "@/utils/supabase/server";
import { CategoriesClient } from "./CategoriesClient";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  
  // Fetch categories (we catch errors silently in case the migration hasn't run yet)
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
    .catch(() => ({ data: [] }));

  return <CategoriesClient initialCategories={categories || []} />;
}
