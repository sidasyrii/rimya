"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCoupon(data: any) {
  const supabase = await createClient();
  const { error } = await supabase.from("coupons").insert(data);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function updateCoupon(id: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase.from("coupons").update(data).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function deleteCoupon(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function toggleCouponActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("coupons").update({ is_active: isActive }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/coupons");
  return { success: true };
}
