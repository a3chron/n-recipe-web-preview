import { RecipeFromDB } from "@/types/recipe";
import { Clock, Star, Users } from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeFromDB;
  onSelect: () => void;
}

export default function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  const {
    recipe_data,
    title,
    category,
    total_cooking_time,
    average_review,
    review_count,
  } = recipe;

  return (
    <button
      onClick={onSelect}
      className="bg-ctp-mantle border border-ctp-surface0 rounded-xl p-5 text-left transition-all hover:shadow-lg hover:-translate-y-1 hover:border-ctp-green"
    >
      <h3 className="text-xl font-bold text-ctp-green truncate">{title}</h3>
      <p className="text-ctp-subtext0 capitalize mt-1 mb-3">{category}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ctp-subtext1">
        <span className="flex items-center gap-1.5">
          <Clock size={16} />
          {total_cooking_time ||
            recipe_data.steps.reduce((a, b) => a + b.duration, 0) ||
            "N/A"}{" "}
          min
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={16} />
          {recipe_data.servings || "N/A"} servings
        </span>
        <span className="flex items-center gap-1.5">
          <Star size={16} className="text-ctp-yellow" />
          {average_review.toFixed(1)} ({review_count})
        </span>
      </div>
    </button>
  );
}
