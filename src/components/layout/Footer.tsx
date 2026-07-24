import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src="/Anubandha-logo.jpeg" alt="Anubandha Logo" className="h-12 object-contain" />
              <h2 className="font-heading font-bold text-3xl">Anubandha</h2>
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
              <li>support@Anubandha.com</li>
              <li>+91 98765 43210</li>
              <li>Mon - Sat, 9am - 7pm IST</li>
            </ul>
            <div className="flex space-x-4">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Anubandha. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
