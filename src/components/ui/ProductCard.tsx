"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";



interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  isNew?: boolean;
}

export function ProductCard({ id, name, price, originalPrice, image, rating = 5, isNew }: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;

  return (
    <div className="group flex flex-col bg-card rounded-lg overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
              New
            </span>
          )}
          {discount && (
            <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
              -{discount}%
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 gap-2">
          <Button variant="secondary" size="icon" className="rounded-full shadow-lg hover:scale-110 transition-transform">
            <Heart size={18} />
          </Button>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex-1">
            <ShoppingBag size={16} className="mr-2" />
            Add to Cart
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full shadow-lg hover:scale-110 transition-transform">
            <Eye size={18} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex text-secondary mb-1 text-xs">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < Math.floor(rating) ? "text-secondary" : "text-muted-foreground"}>
              ★
            </span>
          ))}
        </div>
        <Link href={`/product/${id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-heading font-semibold text-lg line-clamp-1 mb-1">{name}</h3>
        </Link>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-bold text-lg text-primary">₹{price.toLocaleString('en-IN')}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
