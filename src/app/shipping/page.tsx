import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-heading font-bold text-primary mb-8">Shipping Policy</h1>
        <div className="prose prose-stone max-w-none text-foreground/80 space-y-6">
          <p>At Anubandhan, we understand the importance of timely delivery for your special moments. We partner with premium logistics providers to ensure your luxury hampers arrive in pristine condition.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Processing Time</h2>
          <p>All standard orders are processed within 1-2 business days. Customized or personalized hampers require an additional 2-3 business days for preparation.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Delivery Options & Charges</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Standard Delivery:</strong> Free on orders over ₹5,000. (3-5 business days)</li>
            <li><strong>Express Delivery:</strong> ₹299 (1-2 business days, available in select metro cities)</li>
            <li><strong>Scheduled Delivery:</strong> ₹199 (Choose a specific date for delivery)</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Order Tracking</h2>
          <p>Once your order is dispatched, you will receive an email and SMS with the tracking details. You can also track your order from your Account dashboard.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
