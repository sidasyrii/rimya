import { createClient } from "@/utils/supabase/server";
import { CategoriesClient } from "./CategoriesClient";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  
  // Fetch categories (we catch errors silently in case the migration hasn't run yet)
  let categories = [];
  try {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (data) categories = data;
  } catch (err) {
    // ignore errors
  }

  return <CategoriesClient initialCategories={categories || []} />;
}
