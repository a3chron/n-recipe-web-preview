import { notFound } from "next/navigation";
import RecipeDetail from "@/components/recipe-detail";
import { getRecipe } from "../../actions";

interface PageProps {
  params: Promise<{ id: string }>;
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
    description: `View the recipe for "${recipe.title}" by "${recipe.author}"`,
  };
}
