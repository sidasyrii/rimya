"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, Clock, Package, CheckCircle, Truck, XCircle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { updateOrderStatus } from "./actions";

export function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    const userData = order.user?.raw_user_meta_data;
    const customerName = userData?.first_name 
      ? `${userData.first_name} ${userData.last_name || ''}`.toLowerCase()
      : '';
    const email = (order.user?.email || '').toLowerCase();
    const orderId = order.id.toLowerCase();
    
    const matchesSearch = search === "" 
      || orderId.includes(search.toLowerCase()) 
      || customerName.includes(search.toLowerCase()) 
      || email.includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsProcessing(orderId);
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      alert("Error updating order: " + res.error);
    }
    setIsProcessing(null);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30">
        <h1 className="text-2xl font-bold font-heading text-primary">Orders</h1>
        <p className="text-sm text-foreground/70">View and manage customer orders.</p>

        {/* Filters and Search */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search ID, Name, Email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="relative hidden sm:block w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 pl-10 pr-8 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer capitalize"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No orders found matching your filters.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const userData = order.user?.raw_user_meta_data;
                const customerName = userData?.first_name 
                  ? `${userData.first_name} ${userData.last_name || ''}`
                  : order.user?.email || 'Guest';

                return (
                  <tr key={order.id} className={`border-b border-border transition-colors hover:bg-muted/30 ${isProcessing === order.id ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4 font-mono text-xs font-medium text-primary">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                        {order.id.split('-')[0]}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-foreground/70 whitespace-nowrap">
                      {format(new Date(order.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={isProcessing === order.id}
                          className="h-8 px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:border-primary capitalize cursor-pointer hidden sm:block"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="h-8 gap-2">
                            <Eye size={14} /> View
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
