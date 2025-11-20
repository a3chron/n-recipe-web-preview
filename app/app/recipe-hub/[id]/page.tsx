import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { RecipeFromDB } from "@/types/recipe";
import RecipeDetail from "@/components/recipe-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getRecipe(id: string): Promise<RecipeFromDB | null> {
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

export default async function RecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-6">
      <RecipeDetail recipe={recipe} />
    </main>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    return {
      title: "Recipe Not Found",
    };
  }

  return {
    title: `${recipe.title} - n-recipe`,
    description: `View the recipe for ${recipe.title}`,
  };
}
