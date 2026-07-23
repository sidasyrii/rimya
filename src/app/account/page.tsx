"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { User, MapPin, Package, Heart, CreditCard, Bell, LogOut, ChevronRight, Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useAddressStore, Address } from "@/store/useAddressStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, isLoaded } = useUserStore();
  const router = useRouter();
  const supabase = createClient();

  // Redirect if not logged in
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/login?redirect=/account");
    }
  }, [user, isLoaded, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!isLoaded || !user) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
        <Footer />
      </main>
    );
  }

  const sidebarLinks = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "payments", label: "Saved Payments", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />

      <div className="bg-muted py-8 mb-8 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary">My Account</h1>
          <p className="text-foreground/70 mt-2">Welcome back, {user.user_metadata?.first_name || user.email?.split('@')[0]}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-24">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/80 hover:bg-muted'}`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                      {link.label}
                    </span>
                    <ChevronRight size={16} className={isActive ? "text-primary opacity-100" : "opacity-0"} />
                  </button>
                );
              })}
              <div className="h-px bg-border my-4 mx-3"></div>
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-left">
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm min-h-[500px]">
            {activeTab === "profile" && <ProfileTab user={user} />}
            {activeTab === "orders" && <OrdersTab user={user} />}
            {activeTab === "addresses" && <AddressesTab user={user} />}
            {activeTab === "wishlist" && <WishlistTab />}
            {activeTab === "payments" && <PlaceholderTab icon={CreditCard} title="Saved Payments" type="payments" />}
            {activeTab === "notifications" && <PlaceholderTab icon={Bell} title="Notifications" type="notifications" />}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function ProfileTab({ user }: { user: any }) {
  const supabase = createClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.user_metadata?.first_name || '',
    last_name: user.user_metadata?.last_name || '',
    phone: user.user_metadata?.phone || ''
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone
        }
      });
      if (error) throw error;
      
      // Also update profiles table if it exists
      await supabase.from('profiles').update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone
      }).eq('id', user.id);

      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-semibold">Personal Information</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit2 size={16} className="mr-2" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">Cancel</Button>
            <Button onClick={handleSave} size="sm" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null} Save
            </Button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name</label>
          <input 
            type="text" 
            className="w-full h-12 px-4 border border-border rounded-md bg-background focus:border-primary focus:outline-none disabled:bg-muted/50 disabled:opacity-70" 
            value={formData.first_name}
            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            disabled={!isEditing} 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name</label>
          <input 
            type="text" 
            className="w-full h-12 px-4 border border-border rounded-md bg-background focus:border-primary focus:outline-none disabled:bg-muted/50 disabled:opacity-70" 
            value={formData.last_name}
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            disabled={!isEditing} 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Email Address</label>
          <input 
            type="email" 
            className="w-full h-12 px-4 border border-border rounded-md bg-muted/50 opacity-70" 
            value={user.email} 
            disabled 
          />
          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Phone Number</label>
          <input 
            type="tel" 
            className="w-full h-12 px-4 border border-border rounded-md bg-background focus:border-primary focus:outline-none disabled:bg-muted/50 disabled:opacity-70" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            disabled={!isEditing} 
            placeholder="+91 "
          />
        </div>
      </div>
      
      <div className="pt-8 border-t border-border mt-8">
        <h3 className="font-heading font-semibold text-lg mb-4">Password</h3>
        <Button variant="outline" onClick={() => alert("Password reset functionality would send an email here.")}>Reset Password</Button>
      </div>
    </div>
  );
}

