"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function updateTrackingNumber(orderId: string, trackingNumber: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ tracking_number: trackingNumber }).eq("id", orderId);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function addOrderNote(orderId: string, adminNotes: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ admin_notes: adminNotes }).eq("id", orderId);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
