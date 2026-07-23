"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

export function FilterSidebar({
  onCategoryChange,
  onPriceChange,
  onInStockChange
}: {
  onCategoryChange?: (cats: string[]) => void;
  onPriceChange?: (price: number) => void;
  onInStockChange?: (val: boolean) => void;
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    rating: true,
    occasion: true,
    recipient: true,
    availability: true,
  });

  const [priceRange, setPriceRange] = useState(20000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (cat: string) => {
    const newCats = selectedCategories.includes(cat)
      ? selectedCategories.filter(c => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(newCats);
    if (onCategoryChange) onCategoryChange(newCats);
  };

  const handlePriceChange = (val: number) => {
    setPriceRange(val);
    if (onPriceChange) onPriceChange(val);
  };

  const handleInStockToggle = (val: boolean) => {
    setInStockOnly(val);
    if (onInStockChange) onInStockChange(val);
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        
        {/* Category Filter */}
        <div className="border-b border-border pb-6">
          <button 
            className="flex w-full items-center justify-between font-heading font-semibold text-lg mb-4"
            onClick={() => toggleSection("category")}
          >
            Category
            {openSections.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {openSections.category && (
            <div className="space-y-3">
              {['Chocolates', 'Dry Fruits', 'Wellness', 'Gourmet', 'Flowers'].map(cat => (
                <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4 accent-primary" 
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-primary transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Price Slider Filter */}
        <div className="border-b border-border pb-6">
          <button 
            className="flex w-full items-center justify-between font-heading font-semibold text-lg mb-4"
            onClick={() => toggleSection("price")}
          >
            Price Range
            {openSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {openSections.price && (
            <div className="px-1">
              <input 
                type="range" 
                min="500" 
                max="20000" 
                step="500"
                value={priceRange}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-3 text-sm font-medium text-foreground/80">
                <span>₹500</span>
                <span className="text-primary font-bold">Up to ₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Rating Filter (Mock) */}
        <div className="border-b border-border pb-6 opacity-50 pointer-events-none">
          <button 
            className="flex w-full items-center justify-between font-heading font-semibold text-lg mb-4"
            onClick={() => toggleSection("rating")}
          >
            Rating (Coming Soon)
            {openSections.rating ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Occasion Filter (Mock) */}
        <div className="border-b border-border pb-6 opacity-50 pointer-events-none">
          <button 
            className="flex w-full items-center justify-between font-heading font-semibold text-lg mb-4"
          >
            Occasion (Coming Soon)
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Recipient Filter (Mock) */}
        <div className="border-b border-border pb-6 opacity-50 pointer-events-none">
          <button 
            className="flex w-full items-center justify-between font-heading font-semibold text-lg mb-4"
          >
            Recipient (Coming Soon)
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Availability Filter */}
        <div className="pb-6">
          <button 
            className="flex w-full items-center justify-between font-heading font-semibold text-lg mb-4"
            onClick={() => toggleSection("availability")}
          >
            Availability
            {openSections.availability ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {openSections.availability && (
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={inStockOnly}
                  onChange={(e) => handleInStockToggle(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4 accent-primary" 
                />
                <span className="text-sm text-foreground/80 group-hover:text-primary transition-colors">In Stock Only</span>
              </label>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}
