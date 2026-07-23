import { createClient } from "@/utils/supabase/server";
import { CouponsClient } from "./CouponsClient";

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  
  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })
    .catch(() => ({ data: [] })); // Fallback if migration hasn't run

  return <CouponsClient initialCoupons={coupons || []} />;
}
