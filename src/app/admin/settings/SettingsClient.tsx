"use client";

import { useState } from "react";
import { Store, Truck, Link as LinkIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateSettings } from "./actions";

export function SettingsClient({ initialSettings }: { initialSettings: Record<string, any> }) {
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize with defaults if missing
  const defaultStoreInfo = { name: "Anubandha", email: "", phone: "" };
  const defaultShipping = { free_threshold: 5000, flat_rate: 100 };
  const defaultSocial = { instagram: "", facebook: "", twitter: "", youtube: "" };

  const [storeInfo, setStoreInfo] = useState(initialSettings.store_info || defaultStoreInfo);
  const [shipping, setShipping] = useState(initialSettings.shipping || defaultShipping);
  const [social, setSocial] = useState(initialSettings.social_links || defaultSocial);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      store_info: storeInfo,
      shipping: shipping,
      social_links: social
    };

    const res = await updateSettings(payload);
    
    if (res.success) {
      alert("Settings saved successfully!");
    } else {
      alert("Error saving settings: " + res.error);
    }
    
    setIsSaving(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden max-w-4xl">
      <div className="p-6 border-b border-border bg-muted/30">
        <h1 className="text-2xl font-bold font-heading text-primary">Site Settings</h1>
        <p className="text-sm text-foreground/70">Manage global store configuration.</p>
      </div>

      <form onSubmit={handleSubmit} className="divide-y divide-border">
        
        {/* Store Info */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h3 className="font-semibold flex items-center gap-2">
              <Store size={18} className="text-primary" /> Store Details
            </h3>
            <p className="text-sm text-muted-foreground mt-1">General information about your business.</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Store Name</label>
              <input 
                type="text" 
                value={storeInfo.name}
                onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})}
                className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Support Email</label>
              <input 
                type="email" 
                value={storeInfo.email}
                onChange={(e) => setStoreInfo({...storeInfo, email: e.target.value})}
                className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Support Phone</label>
              <input 
                type="text" 
                value={storeInfo.phone}
                onChange={(e) => setStoreInfo({...storeInfo, phone: e.target.value})}
                className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Tax */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h3 className="font-semibold flex items-center gap-2">
              <Truck size={18} className="text-primary" /> Shipping
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Configure shipping thresholds and rates.</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Free Shipping Threshold (₹)</label>
              <input 
                type="number" 
                value={shipping.free_threshold}
                onChange={(e) => setShipping({...shipping, free_threshold: parseInt(e.target.value) || 0})}
                className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">Orders above this amount get free shipping.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Flat Shipping Rate (₹)</label>
              <input 
                type="number" 
                value={shipping.flat_rate}
                onChange={(e) => setShipping({...shipping, flat_rate: parseInt(e.target.value) || 0})}
                className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">Charged if order is below the free threshold.</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h3 className="font-semibold flex items-center gap-2">
              <LinkIcon size={18} className="text-primary" /> Social Links
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Links displayed in the footer.</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Instagram URL</label>
              <input 
                type="url" 
                value={social.instagram}
                onChange={(e) => setSocial({...social, instagram: e.target.value})}
                placeholder="https://instagram.com/..."
                className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Facebook URL</label>
              <input 
                type="url" 
                value={social.facebook}
                onChange={(e) => setSocial({...social, facebook: e.target.value})}
                placeholder="https://facebook.com/..."
                className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Twitter / X URL</label>
              <input 
                type="url" 
                value={social.twitter}
                onChange={(e) => setSocial({...social, twitter: e.target.value})}
                placeholder="https://twitter.com/..."
                className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">YouTube URL</label>
              <input 
                type="url" 
                value={social.youtube}
                onChange={(e) => setSocial({...social, youtube: e.target.value})}
                placeholder="https://youtube.com/..."
                className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted/30 flex justify-end">
          <Button type="submit" disabled={isSaving} className="min-w-[120px]">
            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Settings'}
          </Button>
        </div>

      </form>
    </div>
  );
}
