"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(data: { name: string; slug: string; description: string; display_order: number }) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(data);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, data: { name: string; slug: string; description: string; display_order: number }) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").update(data).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}
