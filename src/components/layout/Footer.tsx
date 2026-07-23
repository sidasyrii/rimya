import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src="/anubandhan-logo.jpeg" alt="Anubandhan Logo" className="h-12 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <h2 className="font-heading font-bold text-3xl">Anubandhan</h2>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs">
              Curating meaningful connections through luxury gift hampers for every special occasion.
            </p>
            <div className="pt-2">
              <p className="text-sm font-semibold mb-3 uppercase tracking-wider text-secondary">Join our newsletter</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 px-4 py-2 w-full focus:outline-none focus:border-secondary transition-colors rounded-l-sm"
                />
                <button className="bg-secondary text-secondary-foreground px-4 py-2 font-medium hover:bg-secondary/90 transition-colors rounded-r-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6 text-secondary">Shop</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/personalized-hampers" className="hover:text-secondary transition-colors">Personalized Hampers</Link></li>
              <li><Link href="/corporate-gifting" className="hover:text-secondary transition-colors">Corporate Gifting</Link></li>
              <li><Link href="/occasions" className="hover:text-secondary transition-colors">Shop by Occasion</Link></li>
              <li><Link href="/recipients" className="hover:text-secondary transition-colors">Shop by Recipient</Link></li>
              <li><Link href="/build-your-own" className="hover:text-secondary transition-colors">Build Your Own Hamper</Link></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6 text-secondary">Help</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/faq" className="hover:text-secondary transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-secondary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-secondary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/track-order" className="hover:text-secondary transition-colors">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6 text-secondary">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80 mb-6">
              <li>support@anubandhan.com</li>
              <li>+91 98765 43210</li>
              <li>Mon - Sat, 9am - 7pm IST</li>
            </ul>
            <div className="flex space-x-4">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Anubandhan. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
