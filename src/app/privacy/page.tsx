import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-heading font-bold text-primary mb-8">Privacy Policy</h1>
        <div className="prose prose-stone max-w-none text-foreground/80 space-y-6">
          <p>This Privacy Policy describes how Anubandha ("we", "us", or "our") collects, uses, and shares your personal information when you visit or make a purchase from our website.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Information We Collect</h2>
          <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
          <p>When you make a purchase, we collect your name, billing address, shipping address, payment information, email address, and phone number.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">How We Use Your Information</h2>
          <p>We use the Order Information to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
