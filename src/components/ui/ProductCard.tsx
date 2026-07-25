"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  weight?: string;
  isNew?: boolean;
}

export function ProductCard({ id, name, price, originalPrice, image, weight, isNew }: ProductCardProps) {
  const discountAmount = originalPrice ? originalPrice - price : null;

  return (
    <div className="group flex flex-col bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/20 transition-all duration-200">
      <Link href={`/product/${id}`} className="block relative">
        {/* Image Container */}
        <div className="relative aspect-square border-b border-border/40 bg-muted/30">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          {/* Add Button Overlaid on Image bottom-right */}
          <div className="absolute -bottom-4 right-2 z-10">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-background text-[#ff3366] border-[#ff3366] font-bold shadow-sm rounded-lg px-6 py-1 h-8 hover:bg-[#ff3366]/5 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic would go here
              }}
            >
              ADD
            </Button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 pt-6 flex flex-col flex-grow">
        {/* Pricing block */}
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            ₹{price.toLocaleString('en-IN')}
          </div>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        
        {discountAmount && discountAmount > 0 && (
          <div className="text-[10px] font-bold text-green-700 uppercase tracking-wide mb-1 border-b border-dashed border-border/60 pb-1">
            ₹{discountAmount.toLocaleString('en-IN')} OFF
          </div>
        )}

        {/* Title */}
        <Link href={`/product/${id}`} className="block mt-1 group-hover:text-primary transition-colors">
          <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">{name}</h3>
        </Link>
        
        {/* Weight / Pack info */}
        <div className="text-xs text-muted-foreground mt-1">
          {weight || "1 pack"}
        </div>
      </div>
    </div>
  );
}
