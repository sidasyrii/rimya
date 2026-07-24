import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    // ──────────────────────────────────────────────
    // FRAUD PREVENTION: Cryptographic signature verification
    // ──────────────────────────────────────────────

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 1. Verify Razorpay's cryptographic signature
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('PAYMENT FRAUD ATTEMPT: Invalid signature', { razorpay_order_id, razorpay_payment_id });
      return NextResponse.json({ error: 'Payment verification failed. Signature mismatch.' }, { status: 400 });
    }

    // 2. Double-verify with Razorpay API: Fetch the payment directly from Razorpay
    //    This prevents replay attacks and ensures the payment amount matches.
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: secret,
    });

    let rzpPayment: any;
    try {
      rzpPayment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (fetchErr) {
      console.error('Failed to fetch payment from Razorpay:', fetchErr);
      return NextResponse.json({ error: 'Could not verify payment with Razorpay' }, { status: 500 });
    }

    // 3. Verify payment status is "captured" (money actually received)
    if (rzpPayment.status !== 'captured') {
      console.error('Payment not captured:', { status: rzpPayment.status, id: razorpay_payment_id });
      return NextResponse.json({ error: `Payment not completed. Status: ${rzpPayment.status}` }, { status: 400 });
    }

    // 4. Verify the payment belongs to the correct order
    if (rzpPayment.order_id !== razorpay_order_id) {
      console.error('FRAUD: Payment order_id mismatch', { expected: razorpay_order_id, got: rzpPayment.order_id });
      return NextResponse.json({ error: 'Payment order mismatch' }, { status: 400 });
    }

    // 5. Update the order in Supabase
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

    // 6. Verify the amount paid matches what we stored in our DB
    const { data: dbOrder } = await supabase
      .from('orders')
      .select('id, total, status')
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id)
      .single();

    if (!dbOrder) {
      console.error('Order not found for payment verification', { razorpay_order_id, user_id: user.id });
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Prevent double-processing
    if (dbOrder.status === 'paid' || dbOrder.status === 'processing') {
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Verify the amount: Razorpay stores in paisa, our DB stores in rupees
    const expectedAmountPaisa = dbOrder.total * 100;
    if (rzpPayment.amount !== expectedAmountPaisa) {
      console.error('FRAUD: Amount mismatch!', { 
        expected: expectedAmountPaisa, 
        received: rzpPayment.amount, 
        order: razorpay_order_id 
      });
      return NextResponse.json({ error: 'Payment amount does not match order total' }, { status: 400 });
    }

    // 7. All checks passed — mark order as paid and store payment ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'paid',
        razorpay_payment_id: razorpay_payment_id
      })
      .eq('id', dbOrder.id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating order status:', updateError);
      // Payment succeeded, so we still return success but log the error
      // The webhook will also try to update this
    }

    return NextResponse.json({ success: true, orderId: dbOrder.id });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
