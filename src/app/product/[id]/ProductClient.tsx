"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/ProductCard";
import { Heart, Star, Minus, Plus, Share2, MapPin } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import { useEffect } from "react";

export function ProductClient({ product, suggestedProducts }: { product: any, suggestedProducts: any[] }) {
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [giftMessage, setGiftMessage] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const cart = useCartStore();
  const wishlist = useWishlistStore();
  const { addItem: addRecentItem } = useRecentlyViewedStore();

  useEffect(() => {
    if (product) {
      addRecentItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.original_price,
        image: product.images[0]
      });
    }
  }, [product, addRecentItem]);

  const handleAddToCart = () => {
    if (!product) return;
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      giftMessage: giftMessage.trim() !== "" ? giftMessage : undefined
    });
  };

  const handleCheckPincode = () => {
    if (pincode.length !== 6) return;
    setPincodeStatus("checking");
    setTimeout(() => {
      const isValidIndianPincode = /^[1-9][0-9]{5}$/.test(pincode);
      const isDeliverable = isValidIndianPincode && !pincode.startsWith('99');
      setPincodeStatus(isDeliverable ? "available" : "unavailable");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Advanced Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted group cursor-zoom-in">
            <Image 
              src={product.images[activeImageIndex]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-150 origin-center"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img: string, i: number) => (
              <div 
                key={i} 
                onClick={() => setActiveImageIndex(i)}
                className={`relative w-24 h-24 rounded-md overflow-hidden bg-muted cursor-pointer border-2 transition-colors flex-shrink-0 ${activeImageIndex === i ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
              >
                <Image src={img} alt={`Thumbnail ${i}`} fill sizes="96px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary">{product.name}</h1>
            <button className="text-foreground/60 hover:text-primary transition-colors mt-2">
              <Share2 size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-secondary">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="text-sm text-foreground/60 underline cursor-pointer">24 Reviews</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
            {product.original_price && (
              <>
                <span className="text-lg text-muted-foreground line-through mb-1">₹{product.original_price.toLocaleString('en-IN')}</span>
                <span className="text-sm font-bold text-accent mb-1 px-2 py-0.5 bg-accent/10 rounded">
                  Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="text-foreground/80 mb-8 leading-relaxed">
            {product.description || "A curated selection of the finest luxury items, beautifully presented in our signature eco-friendly packaging. Perfect for making any occasion unforgettable."}
          </p>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border border-border rounded-md px-4 h-12">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-foreground/60 hover:text-primary p-1"><Minus size={16} /></button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-foreground/60 hover:text-primary p-1"><Plus size={16} /></button>
            </div>
            <Button onClick={handleAddToCart} size="lg" className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-lg">
              Add to Cart - ₹{(product.price * quantity).toLocaleString('en-IN')}
            </Button>
            <Button onClick={() => wishlist.hasItem(product.id) ? wishlist.removeItem(product.id) : wishlist.addItem(product.id)} size="lg" variant="outline" className={`px-4 h-12 ${wishlist.hasItem(product.id) ? 'text-accent border-accent' : 'text-foreground/60'}`}>
              <Heart size={24} fill={wishlist.hasItem(product.id) ? "currentColor" : "none"} />
            </Button>
          </div>

          {/* Gift Message Option */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2 flex items-center justify-between">
              Add a Free Gift Message
              <span className="text-xs font-normal text-muted-foreground">{250 - giftMessage.length} chars</span>
            </label>
            <textarea 
              maxLength={250}
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="Write your heartfelt message here..."
              className="w-full bg-transparent border border-border rounded-md p-3 text-sm focus:outline-none focus:border-primary resize-none h-24"
            />
          </div>

          {/* Pincode Checker */}
          <div className="mb-8 p-5 bg-muted/50 rounded-lg border border-border/50">
            <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> Check Delivery Availability
            </label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                maxLength={6}
                placeholder="Enter 6-digit Pincode" 
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="flex-1 bg-background border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <Button onClick={handleCheckPincode} disabled={pincode.length !== 6 || pincodeStatus === 'checking'} variant="secondary">
                {pincodeStatus === 'checking' ? 'Checking...' : 'Check'}
              </Button>
            </div>
            {pincodeStatus === 'available' && (
              <p className="text-sm text-success font-medium">Delivery available! Estimated by {new Date(Date.now() + 3 * 86400000).toLocaleDateString()}.</p>
            )}
            {pincodeStatus === 'unavailable' && (
              <p className="text-sm text-accent font-medium">Sorry, we don't deliver to this pincode yet.</p>
            )}
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-8 border-b border-border mb-6">
              {['Description', 'Whats Included', 'Reviews'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
                  className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === tab.toLowerCase().replace(' ', '') ? 'text-primary' : 'text-foreground/60 hover:text-foreground'}`}
                >
                  {tab}
                  {activeTab === tab.toLowerCase().replace(' ', '') && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-foreground/80 text-sm leading-relaxed">
              {activeTab === 'description' && (
                <p>Handcrafted in small batches, this hamper comes in a velvet-lined mahogany finish wooden box that can be repurposed as a keepsake. It is the definitive choice for weddings, anniversaries, and VIP corporate gifting.</p>
              )}
              {activeTab === 'whatsincluded' && (
                <ul className="list-disc pl-5 space-y-2">
                  <li>1x Handcrafted Mahogany Finish Box</li>
                  <li>12x Artisan Belgian Truffles</li>
                  <li>250g Premium Roasted Afghan Almonds</li>
                </ul>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <p className="font-medium text-foreground">★★★★★ "Absolutely stunning!" - Priya S.</p>
                  <p>The packaging was exquisite and the chocolates were divine. Highly recommend!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      {suggestedProducts.length === 2 && (
        <div className="mt-24 p-8 bg-muted/30 rounded-2xl border border-border/50">
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-primary mb-2">Frequently Bought Together</h2>
            <p className="text-foreground/70 text-sm">Enhance your gift with these perfect pairings.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ProductCard 
                id={suggestedProducts[0].id} 
                name={suggestedProducts[0].name} 
                price={suggestedProducts[0].price} 
                image={suggestedProducts[0].images?.[0] || "https://images.unsplash.com/photo-1590838186256-4b95f24ef3d2?q=80&w=600&auto=format&fit=crop"} 
              />
              <div className="hidden sm:flex items-center justify-center text-primary text-3xl font-light">+</div>
              <ProductCard 
                id={suggestedProducts[1].id} 
                name={suggestedProducts[1].name} 
                price={suggestedProducts[1].price} 
                image={suggestedProducts[1].images?.[0] || "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop"} 
              />
            </div>
            <div className="w-full md:w-64 bg-background p-6 rounded-xl border border-border text-center">
              <p className="text-sm font-medium mb-2 text-foreground/70">Total for 3 items</p>
              <p className="text-2xl font-bold text-primary mb-6">
                ₹{(product.price + suggestedProducts[0].price + suggestedProducts[1].price).toLocaleString('en-IN')}
              </p>
              <Button className="w-full">Add Bundle to Cart</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
