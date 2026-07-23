"use client";

import { format } from "date-fns";
import { Mail, Phone, Calendar, MapPin, ShoppingBag, CheckCircle, Clock, Truck, XCircle, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CustomerDetailClient({ profile, email, orders, addresses }: { profile: any, email: string, orders: any[], addresses: any[] }) {
  
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600"><Clock size={14} /> Pending</span>;
      case 'processing': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600"><Package size={14} /> Processing</span>;
      case 'shipped': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-600"><Truck size={14} /> Shipped</span>;
      case 'delivered': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success"><CheckCircle size={14} /> Delivered</span>;
      case 'cancelled': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive"><XCircle size={14} /> Cancelled</span>;
      default: return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">{status}</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar Profile Card */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col items-center text-center border-b border-border">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 text-2xl font-bold">
              {profile.first_name?.[0]}{profile.last_name?.[0]}
            </div>
            <h2 className="text-xl font-bold">{profile.first_name} {profile.last_name}</h2>
            <p className="text-muted-foreground text-sm capitalize">{profile.role}</p>
          </div>
          
          <div className="p-6 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="text-muted-foreground" size={16} />
              <span>{email}</span>
            </div>
            {profile.phone_number && (
              <div className="flex items-center gap-3">
                <Phone className="text-muted-foreground" size={16} />
                <span>{profile.phone_number}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="text-muted-foreground" size={16} />
              <span>Joined {format(new Date(profile.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> Saved Addresses
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No saved addresses.</p>
            ) : (
              addresses.map((address) => (
                <div key={address.id} className="text-sm pb-4 border-b border-border last:border-0 last:pb-0">
                  {address.is_default && (
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded mb-1">Default</span>
                  )}
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.pincode}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Orders */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <p className="text-sm font-medium text-foreground/60 flex items-center gap-2">
              <ShoppingBag size={16} /> Total Orders
            </p>
            <h3 className="text-3xl font-bold mt-2">{totalOrders}</h3>
          </div>
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <p className="text-sm font-medium text-foreground/60 flex items-center gap-2">
              <span className="text-primary font-bold font-serif text-lg leading-none">₹</span> Total Spent
            </p>
            <h3 className="text-3xl font-bold mt-2 text-primary">₹{totalSpent.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
            <h2 className="text-lg font-bold font-heading">Order History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium text-primary">
                        {order.id.split('-')[0]}
                      </td>
                      <td className="px-6 py-4 text-foreground/70 whitespace-nowrap">
                        {format(new Date(order.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="h-8">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
