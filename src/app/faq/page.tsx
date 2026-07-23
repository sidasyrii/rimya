"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "What makes Anubandhan hampers premium?",
    answer: "Every Anubandhan hamper is crafted using the highest quality materials, including velvet-lined mahogany finish wooden boxes, artisanal chocolates sourced globally, and premium ribbons. Our attention to detail in packaging and product curation sets us apart in the luxury gifting space."
  },
  {
    question: "Do you offer same-day delivery?",
    answer: "Currently, we offer same-day delivery only in Tier 1 cities (Delhi NCR, Mumbai, Bangalore) for orders placed before 12 PM. For all other locations, express shipping takes 2-3 business days."
  },
  {
    question: "Can I customize a hamper completely?",
    answer: "Yes! Our 'Build Your Own' section allows you to select a box type and individually add products of your choice to create a 100% personalized gifting experience."
  },
  {
    question: "Do you handle large corporate orders?",
    answer: "Absolutely. We specialize in corporate gifting and offer bulk discounts, company logo embossing on boxes, and multi-address shipping. Please visit our Corporate Gifting page to request a quote."
  },
  {
    question: "Are the chocolates eggless?",
    answer: "Yes, 100% of the chocolates and baked goods in our standard hampers are eggless. We also offer dedicated vegan and gluten-free hamper options."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Frequently Asked Questions</h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Find answers to common questions about our hampers, shipping, and corporate services.
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-lg overflow-hidden transition-colors ${openIndex === index ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-heading font-semibold text-lg text-foreground">{faq.question}</span>
                {openIndex === index ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-muted-foreground" />}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0 animate-in fade-in duration-300">
                  <p className="text-foreground/80 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-muted rounded-2xl p-8 md:p-12 text-center border border-border">
          <h2 className="text-2xl font-heading font-bold mb-4">Still have questions?</h2>
          <p className="text-foreground/70 mb-8 max-w-md mx-auto">
            Our dedicated gifting concierge team is here to help you find the perfect gift.
          </p>
          <Link href="/contact">
            <Button size="lg" className="px-8">Contact Support</Button>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
