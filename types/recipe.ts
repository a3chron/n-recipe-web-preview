export type RecipeCategoryType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "dessert"
  | "drinks";

export interface Ingredient {
  name: string;
  unit: string;
  quantity: number;
}

export interface Step {
  name: string;
  order: number;
  description: string;
  ingredients: Ingredient[];
  duration: number; // Duration in minutes
}

export interface Recipe {
  title: string;
  servings: number;
  category: RecipeCategoryType;
  steps: Step[];
  version: string;
  // These fields are from your mobile app, optional but good to have
  tags?: string[];
  img?: string;
  createdAt?: string; // Stored as ISO string
  isFavorite?: boolean;
}

// This is the type we get from the Supabase DB
export interface RecipeFromDB {
  id: string;
  created_at: string;
  recipe_data: Recipe; // The full JSON blob
  title: string;
  category: RecipeCategoryType;
  is_approved: boolean;
  average_review: number;
  review_count: number;
  author: string | null;
  total_cooking_time: number | null;
}
