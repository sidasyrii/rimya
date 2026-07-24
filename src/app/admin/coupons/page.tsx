import { createClient } from "@/utils/supabase/server";
import { CouponsClient } from "./CouponsClient";

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  
  let coupons = [];
  try {
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) coupons = data;
  } catch (err) {
    // Fallback if migration hasn't run
  }

  return <CouponsClient initialCoupons={coupons || []} />;
}
