"use client";

import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Tag, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, getSubtotal, getTotalItems, isGiftWrapped, setIsGiftWrapped } = useCartStore();
  
  const [coupon, setCoupon] = useState("");

  const subtotal = getSubtotal();
  const shippingThreshold = 5000;
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(shippingThreshold - subtotal, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-heading font-bold text-2xl flex items-center gap-2">
                <ShoppingBag /> Your Cart ({getTotalItems()})
              </h2>
              <button onClick={closeCart} className="text-foreground/60 hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
              <div className="p-4 bg-muted/50 border-b border-border">
                <p className="text-sm font-medium mb-2 text-center">
                  {remainingForFreeShipping > 0 
                    ? `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} more for FREE Express Shipping!` 
                    : "🎉 You've unlocked FREE Express Shipping!"}
                </p>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-heading font-bold">Your cart is empty</h3>
                  <p className="text-foreground/70">Looks like you haven't added any luxury hampers yet.</p>
                  <Button onClick={closeCart} className="mt-4">Start Shopping</Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-border/50 pb-6">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold line-clamp-2 pr-4">{item.name}</h4>
                          <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-accent">
                            <X size={16} />
                          </button>
                        </div>
                        <p className="font-bold text-primary mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                        {item.giftMessage && (
                          <p className="text-xs text-foreground/60 mt-1 italic border-l-2 border-primary pl-2 line-clamp-1">
                            "{item.giftMessage}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border rounded-md px-2 h-8">
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-foreground/60 hover:text-primary p-1"><Minus size={14} /></button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-foreground/60 hover:text-primary p-1"><Plus size={14} /></button>
                        </div>
                        <p className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Upsell / Extras */}
              {items.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Gift size={20} className="text-secondary" />
                      <div>
                        <p className="font-medium text-sm">Premium Gift Wrapping</p>
                        <p className="text-xs text-foreground/70">Add a ribbon & unboxing experience</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={isGiftWrapped} onChange={(e) => setIsGiftWrapped(e.target.checked)} />
                      <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Coupon Code" 
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary uppercase"
                      />
                    </div>
                    <Button variant="secondary" className="h-10">Apply</Button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 bg-background">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-foreground/70 text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {isGiftWrapped && (
                    <div className="flex justify-between text-foreground/70 text-sm">
                      <span>Gift Wrapping</span>
                      <span>₹250</span>
                    </div>
                  )}
                  <div className="flex justify-between text-foreground/70 text-sm">
                    <span>Shipping</span>
                    <span>{remainingForFreeShipping > 0 ? "Calculated at checkout" : "FREE"}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border mt-2">
                    <span>Total</span>
                    <span>₹{(subtotal + (isGiftWrapped ? 250 : 0)).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <Link href="/checkout" onClick={closeCart}>
                  <Button size="lg" className="w-full h-14 text-lg">
                    Checkout <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <p className="text-center text-xs text-foreground/60 mt-4 flex items-center justify-center gap-1">
                  Secure checkout powered by Razorpay
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
