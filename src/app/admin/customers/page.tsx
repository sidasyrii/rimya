import { createClient } from "@/utils/supabase/server";
import { CustomersClient } from "./CustomersClient";

export default async function AdminCustomersPage() {
  const supabase = await createClient();

  // Fetch all profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  // For a real app with many users, we'd paginate or use an RPC.
  // For now, we fetch order totals manually per user or join.
  // We can join orders to get total spent
  
  const { data: orders } = await supabase
    .from('orders')
    .select('user_id, total, status')
    .neq('status', 'cancelled');

  // Map auth emails if possible - actually Supabase admin API is needed for this usually.
  // But our orders query returned email previously because we had a relation to auth.users.
  // We can't directly select from auth.users here unless we use service_role key.
  // For this demo, we'll pass the profiles and orders, and the client can aggregate.

  return <CustomersClient profiles={profiles || []} orders={orders || []} />;
}
