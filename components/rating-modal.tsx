"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Star, X } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string;
  recipeTitle: string;
}

export default function RatingModal({
  isOpen,
  onClose,
  recipeId,
  recipeTitle,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitRating = async () => {
    if (rating === 0) {
      setError("Please select a rating from 1 to 5 stars.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { error: rpcError } = await supabase.rpc("submit_review", {
        recipe_id_in: recipeId,
        new_rating_in: rating,
      });

      if (rpcError) throw rpcError;

      // Success
      setLoading(false);
      alert("Thank you for your review!");
      onClose();
      setRating(0); // Reset for next time
    } catch (e: any) {
      setError(`Failed to submit review: ${e.message}`);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ctp-overlay2 bg-opacity-70"
      onClick={onClose}
    >
      <div
        className="relative bg-ctp-mantle w-full max-w-md p-6 rounded-xl shadow-2xl border border-ctp-surface0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ctp-subtext0 hover:text-ctp-text"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-ctp-text mb-2">
          Rate this recipe
        </h2>
        <p className="text-ctp-subtext0 mb-6">{recipeTitle}</p>

        <div className="flex justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="px-1"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                size={36}
                className={`transition-colors ${
                  (hoverRating || rating) >= star
                    ? "text-ctp-yellow fill-ctp-yellow"
                    : "text-ctp-surface2"
                }`}
              />
            </button>
          ))}
        </div>

        {error && (
          <p className="text-ctp-red mb-4 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleSubmitRating}
          disabled={loading}
          className="w-full bg-ctp-green text-ctp-base font-semibold px-4 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
