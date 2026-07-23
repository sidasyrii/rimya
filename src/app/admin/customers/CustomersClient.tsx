"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, Eye, User, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CustomersClient({ profiles, orders }: { profiles: any[], orders: any[] }) {
  const [search, setSearch] = useState("");

  // Aggregate data per user
  const customerData = profiles.map(profile => {
    const userOrders = orders.filter(o => o.user_id === profile.id);
    const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
    const orderCount = userOrders.length;
    
    return {
      ...profile,
      totalSpent,
      orderCount
    };
  });

  const filteredCustomers = customerData.filter(c => {
    const name = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase();
    const phone = c.phone_number || '';
    
    return search === "" || name.includes(search.toLowerCase()) || phone.includes(search);
  });

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30">
        <h1 className="text-2xl font-bold font-heading text-primary">Customers</h1>
        <p className="text-sm text-foreground/70">Manage your store's registered users.</p>

        {/* Search */}
        <div className="mt-6 flex items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Orders</th>
              <th className="px-6 py-4 font-medium">Total Spent</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No customers found matching your search.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <User size={18} />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {customer.phone_number || 'No phone'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {customer.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        <ShieldAlert size={12} /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        Customer
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {customer.orderCount}
                  </td>
                  <td className="px-6 py-4 font-medium text-primary">
                    ₹{customer.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {format(new Date(customer.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/customers/${customer.id}`}>
                      <Button variant="outline" size="sm" className="h-8 gap-2">
                        <Eye size={14} /> View
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
  );
}
