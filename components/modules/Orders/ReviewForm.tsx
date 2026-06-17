"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/services/reviews.services";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  mealId: string;
  orderId: string;
}

export default function ReviewForm({ mealId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    startTransition(async () => {
      const result = await createReview({
        rating,
        comment: comment.trim() || undefined,
        mealId,
      });

      if (result.success) {
        toast.success(result.message);
        setIsSubmitted(true);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl bg-primary/5 p-6 text-center">
        <h3 className="font-semibold text-primary">Thank you for your review!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your feedback helps us and the provider improve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold">Rate your meal</h3>
        <p className="text-sm text-muted-foreground">
          How was your experience with this meal?
        </p>
      </div>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 transition-transform active:scale-95"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              className={cn(
                "size-8 transition-colors",
                (hoveredRating || rating) >= star
                  ? "fill-primary text-primary"
                  : "fill-transparent text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          Add a comment (optional)
        </label>
        <Textarea
          id="comment"
          placeholder="What did you like or dislike? How was the taste?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="resize-none"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending || rating === 0}>
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
