"use client";

import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading/verification
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center text-center">
      {loading ? (
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-muted rounded-full mb-6"></div>
          <div className="h-8 bg-muted w-64 rounded mb-4"></div>
          <div className="h-4 bg-muted w-48 rounded"></div>
        </div>
      ) : (
        <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center max-w-lg">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="text-success" size={40} />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">Order Confirmed!</h1>
          <p className="text-foreground/70 mb-2">
            Thank you for your purchase. Your order has been received and is currently being processed.
          </p>
          {orderId && (
            <div className="bg-muted px-6 py-3 rounded-lg mb-8 font-mono text-sm border border-border">
              Order ID: <span className="font-bold text-foreground">{orderId}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <Link href="/account" className="w-full">
              <Button variant="outline" className="w-full h-12">
                <Package className="mr-2" size={18} /> View Order
              </Button>
            </Link>
            <Link href="/shop" className="w-full">
              <Button className="w-full h-12">
                Continue Shopping <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      <Suspense fallback={<div className="container mx-auto px-4 py-24 text-center">Loading...</div>}>
        <OrderConfirmationContent />
      </Suspense>
      <Footer />
    </main>
  );
}
