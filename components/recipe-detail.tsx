import { getAllIngredients, getTotalCookingTime } from "@/lib/utils";
import { RecipeFromDB } from "@/types/recipe";
import { ArrowLeft, Clock, Download, User, Users } from "lucide-react";

interface RecipeDetailProps {
  recipe: RecipeFromDB;
  onBack: () => void;
}

export default function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  const { recipe_data, author } = recipe;
  const allIngredients = getAllIngredients(recipe_data);
  const totalTime = getTotalCookingTime(recipe_data);

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
  };

  return (
    <div className="bg-ctp-mantle rounded-xl border border-ctp-surface0 p-6 md:p-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-ctp-subtext1 hover:text-ctp-text mb-6 font-semibold"
      >
        <ArrowLeft size={18} />
        Back to List
      </button>

      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-ctp-text">
        {recipe_data.title}
      </h1>

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
          <h3 className="text-xl font-bold text-ctp-green mb-4">Ingredients</h3>
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
          className="flex items-center justify-center gap-2 w-full bg-ctp-green text-ctp-base font-semibold px-4 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Download size={18} />
          Download .txt
        </button>
      </div>
    </div>
  );
}
