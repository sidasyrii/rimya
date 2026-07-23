"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useUserStore } from "@/store/useUserStore";
import { useAddressStore } from "@/store/useAddressStore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, CreditCard, MapPin, Truck, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart, isGiftWrapped } = useCartStore();
  const { user } = useUserStore();
  const { addresses, fetchAddresses } = useAddressStore();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    first_name: "",
    last_name: "",
    street: "",
    city: "",
    pincode: "",
    phone: "",
    state: "Delhi" // default
  });

  useEffect(() => {
    if (user && !newAddress.first_name) {
      setNewAddress(prev => ({
        ...prev,
        first_name: user.user_metadata?.first_name || "",
        last_name: user.user_metadata?.last_name || "",
        phone: user.user_metadata?.phone || ""
      }));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAddresses(user.id);
    }
  }, [user, fetchAddresses]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId && !useNewAddress) {
      const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    } else if (addresses.length === 0) {
      setUseNewAddress(true);
    }
  }, [addresses, selectedAddressId, useNewAddress]);

  const subtotal = getSubtotal();
  const shipping = 0; // Assuming free shipping threshold met
  const giftWrap = isGiftWrapped ? 250 : 0;
  const tax = Math.round(subtotal * 0.18); // 18% GST example
  const total = subtotal + shipping + giftWrap + tax;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: total, 
          subtotal: subtotal,
          tax: tax,
          receipt: 'receipt_' + Math.random().toString(36).substring(7),
          items,
          giftWrap,
          shipping,
          address: useNewAddress ? newAddress : { id: selectedAddressId }
        }),
      });

      const data = await res.json();
      if (!data.orderId) throw new Error("Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Anubandhan",
        description: "Luxury Gifting",
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.error || "Verification failed");
            
            clearCart();
            window.location.href = `/order-confirmation?orderId=${response.razorpay_order_id}`;
          } catch (e) {
            console.error(e);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Sidak Arora",
          email: "sidak@example.com",
          contact: "9876543210"
        },
        theme: {
          color: "#7B3F00"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong with the payment gateway.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background pt-24">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-foreground/70 mb-8">Add items to your cart to proceed with checkout.</p>
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Checkout Flow */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-heading font-bold text-primary mb-8">Checkout</h1>
            
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-12 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
              
              {[
                { num: 1, label: "Address", icon: MapPin },
                { num: 2, label: "Delivery", icon: Truck },
                { num: 3, label: "Payment", icon: CreditCard }
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center bg-background px-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= s.num ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground'}`}>
                    {step > s.num ? <CheckCircle2 size={20} /> : <s.icon size={18} />}
                  </div>
                  <span className={`text-sm font-medium mt-2 ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Steps Content */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
              
              {/* Step 1: Address */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-heading font-semibold mb-6">Shipping Address</h2>
                  
                  {user && addresses.length > 0 && !useNewAddress && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-medium">Select a saved address</label>
                        <button type="button" onClick={() => setUseNewAddress(true)} className="text-sm text-primary font-medium hover:underline">
                          Use a new address
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div 
                            key={addr.id} 
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-sm">{addr.full_name}</h3>
                              {addr.is_default && <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-1 rounded">Default</span>}
                            </div>
                            <p className="text-xs text-foreground/70 leading-relaxed mb-1">
                              {addr.address_line1}, {addr.city} - {addr.pincode}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!user || addresses.length === 0 || useNewAddress) && (
                    <>
                      {user && addresses.length > 0 && (
                        <div className="mb-4">
                          <button type="button" onClick={() => { setUseNewAddress(false); setSelectedAddressId(addresses.find(a => a.is_default)?.id || addresses[0].id); }} className="text-sm text-primary font-medium hover:underline">
                            &larr; Back to saved addresses
                          </button>
                        </div>
                      )}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          <input type="text" className="w-full h-12 px-4 border border-border rounded-md focus:border-primary focus:outline-none" value={newAddress.first_name} onChange={(e) => setNewAddress({...newAddress, first_name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          <input type="text" className="w-full h-12 px-4 border border-border rounded-md focus:border-primary focus:outline-none" value={newAddress.last_name} onChange={(e) => setNewAddress({...newAddress, last_name: e.target.value})} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Street Address</label>
                          <input type="text" className="w-full h-12 px-4 border border-border rounded-md focus:border-primary focus:outline-none" value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">City</label>
                          <input type="text" className="w-full h-12 px-4 border border-border rounded-md focus:border-primary focus:outline-none" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Pincode</label>
                          <input type="text" className="w-full h-12 px-4 border border-border rounded-md focus:border-primary focus:outline-none" value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Phone Number</label>
                          <input type="tel" className="w-full h-12 px-4 border border-border rounded-md focus:border-primary focus:outline-none" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} />
                        </div>
                      </div>
                    </>
                  )}

                  <Button size="lg" className="w-full mt-8" onClick={() => setStep(2)}>
                    Continue to Delivery <ChevronRight size={18} className="ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Delivery & Notes */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-heading font-semibold mb-6">Delivery Preferences</h2>
                  
                  <div className="space-y-4 mb-8">
                    <label className="flex items-start gap-4 p-4 border border-primary bg-primary/5 rounded-lg cursor-pointer">
                      <input type="radio" name="delivery" defaultChecked className="mt-1 accent-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Standard Express (Free)</p>
                        <p className="text-sm text-foreground/70">Delivered within 3-4 business days.</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-4 p-4 border border-border rounded-lg cursor-pointer hover:border-primary/50">
                      <input type="radio" name="delivery" className="mt-1 accent-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Scheduled Delivery (₹199)</p>
                        <p className="text-sm text-foreground/70">Choose a specific date for delivery.</p>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Order Notes (Optional)</label>
                    <textarea 
                      placeholder="Special instructions for delivery..." 
                      className="w-full h-24 p-4 border border-border rounded-md focus:border-primary focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button size="lg" variant="outline" className="w-1/3" onClick={() => setStep(1)}>Back</Button>
                    <Button size="lg" className="w-2/3" onClick={() => setStep(3)}>
                      Continue to Payment <ChevronRight size={18} className="ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-heading font-semibold mb-6">Payment Method</h2>
                  
                  <div className="space-y-4 mb-8">
                    <label className="flex items-center gap-4 p-4 border border-primary bg-primary/5 rounded-lg cursor-pointer">
                      <input type="radio" name="payment" defaultChecked className="accent-primary" />
                      <CreditCard className="text-primary" size={24} />
                      <span className="font-semibold">Razorpay (Cards, UPI, NetBanking)</span>
                    </label>
                    <label className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer opacity-50">
                      <input type="radio" name="payment" disabled />
                      <span className="font-semibold">Cash on Delivery (Unavailable for this order)</span>
                    </label>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button size="lg" variant="outline" className="w-1/3" onClick={() => setStep(2)}>Back</Button>
                    <Button size="lg" className="w-2/3 bg-success hover:bg-success/90 text-white" onClick={handlePayment} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {isProcessing ? "Processing..." : `Pay ₹${total.toLocaleString('en-IN')} securely`}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-muted/30 border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-heading font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                      <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                      <p className="text-primary font-bold text-sm mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3 text-sm text-foreground/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {isGiftWrapped && (
                  <div className="flex justify-between">
                    <span>Premium Gift Wrap</span>
                    <span className="font-medium">₹250</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-success">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (GST 18%)</span>
                  <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4 flex justify-between items-end">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
