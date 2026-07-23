import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { amount, subtotal, tax, receipt, items, giftWrap, shipping, address } = await req.json();

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

    // 1. Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // 2. Create order in Razorpay (amount in paisa, so multiply by 100)
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt,
      payment_capture: 1 // Auto capture
    };

    const order = await razorpay.orders.create(options);

    // 3. (Optional but recommended) Write initial "pending" order to Supabase
    if (user) {
      let finalAddressId = address?.id;
      
      // If there's no id but we have address details, save it as a new address for the user
      if (!finalAddressId && address?.street) {
        const { data: newAddrData } = await supabase.from('user_addresses').insert({
          user_id: user.id,
          full_name: `${address.first_name} ${address.last_name}`.trim(),
          address_line1: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          phone: address.phone,
          is_default: false
        }).select().single();
        
        if (newAddrData) {
          finalAddressId = newAddrData.id;
        }
      }

      const { data: orderData, error } = await supabase.from('orders').insert({
        user_id: user.id,
        subtotal: subtotal,
        tax: tax,
        gift_wrap: giftWrap,
        shipping: shipping,
        total: amount,
        status: 'pending',
        razorpay_order_id: order.id,
        address_id: finalAddressId
      }).select().single();

      if (!error && orderData) {
        // Insert order items
        const orderItems = items.map((item: any) => ({
          order_id: orderData.id,
          product_id: item.id,
          quantity: item.quantity,
          price_at_time: item.price,
          gift_message: item.giftMessage
        }));
        await supabase.from('order_items').insert(orderItems);
      }
    }

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });

  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
