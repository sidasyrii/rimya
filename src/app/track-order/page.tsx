"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { useState } from "react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<"idle" | "searching" | "found" | "not-found">("idle");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setStatus("searching");
    setTimeout(() => {
      setStatus(orderId.length > 5 ? "found" : "not-found");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />

      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Track Your Order</h1>
        <p className="text-foreground/70 mb-12">
          Enter your Order ID to see the real-time status of your luxury hamper delivery.
        </p>

        <form onSubmit={handleTrack} className="flex gap-2 max-w-md mx-auto mb-12">
          <input 
            type="text" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. ord_123456" 
            className="flex-1 h-12 px-4 border border-border rounded-md focus:border-primary focus:outline-none bg-background"
            required
          />
          <Button type="submit" className="h-12 px-6" disabled={status === "searching"}>
            {status === "searching" ? "Searching..." : <><Search size={18} className="mr-2" /> Track</>}
          </Button>
        </form>

        {status === "found" && (
          <div className="bg-card border border-border rounded-xl p-8 text-left animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-border">
              <div>
                <h3 className="text-lg font-bold">Order #{orderId}</h3>
                <p className="text-sm text-foreground/70">Placed on {new Date().toLocaleDateString()}</p>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider rounded-full">
                In Transit
              </span>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-background bg-primary text-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] p-4 rounded border border-border bg-card">
                  <h4 className="font-bold">Order Confirmed</h4>
                  <p className="text-sm text-foreground/70">We received your order.</p>
                </div>
              </div>
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-background bg-primary text-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] p-4 rounded border border-border bg-card">
                  <h4 className="font-bold">Dispatched</h4>
                  <p className="text-sm text-foreground/70">Your hamper has left our studio.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-background bg-muted text-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] p-4 rounded border border-border bg-muted/30">
                  <h4 className="font-bold text-muted-foreground">Out for Delivery</h4>
                  <p className="text-sm text-muted-foreground">The package is out for delivery.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === "not-found" && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-4 animate-in fade-in">
            We couldn't find an order with that ID. Please check and try again.
          </div>
        )}

      </div>
      <Footer />
    </main>
  );
}
