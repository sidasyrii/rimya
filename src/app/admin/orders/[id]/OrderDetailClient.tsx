"use client";

import { useState } from "react";
import { User, MapPin, CreditCard, Truck, AlertCircle, Save, Loader2, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateOrderStatus, updateTrackingNumber, addOrderNote } from "../actions";
import Image from "next/image";

export function OrderDetailClient({ order, address }: { order: any, address: any }) {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || "");
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || "");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingTracking, setIsSavingTracking] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const userData = order.user?.raw_user_meta_data;
  const customerName = userData?.first_name 
    ? `${userData.first_name} ${userData.last_name || ''}`
    : order.user?.email || 'Guest';

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsSavingStatus(true);
    const res = await updateOrderStatus(order.id, newStatus);
    if (res.success) {
      setStatus(newStatus);
    } else {
      alert("Failed to update status: " + res.error);
    }
    setIsSavingStatus(false);
  };

  const handleSaveTracking = async () => {
    setIsSavingTracking(true);
    const res = await updateTrackingNumber(order.id, trackingNumber);
    if (!res.success) {
      alert("Failed to save tracking: " + res.error);
    }
    setIsSavingTracking(false);
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    const res = await addOrderNote(order.id, adminNotes);
    if (!res.success) {
      alert("Failed to save notes: " + res.error);
    }
    setIsSavingNotes(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Items List */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h2 className="text-lg font-bold font-heading">Order Items</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative border border-border">
                    {item.product?.images?.[0] ? (
                      <Image src={item.product.images[0]} alt={item.product.name || 'Product'} fill sizes="80px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground">{item.product?.name || 'Unknown Product'}</h4>
                    <div className="text-sm text-muted-foreground mt-1">Qty: {item.quantity} × ₹{item.price_at_time.toLocaleString('en-IN')}</div>
                    {item.gift_message && (
                      <div className="mt-2 text-xs bg-muted/50 p-2 rounded-md border border-border/50">
                        <span className="font-semibold">Gift Message:</span> {item.gift_message}
                      </div>
                    )}
                  </div>
                  <div className="font-semibold text-right">
                    ₹{(item.quantity * item.price_at_time).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-muted/10 border-t border-border">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gift Wrap</span>
                <span>₹{order.gift_wrap.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t border-border mt-2">
                <span>Total</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline / Status */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h2 className="text-lg font-bold font-heading">Order Workflow</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Update Status</label>
              <div className="flex gap-3">
                <select 
                  value={status}
                  onChange={handleStatusChange}
                  disabled={isSavingStatus}
                  className="flex-1 h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary capitalize"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {isSavingStatus && <Loader2 className="animate-spin text-primary mt-2" size={20} />}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <label className="block text-sm font-semibold mb-2">Tracking Number</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BLUEDART123456"
                  className="flex-1 h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                />
                <Button onClick={handleSaveTracking} disabled={isSavingTracking || trackingNumber === order.tracking_number} className="w-24">
                  {isSavingTracking ? <Loader2 className="animate-spin" size={16} /> : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Column */}
      <div className="space-y-6">
        {/* Customer Info */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30 font-semibold flex items-center gap-2">
            <User size={16} className="text-primary" /> Customer Details
          </div>
          <div className="p-4 space-y-4 text-sm">
            <div>
              <p className="font-semibold">{customerName}</p>
              <p className="text-muted-foreground">{order.user?.email}</p>
              {userData?.phone_number && <p className="text-muted-foreground">{userData.phone_number}</p>}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30 font-semibold flex items-center gap-2">
            <MapPin size={16} className="text-primary" /> Shipping Address
          </div>
          <div className="p-4 text-sm">
            {address ? (
              <div className="space-y-1">
                <p className="font-semibold">{customerName}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.pincode}</p>
              </div>
            ) : (
              <p className="text-muted-foreground flex items-center gap-2">
                <AlertCircle size={14} /> Address details not found.
              </p>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30 font-semibold flex items-center gap-2">
            <CreditCard size={16} className="text-primary" /> Payment Information
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Razorpay Order ID</p>
              <p className="font-mono bg-muted/50 p-1.5 rounded border border-border/50 text-xs break-all">
                {order.razorpay_order_id || 'N/A'}
              </p>
            </div>
            {order.razorpay_payment_id && (
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Payment ID</p>
                <p className="font-mono bg-muted/50 p-1.5 rounded border border-border/50 text-xs break-all">
                  {order.razorpay_payment_id}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Notes */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden border-yellow-500/20">
          <div className="p-4 border-b border-border bg-yellow-500/10 font-semibold flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
            <Clipboard size={16} /> Admin Notes
          </div>
          <div className="p-4">
            <textarea 
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal notes... (not visible to customer)"
              className="w-full h-24 p-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-yellow-500 resize-none"
            />
            <Button 
              onClick={handleSaveNotes} 
              disabled={isSavingNotes || adminNotes === order.admin_notes} 
              className="w-full mt-3 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {isSavingNotes ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Save Notes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
