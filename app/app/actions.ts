"use server";

import { FilterState } from "@/components/filters";
import { supabase } from "@/lib/supabase-client";
import { RecipeFromDB } from "@/types/recipe";

export async function fetchRecipes(
  filters: FilterState,
): Promise<RecipeFromDB[]> {
  let query = supabase.from("recipes-hub").select("*").eq("is_approved", true);

  // 1. Category Filter
  if (filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  // 2. Language Filter
  if (filters.language !== "all") {
    query = query.eq("language", filters.language);
  }

  // 3. Cooking Time Filter
  if (filters.cookingTime !== "all") {
    if (filters.cookingTime === "0-30") {
      query = query.lte("total_cooking_time", 30);
    } else if (filters.cookingTime === "30-60") {
      query = query.gte("total_cooking_time", 30).lt("total_cooking_time", 60);
    } else if (filters.cookingTime === "60+") {
      query = query.gte("total_cooking_time", 60);
    }
  }

  // 4. Sorting
  if (filters.sortBy === "reviews") {
    query = query
      .order("average_review", { ascending: false })
      .order("review_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching recipes:", error);
    return [];
  } else {
    return data || [];
  }
}

export async function getRecipe(id: string): Promise<RecipeFromDB | null> {
  const { data, error } = await supabase
    .from("recipes-hub")
    .select("*")
    .eq("id", id)
    .eq("is_approved", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getSharedRecipe(
  id: string,
): Promise<RecipeFromDB | null> {
  const { data, error } = await supabase
    .from("recipes-shared")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
