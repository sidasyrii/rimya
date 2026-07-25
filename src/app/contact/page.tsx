"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        const obj = data.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        setSettings(obj);
      }
    }
    loadSettings();
  }, []);

  const email = settings?.store_info?.email || "theanubandha@gmail.com";
  const phone = settings?.store_info?.phone || "+91 98765 43210";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />

      <div className="bg-muted py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Get in Touch</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Have a question about our hampers, corporate gifting, or an existing order? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 max-w-5xl mx-auto">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-bold">Contact Information</h2>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">Our Studio</h3>
                <p className="text-foreground/70 leading-relaxed">
                  123 Luxury Avenue, Sector 45<br />
                  Gurugram, Haryana 122003<br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">Phone</h3>
                <p className="text-foreground/70">{phone}</p>
                <p className="text-sm text-muted-foreground mt-1">Mon-Sat, 9AM to 7PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">Email</h3>
                <p className="text-foreground/70">{email}</p>
                <p className="text-sm text-muted-foreground mt-1">We aim to reply within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-heading font-bold mb-6">Send a Message</h2>
            {success ? (
              <div className="text-center py-12 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="text-success" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-foreground/70">Thank you for reaching out. We will get back to you shortly.</p>
                <Button className="mt-6" variant="outline" onClick={() => setSuccess(false)}>Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input required type="text" className="w-full h-12 px-4 border border-border rounded-md focus:border-primary focus:outline-none bg-background" placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input required type="email" className="w-full h-12 px-4 border border-border rounded-md focus:border-primary focus:outline-none bg-background" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <select className="w-full h-12 px-4 border border-border rounded-md focus:border-primary focus:outline-none bg-background">
                    <option>General Inquiry</option>
                    <option>Order Status</option>
                    <option>Corporate Gifting</option>
                    <option>Returns/Refunds</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea required className="w-full p-4 border border-border rounded-md focus:border-primary focus:outline-none bg-background min-h-[120px] resize-y" placeholder="How can we help you?"></textarea>
                </div>
                <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
