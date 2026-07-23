"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(settings: Record<string, any>) {
  const supabase = await createClient();
  
  for (const [key, value] of Object.entries(settings)) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value });
      
    if (error) {
      return { success: false, error: error.message };
    }
  }
  
  revalidatePath("/admin/settings");
  // Also revalidate main layout/footer where settings might be used
  revalidatePath("/", "layout");
  return { success: true };
}
