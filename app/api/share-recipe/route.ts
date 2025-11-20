import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { getTotalCookingTime } from "@/lib/utils";

const categories = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "dessert",
  "drink",
];

const validateRecipeData = (data: any): boolean => {
  if (!Array.isArray(data)) return false;

  return data.every((recipe) => {
    return (
      typeof recipe.title === "string" &&
      typeof recipe.version === "string" &&
      typeof recipe.servings === "number" &&
      categories.includes(recipe.category) &&
      Array.isArray(recipe.steps) &&
      recipe.steps.every(
        (step: any) =>
          typeof step.name === "string" &&
          typeof step.order === "number" &&
          typeof step.description === "string" &&
          typeof step.duration === "number" &&
          Array.isArray(step.ingredients) &&
          step.ingredients.every(
            (ingredient: any) => typeof ingredient.name === "string",
          ),
      )
    );
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipe, author } = body;

    // Validate single recipe (wrap in array for validation function)
    if (!recipe || !validateRecipeData([recipe])) {
      return NextResponse.json(
        { error: "Invalid recipe data format" },
        { status: 400 },
      );
    }

    // Prepare recipe for insertion
    const recipeToInsert = {
      recipe_data: recipe,
      title: recipe.title,
      servings: recipe.servings,
      category: recipe.category,
      author: author,
      total_cooking_time: getTotalCookingTime(recipe),
    };

    // Insert into recipes-shared table
    const { data, error } = await supabase
      .from("recipes-shared")
      .insert([recipeToInsert])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to insert recipe into database" },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Recipe was not inserted" },
        { status: 500 },
      );
    }

    // Return the ID of the inserted recipe
    return NextResponse.json(
      {
        success: true,
        id: data.id,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
