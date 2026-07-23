"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { Gift, Truck, ShieldCheck, Leaf } from "lucide-react";

const occasions = [
  { name: "Birthday", image: "https://images.unsplash.com/photo-1530103862676-de8892bc952f?q=80&w=600&auto=format&fit=crop" },
  { name: "Anniversary", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop" },
  { name: "Wedding", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop" },
  { name: "Corporate", image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=600&auto=format&fit=crop" },
  { name: "Festive", image: "https://images.unsplash.com/photo-1582376432754-b63ce6e4ddfc?q=80&w=600&auto=format&fit=crop" }
];

const featuredProducts = [
  { id: "1", name: "The Royal Indulgence", price: 4999, originalPrice: 5999, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop", isNew: true },
  { id: "2", name: "Midnight Chocolate Bliss", price: 2499, image: "https://images.unsplash.com/photo-1540331547168-8b6310ce3a68?q=80&w=600&auto=format&fit=crop" },
  { id: "3", name: "Golden Anniversary Hamper", price: 6500, originalPrice: 7000, image: "https://images.unsplash.com/photo-1577900232427-18219b9166a0?q=80&w=600&auto=format&fit=crop" },
  { id: "4", name: "Self-Care Essentials", price: 3200, image: "https://images.unsplash.com/photo-1583241475880-083f84372725?q=80&w=600&auto=format&fit=crop" }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1920&auto=format&fit=crop"
            alt="Luxury Gift Hamper"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.6]"
            priority
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-secondary font-semibold tracking-[0.2em] uppercase text-sm md:text-base mb-4 block"
          >
            The Art of Gifting
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
          >
            Curating Meaningful Connections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-sans"
          >
            Discover our collection of premium, handcrafted gift hampers designed to make every occasion unforgettable.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="text-base px-8 py-6 w-full sm:w-auto">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6 w-full sm:w-auto bg-transparent text-white border-white hover:bg-white hover:text-primary">
              Build Your Own
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Shop By Occasion */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-primary mb-4">Shop by Occasion</h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide">
            {occasions.map((occ, idx) => (
              <Link href={`/category/${occ.name.toLowerCase()}`} key={idx} className="min-w-[280px] md:min-w-[320px] snap-center group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer">
                <Image src={occ.image} alt={occ.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <h3 className="absolute bottom-6 left-6 text-white text-2xl font-heading font-medium tracking-wide">
                  {occ.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hampers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl text-primary mb-4">Featured Hampers</h2>
              <div className="w-24 h-1 bg-secondary"></div>
            </div>
            <Link href="/shop" className="text-primary font-medium hover:text-secondary hidden md:block">
              View All Collection &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
             <Button variant="outline" className="w-full">View All Collection</Button>
          </div>
        </div>
      </section>

      {/* Build Your Own Teaser */}
      <section className="py-24 relative overflow-hidden bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-secondary font-semibold tracking-wider uppercase text-sm">Personalized Gifting</span>
              <h2 className="text-4xl md:text-5xl leading-tight">Create the Perfect Gift from Scratch</h2>
              <p className="text-primary-foreground/80 text-lg">
                Choose your basket, pick the finest chocolates, select exotic teas, add a personalized message, and we'll handcraft it to perfection.
              </p>
              <ul className="space-y-3 mt-6 mb-8 text-primary-foreground/90">
                <li className="flex items-center gap-3"><span className="text-secondary">✓</span> Choose from 50+ premium items</li>
                <li className="flex items-center gap-3"><span className="text-secondary">✓</span> Luxury eco-friendly packaging</li>
                <li className="flex items-center gap-3"><span className="text-secondary">✓</span> Custom name engraving available</li>
              </ul>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-base">
                Start Building Now
              </Button>
            </div>
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800&auto=format&fit=crop"
                alt="Custom Hamper"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-primary mb-4">The Anubandhan Promise</h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-primary mb-2">
                <Gift size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-heading font-semibold">Premium Packaging</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Every hamper is meticulously packed in luxury, eco-friendly materials that delight.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-primary mb-2">
                <Truck size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-heading font-semibold">Fast Delivery</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Reliable nationwide shipping with carefully handled logistics for perfect condition arrival.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-primary mb-2">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-heading font-semibold">Secure Payments</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">100% secure checkout via Razorpay with multiple payment options including UPI & Cards.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-primary mb-2">
                <Leaf size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-heading font-semibold">Eco-Conscious</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">We source responsibly and use biodegradable materials wherever possible in our packaging.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
