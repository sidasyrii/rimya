"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCoupon, updateCoupon, deleteCoupon, toggleCouponActive } from "./actions";

export function CouponsClient({ initialCoupons }: { initialCoupons: any[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 0,
    min_order_value: 0,
    max_uses: "",
    expires_at: "",
  });

  const handleOpenNew = () => {
    setFormData({ 
      code: "", 
      discount_type: "percentage", 
      discount_value: 0,
      min_order_value: 0,
      max_uses: "",
      expires_at: "",
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon: any) => {
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_order_value,
      max_uses: coupon.max_uses === null ? "" : coupon.max_uses,
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : "",
    });
    setEditingId(coupon.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const payload = {
      ...formData,
      code: formData.code.toUpperCase().replace(/\s+/g, ''),
      max_uses: formData.max_uses === "" ? null : parseInt(formData.max_uses as string),
      expires_at: formData.expires_at === "" ? null : new Date(formData.expires_at).toISOString(),
    };

    if (editingId) {
      const res = await updateCoupon(editingId, payload);
      if (res.success) {
        window.location.reload();
      } else {
        alert("Error updating: " + res.error);
      }
    } else {
      const res = await createCoupon(payload);
      if (res.success) {
        window.location.reload();
      } else {
        alert("Error creating: " + res.error);
      }
    }
    setIsProcessing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    setIsProcessing(true);
    const res = await deleteCoupon(id);
    if (res.success) {
      setCoupons(prev => prev.filter(c => c.id !== id));
    } else {
      alert("Error deleting: " + res.error);
    }
    setIsProcessing(false);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setIsProcessing(true);
    const res = await toggleCouponActive(id, !currentStatus);
    if (res.success) {
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
    } else {
      alert("Error updating: " + res.error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Coupons & Discounts</h1>
          <p className="text-sm text-foreground/70">Create and manage promo codes.</p>
        </div>
        <Button onClick={handleOpenNew} className="gap-2">
          <Plus size={18} /> New Coupon
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Discount</th>
              <th className="px-6 py-4 font-medium">Usage</th>
              <th className="px-6 py-4 font-medium">Expires</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No coupons found.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => {
                const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
                
                return (
                  <tr key={coupon.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-primary">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {coupon.discount_type === 'percentage' 
                        ? `${coupon.discount_value}% OFF` 
                        : `₹${coupon.discount_value} OFF`}
                      {coupon.min_order_value > 0 && (
                        <div className="text-xs text-muted-foreground mt-0.5 font-normal">
                          Min. ₹{coupon.min_order_value}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.current_uses} {coupon.max_uses ? `/ ${coupon.max_uses}` : 'uses'}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {coupon.expires_at ? format(new Date(coupon.expires_at), 'MMM d, yyyy') : 'Never'}
                      {isExpired && <span className="ml-2 text-destructive text-xs">(Expired)</span>}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggle(coupon.id, coupon.is_active)}
                        disabled={isProcessing}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          coupon.is_active 
                            ? 'bg-success/10 text-success hover:bg-success/20' 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {coupon.is_active ? <><CheckCircle size={14} /> Active</> : <><XCircle size={14} /> Inactive</>}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleOpenEdit(coupon)}
                          disabled={isProcessing}
                          className="p-2 text-foreground/50 hover:text-primary hover:bg-muted rounded-md transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(coupon.id)}
                          disabled={isProcessing}
                          className="p-2 text-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border overflow-hidden my-8">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-bold font-heading">{editingId ? 'Edit Coupon' : 'New Coupon'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Coupon Code</label>
                <input 
                  required
                  type="text" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. SUMMER20"
                  className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Discount Type</label>
                  <select 
                    value={formData.discount_type}
                    onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                    className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Value</label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    max={formData.discount_type === 'percentage' ? 100 : undefined}
                    value={formData.discount_value}
                    onChange={(e) => setFormData({...formData, discount_value: parseInt(e.target.value) || 0})}
                    className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Minimum Order Value (₹)</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.min_order_value}
                  onChange={(e) => setFormData({...formData, min_order_value: parseInt(e.target.value) || 0})}
                  className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">Set to 0 for no minimum.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Usage Limit</label>
                  <input 
                    type="number" 
                    min="1"
                    placeholder="Unlimited"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                    className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                  <input 
                    type="date" 
                    value={formData.expires_at}
                    onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                    className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border mt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Coupon'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
