import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.ADMIN_EMAILS || 'orders@anubandhan.com'; // Change to verified domain email

export async function sendOrderConfirmationEmail(toEmail: string, orderId: string, total: number) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('your_resend_api_key_here')) {
    console.warn('RESEND_API_KEY not configured, skipping email.');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `Anubandhan <${FROM_EMAIL}>`,
      to: [toEmail],
      subject: `Order Confirmation - #${orderId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #d2a154;">Thank you for your order!</h1>
          <p>Hi there,</p>
          <p>We've received your order <strong>#${orderId}</strong> and are getting it ready for shipment.</p>
          <p><strong>Order Total:</strong> ₹${total}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p>We'll send you another email when your order ships.</p>
          <p>Best regards,<br/>The Anubandhan Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send order email:', error);
    }
    return data;
  } catch (error) {
    console.error('Error sending order email via Resend:', error);
  }
}
