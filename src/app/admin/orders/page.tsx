import { createClient } from "@/utils/supabase/server";
import { OrdersClient } from "./OrdersClient";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      user:user_id (
        id,
        email,
        raw_user_meta_data
      )
    `)
    .order('created_at', { ascending: false });

  return <OrdersClient initialOrders={orders || []} />;
}
