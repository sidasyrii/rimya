import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-heading font-bold text-primary mb-8">Returns & Refunds</h1>
        <div className="prose prose-stone max-w-none text-foreground/80 space-y-6">
          <p>Due to the nature of our products (perishables, customized items, and luxury packaging), we follow a strict return policy to ensure quality and hygiene for all our customers.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Damaged or Defective Items</h2>
          <p>If your hamper arrives damaged or defective, please contact us within 24 hours of delivery at hello@Anubandha.com with photographs of the damaged product and packaging. We will investigate and provide a replacement or a full refund.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Cancellation Policy</h2>
          <p>Orders can only be cancelled within 4 hours of placement. Once processing begins or the order is dispatched, it cannot be cancelled.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Non-Returnable Items</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Customized or personalized items</li>
            <li>Perishable goods like chocolates, cakes, and fresh flowers</li>
            <li>Items purchased during sale or clearance</li>
          </ul>
        </div>
      </div>
      <Footer />
    </main>
  );
}
