"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex flex-col items-center justify-center p-4 pt-32 pb-20">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-4 text-center">Checkout Error</h1>
        <p className="text-foreground/70 mb-2 max-w-md text-center">
          We encountered an issue while loading the checkout securely. 
        </p>
        <p className="text-foreground/70 mb-8 max-w-md text-center font-medium">
          Don't worry — your payment method was not affected.
        </p>
        <div className="flex gap-4">
          <Button onClick={reset} size="lg">Reload Checkout</Button>
          <Link href="/cart">
            <Button variant="outline" size="lg">Return to Cart</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
