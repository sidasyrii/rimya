"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) {
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/products");
  return { success: true };
}

export async function toggleProductStock(productId: string, inStock: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ in_stock: inStock }).eq("id", productId);
  if (error) {
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/products");
  return { success: true };
}

export async function bulkDeleteProducts(productIds: string[]) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().in("id", productIds);
  if (error) {
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/products");
  return { success: true };
}

export async function duplicateProduct(productId: string) {
  const supabase = await createClient();
  
  // Fetch original product
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();
    
  if (fetchError || !product) {
    return { success: false, error: fetchError?.message || "Product not found" };
  }
  
  // Remove ID so Supabase generates a new one
  const { id, created_at, ...productCopy } = product;
  
  // Modify name to indicate it's a copy
  productCopy.name = `${productCopy.name} (Copy)`;
  
  const { error: insertError } = await supabase
    .from("products")
    .insert(productCopy);
    
  if (insertError) {
    return { success: false, error: insertError.message };
  }
  
  revalidatePath("/admin/products");
  return { success: true };
}
