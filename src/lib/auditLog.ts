import { SupabaseClient } from "@supabase/supabase-js";

export async function logAdminAction(
  supabase: SupabaseClient,
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    await supabase.from("admin_audit_log").insert({
      admin_id: user.id,
      action,
      resource_type: resourceType,
      resource_id: resourceId || null,
      details: details || null
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}
