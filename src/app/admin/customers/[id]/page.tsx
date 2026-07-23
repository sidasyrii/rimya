import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CustomerDetailClient } from "./CustomerDetailClient";

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (!profile) {
    notFound();
  }

  // To get email, we fetch their auth record via admin api in a real app,
  // but since we can't do that easily without service role, we'll try to find an order by them
  // and extract the email from the order relation (which we allowed earlier)
  let email = "Email protected";
  const { data: latestOrder } = await supabase
    .from('orders')
    .select('user:user_id (email)')
    .eq('user_id', id)
    .limit(1)
    .single();
    
  if (latestOrder && latestOrder.user && (latestOrder.user as any).email) {
    email = (latestOrder.user as any).email;
  }

  // Fetch their orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  // Fetch their addresses
  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', id)
    .order('is_default', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers" className="p-2 bg-background border border-border rounded-md hover:bg-muted transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">
            {profile.first_name} {profile.last_name}
          </h1>
          <p className="text-sm text-foreground/70">
            Customer Profile
          </p>
        </div>
      </div>

      <CustomerDetailClient 
        profile={profile} 
        email={email}
        orders={orders || []} 
        addresses={addresses || []} 
      />
    </div>
  );
}