function AddressesTab({ user }: { user: any }) {
  const { addresses, fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, isLoading } = useAddressStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    label: 'Home',
    full_name: user.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : '',
    phone: user.user_metadata?.phone || '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses(user.id);
  }, [user.id, fetchAddresses]);

  const openModal = (address?: Address) => {
    if (address) {
      setEditingId(address.id);
      setFormData({
        label: address.label,
        full_name: address.full_name,
        phone: address.phone,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        is_default: address.is_default
      });
    } else {
      setEditingId(null);
      setFormData({
        label: 'Home',
        full_name: user.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : '',
        phone: user.user_metadata?.phone || '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        pincode: '',
        is_default: addresses.length === 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateAddress(editingId, formData);
    } else {
      await addAddress(user.id, formData, formData.is_default);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-semibold">Saved Addresses</h2>
        <Button onClick={() => openModal()}><Plus size={18} className="mr-2" /> Add New</Button>
      </div>

      {isLoading && addresses.length === 0 ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed border-border">
          <MapPin size={32} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="font-heading font-semibold text-lg mb-2">No addresses saved</h3>
          <p className="text-foreground/70 mb-4">Add an address for faster checkout.</p>
          <Button onClick={() => openModal()} variant="outline">Add Address</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map(address => (
            <div key={address.id} className={`border rounded-lg p-5 relative transition-colors ${address.is_default ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}>
              {address.is_default && (
                <span className="absolute top-4 right-4 text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded">Default</span>
              )}
              
              <div className="mb-2">
                <span className="text-xs font-bold bg-muted px-2 py-1 rounded text-foreground uppercase tracking-wider">{address.label}</span>
              </div>
              <h3 className="font-bold text-foreground mb-1 mt-3">{address.full_name}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed mb-2">
                {address.address_line1}<br/>
                {address.address_line2 && <>{address.address_line2}<br/></>}
                {address.city}, {address.state} - {address.pincode}
              </p>
              <p className="text-sm text-foreground/70">{address.phone}</p>
              
              <div className="flex gap-4 mt-6 pt-4 border-t border-border/50">
                <button onClick={() => openModal(address)} className="text-sm font-medium text-primary hover:underline flex items-center">
                  <Edit2 size={14} className="mr-1" /> Edit
                </button>
                <button onClick={() => deleteAddress(address.id)} className="text-sm font-medium text-destructive hover:underline flex items-center">
                  <Trash2 size={14} className="mr-1" /> Delete
                </button>
                {!address.is_default && (
                  <button onClick={() => setDefaultAddress(user.id, address.id)} className="text-sm font-medium text-foreground/70 hover:text-primary ml-auto">
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-heading font-bold text-xl">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Save as</label>
                  <div className="flex gap-4">
                    {['Home', 'Office', 'Other'].map(l => (
                      <label key={l} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="label" checked={formData.label === l} onChange={() => setFormData({...formData, label: l})} className="accent-primary" />
                        <span className="text-sm">{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input required type="text" className="w-full h-10 px-3 border border-border rounded-md bg-background focus:border-primary focus:outline-none" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input required type="tel" className="w-full h-10 px-3 border border-border rounded-md bg-background focus:border-primary focus:outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Address Line 1</label>
                  <input required type="text" className="w-full h-10 px-3 border border-border rounded-md bg-background focus:border-primary focus:outline-none" value={formData.address_line1} onChange={e => setFormData({...formData, address_line1: e.target.value})} placeholder="House/Flat No., Building, Street" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Address Line 2 (Optional)</label>
                  <input type="text" className="w-full h-10 px-3 border border-border rounded-md bg-background focus:border-primary focus:outline-none" value={formData.address_line2} onChange={e => setFormData({...formData, address_line2: e.target.value})} placeholder="Landmark, Area" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pincode</label>
                  <input required type="text" className="w-full h-10 px-3 border border-border rounded-md bg-background focus:border-primary focus:outline-none" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <input required type="text" className="w-full h-10 px-3 border border-border rounded-md bg-background focus:border-primary focus:outline-none" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">State</label>
                  <input required type="text" className="w-full h-10 px-3 border border-border rounded-md bg-background focus:border-primary focus:outline-none" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                </div>

                <div className="col-span-2 flex items-center gap-2 mt-2">
                  <input type="checkbox" id="is_default" checked={formData.is_default} onChange={e => setFormData({...formData, is_default: e.target.checked})} className="accent-primary w-4 h-4 rounded" />
                  <label htmlFor="is_default" className="text-sm cursor-pointer">Set as default address</label>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <Button type="button" variant="outline" className="w-full" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="w-full">Save Address</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function WishlistTab() {
  const { items } = useWishlistStore();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (items.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      
      const { data } = await supabase
        .from('products')
        .select('*')
        .in('id', items);
        
      if (data) {
        setProducts(data);
      }
      setIsLoading(false);
    }
    
    fetchWishlistProducts();
  }, [items, supabase]);

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Heart size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-heading font-bold mb-2">Your wishlist is empty</h3>
        <p className="text-foreground/70 mb-6">Save items you love to your wishlist to buy them later.</p>
        <Link href="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-heading font-semibold mb-6">My Wishlist ({products.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <ProductCard 
            key={p.id}
            id={p.id}
            name={p.name}
            price={p.price}
            image={p.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48'} 
          />
        ))}
      </div>
    </div>
  );
}

function OrdersTab({ user }: { user: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, images)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (data) setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, [supabase]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-heading font-semibold mb-6">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-20 border border-dashed border-border rounded-xl bg-muted/30">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-heading font-bold mb-2">No orders yet</h3>
          <p className="text-foreground/70 mb-6">When you place an order, it will appear here.</p>
          <Link href="/shop"><Button>Start Shopping</Button></Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border border-border rounded-xl p-6">
              <div className="flex flex-wrap justify-between items-start mb-4 pb-4 border-b border-border/50 gap-4">
                <div>
                  <p className="text-sm text-foreground/70 mb-1">Order #{order.id.slice(0,8)}</p>
                  <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground/70 mb-1">Total</p>
                  <p className="font-semibold text-primary">₹{order.total?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0 relative">
                      {item.products?.images?.[0] ? (
                        <img src={item.products.images[0]} alt={item.products.name} className="object-cover w-full h-full" />
                      ) : (
                        <Package className="absolute inset-0 m-auto text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.products?.name}</p>
                      <p className="text-sm text-foreground/70 mt-1">Qty: {item.quantity} × ₹{item.price_at_time?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlaceholderTab({ icon: Icon, title, type }: { icon: any, title: string, type: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-in fade-in duration-300">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon size={24} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-heading font-bold mb-2">No data available</h3>
      <p className="text-foreground/70">You don't have any {type} saved yet.</p>
    </div>
  );
}
