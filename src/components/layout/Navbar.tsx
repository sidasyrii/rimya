"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Heart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useUIStore } from "@/store/useUIStore";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { openCart } = useUIStore();
  const { user } = useUserStore();
  const cartItemsCount = useCartStore(state => state.getTotalItems());
  const wishlistItemsCount = useWishlistStore(state => state.items.length);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Chocolates", href: "/category/chocolates" },
    { name: "Corporate Gifting", href: "/contact" },
    { name: "Track Order", href: "/track-order" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const MOCK_SUGGESTIONS = [
    "Luxury Chocolate Hamper",
    "Birthday Gift Box",
    "Corporate Premium Set",
    "Anniversary Special"
  ].filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || isSearchOpen
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2" onClick={() => setIsSearchOpen(false)}>
            <img src="/anubandhan-logo.jpeg" alt="Anubandhan Logo" className={cn("object-contain transition-all duration-300", isScrolled || isSearchOpen ? "h-10" : "h-14")} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <h1 className={cn(
              "font-heading font-bold tracking-tight text-primary transition-colors hidden md:block",
              isScrolled || isSearchOpen ? "text-2xl" : "text-3xl"
            )}>
              Anubandhan
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className={cn("hidden md:flex items-center space-x-8 transition-opacity duration-300", isSearchOpen ? "opacity-0 pointer-events-none absolute" : "opacity-100 relative")}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar (Desktop Overlay) */}
          <div className={cn(
            "hidden md:flex absolute left-1/2 -translate-x-1/2 w-full max-w-xl transition-all duration-300",
            isSearchOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95 pointer-events-none"
          )}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search for hampers, occasions, or gifts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-12 bg-muted/50 border border-border rounded-full focus:outline-none focus:border-primary focus:bg-background transition-colors"
              />
              <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground">
                <X size={20} />
              </button>

              {/* Search Suggestions Dropdown */}
              {searchQuery && (
                <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-xl shadow-lg py-2 overflow-hidden">
                  {MOCK_SUGGESTIONS.length > 0 ? (
                    MOCK_SUGGESTIONS.map((suggestion, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-muted/50 flex items-center justify-between text-sm text-foreground/80 hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-3"><Search size={14} className="text-muted-foreground" /> {suggestion}</span>
                        <ArrowRight size={14} />
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-muted-foreground">Press Enter to search for "{searchQuery}"</div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4 md:space-x-6 text-foreground/80 z-10 relative">
            <button 
              className={cn("hover:text-primary transition-colors hidden md:block", isSearchOpen && "text-primary")}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link href="/wishlist" className="hover:text-primary transition-colors hidden md:block relative">
              <Heart size={20} strokeWidth={1.5} />
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>
            <Link href={user ? "/account" : "/login?redirect=/account"} className="hover:text-primary transition-colors hidden md:block">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <button onClick={openCart} className="hover:text-primary transition-colors relative cursor-pointer">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-background z-50 md:hidden shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <img src="/anubandhan-logo.jpeg" alt="Anubandhan Logo" className="h-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <h2 className="font-heading font-bold text-2xl text-primary">Anubandhan</h2>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-foreground/60 hover:text-foreground">
                    <X size={24} strokeWidth={1.5} />
                  </button>
                </div>
                
                <form onSubmit={handleSearchSubmit} className="relative w-full mb-8">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-muted border border-border rounded-md focus:outline-none focus:border-primary text-sm"
                  />
                </form>

                <nav className="flex flex-col space-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  <div className="h-px bg-border my-4"></div>
                  
                  <Link href={user ? "/account" : "/login?redirect=/account"} className="flex items-center text-foreground/80 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={20} className="mr-3" strokeWidth={1.5} />
                    {user ? "My Account" : "Sign In"}
                  </Link>
                  <Link href="/wishlist" className="flex items-center text-foreground/80 hover:text-primary">
                    <Heart size={20} className="mr-3" strokeWidth={1.5} />
                    Wishlist
                  </Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
