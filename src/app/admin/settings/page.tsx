import { createClient } from "@/utils/supabase/server";
import { SettingsClient } from "./SettingsClient";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .catch(() => ({ data: [] })); // Fallback if migration hasn't run

  // Convert array to object
  const settingsObj = (settings || []).reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  return <SettingsClient initialSettings={settingsObj} />;
}
