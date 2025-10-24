"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { X, Star } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string;
  recipeTitle: string;
  onSuccess?: () => void;
}

export default function RatingModal({
  isOpen,
  onClose,
  recipeId,
  recipeTitle,
  onSuccess,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (rating === 0) {
      setError("Please select a rating.");
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("recipe_reviews")
        .insert({
          recipe_id: recipeId,
          rating: rating,
          comment: comment.trim() || null,
        });

      if (insertError) throw insertError;

      // Success
      setLoading(false);
      setRating(0);
      setComment("");

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (e: any) {
      setError(`Failed to submit rating: ${e.message}`);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ctp-overlay2 bg-opacity-70"
      onClick={handleClose}
    >
      <div
        className="relative bg-ctp-mantle w-full max-w-lg p-6 rounded-xl shadow-2xl border border-ctp-surface0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-ctp-subtext0 hover:text-ctp-text"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-ctp-text mb-2">Rate Recipe</h2>
        <p className="text-ctp-subtext0 mb-6 text-sm">{recipeTitle}</p>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-ctp-subtext1 mb-3">
              Your Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={
                      star <= (hoveredRating || rating)
                        ? "fill-ctp-yellow text-ctp-yellow"
                        : "text-ctp-surface1"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Optional Comment */}
          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-ctp-subtext1 mb-1"
            >
              Comment (Optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your thoughts about this recipe..."
              className="w-full bg-ctp-surface0 border border-ctp-surface1 rounded-lg p-3 text-ctp-text focus:ring-ctp-green focus:border-ctp-green"
            />
          </div>

          {error && <p className="text-ctp-red mb-4 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-ctp-surface0 text-ctp-text font-semibold px-4 py-3 rounded-lg hover:bg-ctp-surface1 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 bg-ctp-green text-ctp-base font-semibold px-4 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
