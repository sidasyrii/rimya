import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success } = rateLimit(ip, 5, 60000); // 5 per minute
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { items, giftWrap, shipping, address, couponCode, deliveryOption } = await req.json();

    // ──────────────────────────────────────────────
    // FRAUD PREVENTION: Server-side price calculation
    // We NEVER trust the client for prices/totals.
    // ──────────────────────────────────────────────

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

    // 1. Validate items: Fetch actual prices from DB
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const productIds = items.map((item: any) => item.id);
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, price, name, in_stock')
      .in('id', productIds);

    if (prodError || !products) {
      return NextResponse.json({ error: 'Failed to verify product prices' }, { status: 500 });
    }

    // Build a price map from the DATABASE (the source of truth)
    const priceMap = new Map(products.map(p => [p.id, p]));

    // Validate every item exists and is in stock
    for (const item of items) {
      const dbProduct = priceMap.get(item.id);
      if (!dbProduct) {
        return NextResponse.json({ error: `Product "${item.id}" not found` }, { status: 400 });
      }
      if (dbProduct.in_stock === false) {
        return NextResponse.json({ error: `"${dbProduct.name}" is out of stock` }, { status: 400 });
      }
      if (!item.quantity || item.quantity < 1 || item.quantity > 10) {
        return NextResponse.json({ error: `Invalid quantity for "${dbProduct.name}"` }, { status: 400 });
      }
    }

    // 2. Calculate totals SERVER-SIDE using DB prices
    const subtotal = items.reduce((sum: number, item: any) => {
      const dbPrice = priceMap.get(item.id)!.price;
      return sum + (dbPrice * item.quantity);
    }, 0);

    let serverDiscount = 0;
    let validCouponId = null;

    if (couponCode) {
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .single();
      
      if (!couponError && coupon && coupon.is_active) {
        let isValid = true;
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) isValid = false;
        if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) isValid = false;
        if (coupon.min_order_value > 0 && subtotal < coupon.min_order_value) isValid = false;
        
        if (isValid) {
          validCouponId = coupon.id;
          if (coupon.discount_type === 'percentage') {
            serverDiscount = Math.round(subtotal * (coupon.discount_value / 100));
          } else if (coupon.discount_type === 'flat') {
            serverDiscount = Math.min(coupon.discount_value, subtotal);
          }
          // Increment current_uses
          await supabase.from('coupons').update({ current_uses: coupon.current_uses + 1 }).eq('id', coupon.id);
        }
      }
    }

    const serverGiftWrap = giftWrap ? 250 : 0;  // Fixed value, not from client
    const serverShipping = deliveryOption === 'scheduled' ? 199 : (subtotal >= 5000 ? 0 : 100);
    const taxableAmount = subtotal - serverDiscount;
    const serverTax = Math.round(Math.max(taxableAmount, 0) * 0.18);
    const serverTotal = Math.max(taxableAmount, 0) + serverGiftWrap + serverShipping + serverTax;

    if (serverTotal <= 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 });
    }

    // 3. Create Razorpay order with SERVER-CALCULATED amount
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const rzpOrder = await razorpay.orders.create({
      amount: serverTotal * 100,  // Convert to paisa
      currency: "INR",
      receipt: `order_${user.id.substring(0, 8)}_${Date.now()}`,
      payment_capture: true,
      notes: {
        user_id: user.id,
        item_count: items.length.toString(),
      }
    }) as any;

    // 4. Save order in Supabase with "pending" status
    let finalAddressId = address?.id;
    
    if (!finalAddressId && address?.street) {
      const { data: newAddrData } = await supabase.from('user_addresses').insert({
        user_id: user.id,
        full_name: `${(address.first_name || '').trim()} ${(address.last_name || '').trim()}`.trim(),
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

    const { data: orderData, error: orderError } = await supabase.from('orders').insert({
      user_id: user.id,
      subtotal: subtotal,
      tax: serverTax,
      gift_wrap: serverGiftWrap,
      shipping: serverShipping,
      discount: serverDiscount,
      coupon_id: validCouponId,
      total: serverTotal,
      status: 'pending',
      razorpay_order_id: rzpOrder.id,
      address_id: finalAddressId
    }).select().single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json({ error: 'Failed to create order record' }, { status: 500 });
    }

    if (orderData) {
      const orderItems = items.map((item: any) => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: priceMap.get(item.id)!.price,  // DB price, not client price
        gift_message: item.giftMessage || null
      }));
      // Decrement stock for each item using RPC
      for (const item of items) {
        const { error: stockError } = await supabase.rpc('decrement_stock', { 
          p_product_id: item.id, 
          p_quantity: item.quantity 
        });
        if (stockError) {
          console.error(`Failed to decrement stock for product ${item.id}:`, stockError);
          // Normally we'd rollback the order here if we had full transactions, but since 
          // Razorpay payment is pending, we can flag this order for admin review or cancel it.
        }
      }

      await supabase.from('order_items').insert(orderItems);
    }

    // 5. Return order details (the amount comes from SERVER, not client)
    return NextResponse.json({ 
      orderId: rzpOrder.id, 
      amount: rzpOrder.amount, 
      currency: rzpOrder.currency,
      dbOrderId: orderData?.id,
      serverTotal,
      subtotal,
      tax: serverTax,
      giftWrap: serverGiftWrap,
      shipping: serverShipping,
      discount: serverDiscount,
    });

  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: 'Payment gateway error. Please try again.' }, { status: 500 });
  }
}
