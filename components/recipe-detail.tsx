"use client";

import { getAllIngredients, getTotalCookingTime } from "@/lib/utils";
import { RecipeFromDB } from "@/types/recipe";
import {
  ArrowLeft,
  Clock,
  Download,
  Star,
  User,
  Users,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import RatingModal from "./rating-modal";
import Link from "next/link";

interface RecipeDetailProps {
  recipe: RecipeFromDB;
  shared?: boolean;
}

// Helper functions for localStorage
const DOWNLOADS_KEY = "recipe_downloads";
const RATINGS_KEY = "recipe_ratings";

function getDownloadedRecipes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(DOWNLOADS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getRatedRecipes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(RATINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function markAsDownloaded(recipeId: string): void {
  try {
    const downloads = getDownloadedRecipes();
    const id = recipeId.toString();
    if (!downloads.includes(id)) {
      downloads.push(id);
      localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
    }
  } catch (e) {
    console.error("Failed to save download status:", e);
  }
}

function markAsRated(recipeId: string): void {
  try {
    const ratings = getRatedRecipes();
    const id = recipeId.toString();
    if (!ratings.includes(id)) {
      ratings.push(id);
      localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    }
  } catch (e) {
    console.error("Failed to save rating status:", e);
  }
}

export default function RecipeDetail({ recipe, shared }: RecipeDetailProps) {
  const { recipe_data, author, id, average_review, review_count } = recipe;
  const allIngredients = getAllIngredients(recipe_data);
  const totalTime = getTotalCookingTime(recipe_data);

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const downloads = getDownloadedRecipes();
    const ratings = getRatedRecipes();
    const recipeIdStr = id.toString();

    setHasDownloaded(downloads.includes(recipeIdStr));
    setHasRated(ratings.includes(recipeIdStr));
  }, [id]);

  const handleDownload = () => {
    // n-recipe expects an array
    const recipeExportData = [recipe_data];
    const jsonString = JSON.stringify(recipeExportData, null, 2);
    const blob = new Blob([jsonString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeTitle = recipe_data.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    a.href = url;
    a.download = `${safeTitle || "recipe"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Mark as downloaded
    markAsDownloaded(id);
    setHasDownloaded(true);
  };

  const handleRateClick = () => {
    if (!hasDownloaded) {
      alert("Please download the recipe first before rating it!");
      return;
    }
    if (hasRated) {
      alert("You've already rated this recipe!");
      return;
    }
    setIsRatingModalOpen(true);
  };

  const handleRatingSuccess = () => {
    markAsRated(id);
    setHasRated(true);
  };

  // Determine button state and text
  const getRateButtonContent = () => {
    if (hasRated) {
      return (
        <>
          <CheckCircle size={18} />
          Already Rated
        </>
      );
    }
    if (!hasDownloaded) {
      return (
        <>
          <Star size={18} />
          Download to Rate
        </>
      );
    }
    return (
      <>
        <Star size={18} />
        Rate this recipe
      </>
    );
  };

  return (
    <>
      <div className="bg-ctp-mantle rounded-xl border border-ctp-surface0 p-6 md:p-8">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-ctp-subtext1 hover:text-ctp-text mb-6 font-semibold"
        >
          <ArrowLeft size={18} />
          {shared ? "Home" : "Back to List"}
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-ctp-text">
              {recipe_data.title}
            </h1>
            {/* Review count */}
            {!shared && average_review !== undefined && (
              <div className="flex items-center gap-1.5 text-ctp-subtext0 mt-2">
                {average_review !== 0 && (
                  <Star size={16} className="text-ctp-yellow" />
                )}
                <span>
                  {average_review === 0
                    ? `${review_count} reviews`
                    : `${average_review.toFixed(1)} (${review_count} reviews)`}
                </span>
              </div>
            )}
          </div>
          {/* Rate Button */}
          {!shared && (
            <button
              onClick={handleRateClick}
              disabled={hasRated}
              className={`flex-shrink-0 flex items-center justify-center gap-2 font-semibold px-4 py-2 rounded-lg transition-opacity ${
                hasRated
                  ? "bg-ctp-surface1 text-ctp-subtext0 cursor-not-allowed"
                  : hasDownloaded
                    ? "bg-ctp-green text-ctp-base hover:opacity-90"
                    : "bg-ctp-yellow text-ctp-base hover:opacity-90"
              }`}
            >
              {getRateButtonContent()}
            </button>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 my-6 text-ctp-subtext0">
          <span className="flex items-center gap-2">
            <User size={18} />
            By {author || "Anonymous"}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={18} />
            {totalTime} min
          </span>
          <span className="flex items-center gap-2">
            <Users size={18} />
            {recipe_data.servings} servings
          </span>
          <span className="capitalize px-3 py-1 bg-ctp-green text-ctp-base rounded-full text-sm font-semibold">
            {recipe_data.category}
          </span>
        </div>

        {/* Ingredients & Steps Container */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* All Ingredients */}
          <div className="w-full lg:w-1/3 lg:sticky top-24 self-start bg-ctp-surface0 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-ctp-green mb-4">
              Ingredients
            </h3>
            <ul className="space-y-2">
              {allIngredients.map((ing, idx) => (
                <li key={idx} className="flex gap-2 text-ctp-text">
                  <span className="text-ctp-subtext0"> • </span>
                  <span>
                    {ing.quantity || ""} {ing.unit || ""} {ing.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="w-full lg:w-2/3">
            <h3 className="text-xl font-bold text-ctp-green mb-4">
              Instructions
            </h3>
            <div className="space-y-6">
              {recipe_data.steps
                .sort((a, b) => a.order - b.order)
                .map((step) => (
                  <div
                    key={step.order}
                    className="pb-6 border-b border-ctp-surface1 last:border-b-0"
                  >
                    <h4 className="text-lg font-semibold text-ctp-text mb-2">
                      Step {step.order}: {step.name}
                    </h4>
                    {step.duration > 0 && (
                      <p className="text-sm text-ctp-subtext1 mb-3">
                        ({step.duration} minutes)
                      </p>
                    )}
                    {/* Use whitespace-pre-line to respect newlines from the description */}
                    <p className="text-ctp-text whitespace-pre-line">
                      {step.description}
                    </p>

                    {step.ingredients.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-semibold text-ctp-subtext0 mb-2">
                          Ingredients for this step:
                        </h5>
                        <ul className="list-disc list-inside text-sm text-ctp-subtext1 space-y-1">
                          {step.ingredients.map((ing, idx) => (
                            <li key={idx}>
                              {ing.quantity || ""} {ing.unit || ""} {ing.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-8 pt-6 border-t border-ctp-surface1">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 w-full font-semibold px-4 py-3 rounded-lg transition-opacity bg-ctp-green text-ctp-base hover:opacity-90"
          >
            <Download size={18} />
            Download .txt
          </button>
        </div>
      </div>

      {/* Render the modal */}
      {!shared && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          recipeId={id}
          recipeTitle={recipe_data.title}
          onSuccess={handleRatingSuccess}
        />
      )}
    </>
  );
}
