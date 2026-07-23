"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1540331547168-8b6310ce3a68?q=80&w=1600&auto=format&fit=crop" 
          alt="Anubandhan Background" 
          fill 
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary-foreground mb-6">Our Story</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 font-light italic">
            "More than just a gift, it's an expression of your deepest emotions."
          </p>
        </div>
      </section>

      {/* The Anubandhan Meaning */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1577900232427-18219b9166a0?q=80&w=800&auto=format&fit=crop" alt="Premium Hampers" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-secondary uppercase tracking-widest">Philosophy</h2>
              <h3 className="text-4xl font-heading font-bold text-primary">The Meaning of Anubandhan</h3>
              <p className="text-foreground/80 leading-relaxed text-lg">
                In Sanskrit, "Anubandhan" signifies a bond—an unbreakable connection of love, respect, and gratitude. We founded this brand on the belief that gifting should not be a mere transaction, but a profound expression of your relationship with the recipient.
              </p>
              <p className="text-foreground/80 leading-relaxed text-lg">
                Every hamper we create is meticulously curated to evoke emotion. From the selection of artisanal chocolates to the premium mahogany boxes, every element is designed to make the recipient feel truly special and deeply valued.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Our Journey</h2>
            <div className="w-16 h-1 bg-secondary mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {[
              { year: "2020", title: "The Idea", desc: "Started as a small passion project during the pandemic to help people stay connected." },
              { year: "2022", title: "Luxury Redefined", desc: "Pioneered the introduction of velvet-lined wooden keepsake boxes in the premium gifting market." },
              { year: "2024", title: "Corporate Excellence", desc: "Partnered with over 50 Fortune 500 companies for their executive gifting needs." },
              { year: "2026", title: "Global Expansion", desc: "Launching international shipping, spreading the joy of Anubandhan globally." }
            ].map((milestone, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
                <div className="w-24 flex-shrink-0 text-3xl font-heading font-bold text-secondary">{milestone.year}</div>
                <div className="hidden md:block w-px h-16 bg-primary/20 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-foreground mb-2">{milestone.title}</h4>
                  <p className="text-foreground/70">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold mb-6">Ready to make someone's day?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-10 text-lg">
            Explore our curated collections or build a personalized hamper from scratch.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/shop">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-lg">Explore Collections</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
