import { notFound } from "next/navigation";
import RecipeDetail from "@/components/recipe-detail";
import { getSharedRecipe } from "../../actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SharedRecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipe_data = await getSharedRecipe(id);

  if (!recipe_data) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="mb-4 p-4 bg-ctp-surface0 border border-ctp-yellow rounded-lg">
        <p className="text-ctp-text text-sm">
          <span className="font-semibold text-ctp-yellow">
            📢 Shared Recipe:
          </span>{" "}
          This recipe was shared directly and will be available for 30 days.
        </p>
      </div>

      <RecipeDetail recipe={recipe_data} shared />
    </main>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const recipe_data = await getSharedRecipe(id);

  if (!recipe_data) {
    return {
      title: "Shared Recipe Not Found",
    };
  }

  return {
    title: `${recipe_data.title} - Shared Recipe`,
    description: `${recipe_data.author} shared: ${recipe_data.title}`,
  };
}
