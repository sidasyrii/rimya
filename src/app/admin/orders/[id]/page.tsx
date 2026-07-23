import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { OrderDetailClient } from "./OrderDetailClient";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      user:user_id (
        id,
        email,
        raw_user_meta_data
      ),
      items:order_items (
        *,
        product:product_id (
          name,
          images
        )
      )
    `)
    .eq('id', id)
    .single();

  if (!order) {
    notFound();
  }

  // Also try to fetch the address if it exists, matching the user
  // (In a real app, the order should store a snapshot of the address, not just reference it)
  // We'll see if there's an address in the user's profile
  let address = null;
  if (order.user_id) {
    const { data: addresses } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', order.user_id)
      .limit(1);
    
    if (addresses && addresses.length > 0) {
      address = addresses[0];
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 bg-background border border-border rounded-md hover:bg-muted transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary flex items-center gap-3">
            Order #{order.id.split('-')[0]}
            <span className={`px-2.5 py-1 text-xs rounded-full font-medium capitalize ${
              order.status === 'delivered' ? 'bg-success/10 text-success' :
              order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600' :
              order.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
              'bg-blue-500/10 text-blue-600'
            }`}>{order.status}</span>
          </h1>
          <p className="text-sm text-foreground/70">
            Placed on {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
      </div>

      <OrderDetailClient order={order} address={address} />
    </div>
  );
}
