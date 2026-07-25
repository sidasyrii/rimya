"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id, rating, comment, is_approved, created_at,
        products(id, name),
        profiles(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch reviews");
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string, isApproved: boolean) => {
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: isApproved })
      .eq('id', id);

    if (error) {
      toast.error("Failed to update review status");
    } else {
      toast.success(`Review ${isApproved ? 'approved' : 'hidden'} successfully`);
      fetchReviews();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) {
      toast.error("Failed to delete review");
    } else {
      toast.success("Review deleted");
      fetchReviews();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Reviews</h1>
          <p className="text-muted-foreground mt-1">Manage product reviews</p>
        </div>
      </div>

      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-sm font-medium text-muted-foreground">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 w-1/3">Comment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/product/${review.products?.id}`} className="text-primary hover:underline font-medium text-sm">
                        {review.products?.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{review.profiles?.first_name} {review.profiles?.last_name}</div>
                      <div className="text-xs text-muted-foreground">{review.profiles?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/80">
                      {review.comment}
                    </td>
                    <td className="px-6 py-4">
                      {review.is_approved ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {review.is_approved ? (
                          <Button size="sm" variant="outline" onClick={() => handleApprove(review.id, false)} title="Hide">
                            <XCircle size={16} />
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleApprove(review.id, true)} title="Approve">
                            <CheckCircle size={16} />
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(review.id)} title="Delete">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
