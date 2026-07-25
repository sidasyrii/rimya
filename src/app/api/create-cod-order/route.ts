import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/rateLimit';
import { sendOrderConfirmationEmail } from '@/lib/emails';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success } = rateLimit(ip, 10, 60000); // 10 per minute
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          }
        }
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // 1. Get the order
    const { data: dbOrder } = await supabase
      .from('orders')
      .select('id, total, status')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (!dbOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (dbOrder.status !== 'pending') {
      return NextResponse.json({ error: 'Order already processed' }, { status: 400 });
    }

    // 2. Fetch COD settings
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'cod')
      .single();

    const codSettings = settingsData?.value || { enabled: true, max_limit: 10000, fee: 50 };

    if (!codSettings.enabled) {
      return NextResponse.json({ error: 'Cash on Delivery is currently disabled' }, { status: 400 });
    }

    if (dbOrder.total > codSettings.max_limit) {
      return NextResponse.json({ error: `Order total exceeds the maximum limit for COD (₹${codSettings.max_limit})` }, { status: 400 });
    }

    // 3. Update the order total to include the COD fee (if any) and set status
    const newTotal = dbOrder.total + codSettings.fee;

    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'cod_pending',
        total: newTotal,
        payment_method: 'cod' // Assuming you might have a payment_method column in future, or just rely on status
      })
      .eq('id', dbOrder.id);

    if (updateError) {
      console.error('Error updating order to COD:', updateError);
      return NextResponse.json({ error: 'Failed to confirm COD order' }, { status: 500 });
    }

    // 4. Send email
    if (user.email) {
      await sendOrderConfirmationEmail(user.email, dbOrder.id, newTotal);
    }

    return NextResponse.json({ success: true, orderId: dbOrder.id });

  } catch (error: any) {
    console.error('COD order error:', error);
    return NextResponse.json({ error: 'Failed to process COD order' }, { status: 500 });
  }
}
