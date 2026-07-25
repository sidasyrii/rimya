"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "./button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

export function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = useUserStore();
  const supabase = createClient();

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id, rating, comment, created_at,
          profiles(first_name, last_name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setReviews(data as any);
      }
      setLoading(false);
    }
    fetchReviews();
  }, [productId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment
    });

    if (error) {
      toast.error("Failed to submit review. You might have already reviewed this product.");
    } else {
      toast.success("Review submitted successfully! It will appear once approved.");
      setComment("");
      setRating(5);
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-16 border-t border-border pt-12">
      <h3 className="text-2xl font-heading font-bold mb-8">Customer Reviews</h3>
      
      {/* Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-12 bg-muted/30 p-6 rounded-2xl border border-border">
          <h4 className="font-semibold mb-4">Write a Review</h4>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${rating >= star ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think about this product?"
            className="w-full min-h-[100px] p-3 rounded-lg border border-border bg-background mb-4"
            required
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      ) : (
        <div className="mb-12 bg-muted/30 p-6 rounded-2xl border border-border">
          <p className="text-foreground/70 mb-4">Please log in to write a review.</p>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-6 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>
                <span className="font-semibold">
                  {review.profiles?.first_name} {review.profiles?.last_name}
                </span>
                <span className="text-sm text-muted-foreground ml-auto">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-foreground/80 mt-3">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground italic">No reviews yet. Be the first to review this product!</p>
      )}
    </div>
  );
}
