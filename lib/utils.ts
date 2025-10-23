import { Recipe } from "@/types/recipe";

/**
 * Calculates the total cooking time from all steps.
 */
export function getTotalCookingTime(recipe: Recipe): number {
  if (!recipe.steps) {
    return 0;
  }
  return recipe.steps.reduce((total, step) => {
    // Ensure duration is a number, default to 0 if not
    const duration =
      typeof step.duration === "number" && !isNaN(step.duration)
        ? step.duration
        : 0;
    return total + duration;
  }, 0);
}

/**
 * Aggregates all ingredients from all steps.
 */
export function getAllIngredients(recipe: Recipe) {
  const ingredientMap = new Map<
    string,
    { name: string; unit?: string; quantity?: number }
  >();

  recipe.steps.forEach((step) => {
    step.ingredients.forEach((ingredient) => {
      const key = `${ingredient.name}-${ingredient.unit || "no-unit"}`;
      const quantity =
        typeof ingredient.quantity === "number" ? ingredient.quantity : 0;

      if (ingredientMap.has(key)) {
        const existing = ingredientMap.get(key)!;
        existing.quantity = (existing.quantity || 0) + (quantity || 0);
      } else {
        ingredientMap.set(key, { ...ingredient, quantity });
      }
    });
  });

  return Array.from(ingredientMap.values());
}
