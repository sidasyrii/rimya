import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rateLimit';
import { sendOrderConfirmationEmail } from '@/lib/emails';

// ──────────────────────────────────────────────────────────────
// RAZORPAY WEBHOOK HANDLER
// ──────────────────────────────────────────────────────────────
// This catches payments that the frontend verify-payment might miss
// (e.g., user closes browser after paying but before callback fires).
//
// Setup in Razorpay Dashboard:
//   1. Go to Settings → Webhooks → Add New Webhook
//   2. URL: https://yourdomain.com/api/razorpay-webhook
//   3. Events: payment.captured, payment.failed
//   4. Set a Webhook Secret and add it to your .env as RAZORPAY_WEBHOOK_SECRET
// ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success } = rateLimit(ip, 30, 60000); // 30 per minute
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // 1. Verify webhook signature (prevents spoofed webhook calls)
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('WEBHOOK FRAUD ATTEMPT: Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    // Use service role key for webhook (no user session available)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
      console.error('FATAL: SUPABASE_SERVICE_ROLE_KEY not configured. Webhook cannot process payments.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    if (eventType === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;
      const amountPaisa = payment.amount;

      // Find the order in our DB
      const { data: dbOrder } = await supabase
        .from('orders')
        .select('id, total, status, user_id')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

      if (!dbOrder) {
        console.error('Webhook: Order not found for', razorpayOrderId);
        return NextResponse.json({ status: 'order_not_found' });
      }

      // Skip if already processed
      if (dbOrder.status === 'paid' || dbOrder.status === 'processing' || dbOrder.status === 'shipped' || dbOrder.status === 'delivered') {
        return NextResponse.json({ status: 'already_processed' });
      }

      // Verify amount matches
      const expectedAmountPaisa = dbOrder.total * 100;
      if (amountPaisa !== expectedAmountPaisa) {
        console.error('WEBHOOK FRAUD: Amount mismatch!', {
          expected: expectedAmountPaisa,
          received: amountPaisa,
          order: razorpayOrderId
        });
        // Still update status to flag it, but mark it for review
        await supabase
          .from('orders')
          .update({
            status: 'pending',
            admin_notes: `⚠️ AMOUNT MISMATCH: Expected ₹${dbOrder.total}, Razorpay charged ₹${amountPaisa / 100}. Needs manual review.`,
            razorpay_payment_id: razorpayPaymentId
          })
          .eq('id', dbOrder.id);

        return NextResponse.json({ status: 'amount_mismatch_flagged' });
      }

      // All good — mark as paid
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          razorpay_payment_id: razorpayPaymentId
        })
        .eq('id', dbOrder.id);

      console.log(`Webhook: Order ${dbOrder.id} marked as paid via webhook`);

      // Send email
      if (dbOrder.user_id) {
        const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(dbOrder.user_id);
        if (user && user.email) {
          await sendOrderConfirmationEmail(user.email, dbOrder.id, dbOrder.total);
        }
      }

    } else if (eventType === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      // Mark order as failed
      const { data: dbOrder } = await supabase
        .from('orders')
        .select('id, status')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

      if (dbOrder && dbOrder.status === 'pending') {
        await supabase
          .from('orders')
          .update({
            status: 'cancelled',
            admin_notes: `Payment failed. Reason: ${payment.error_description || 'Unknown'}. Error code: ${payment.error_code || 'N/A'}`
          })
          .eq('id', dbOrder.id);
      }
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
