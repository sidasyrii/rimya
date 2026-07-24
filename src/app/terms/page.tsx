import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-heading font-bold text-primary mb-8">Terms of Service</h1>
        <div className="prose prose-stone max-w-none text-foreground/80 space-y-6">
          <p>Welcome to Anubandha. These Terms of Service govern your use of our website and services.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">General Conditions</h2>
          <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Products or Services</h2>
          <p>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
