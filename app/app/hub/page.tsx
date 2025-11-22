"use client";

import { useState, useEffect } from "react";
import { RecipeFromDB } from "@/types/recipe";
import Filters, { FilterState } from "@/components/filters";
import RecipeCard from "@/components/recipe-card";
import SubmitModal from "@/components/submit-modal";
import Header from "@/components/header";
import { fetchRecipes } from "../actions";

export default function HomePage() {
  const [recipes, setRecipes] = useState<RecipeFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    cookingTime: "all",
    sortBy: "newest",
    language: "all",
  });

  // Fetch recipes when filters change
  useEffect(() => {
    setLoading(true);
    fetchRecipes(filters).then((data) => {
      setRecipes(data);
      setLoading(false);
    });
  }, [filters]);

  return (
    <>
      <Header onSumbitClick={() => setIsModalOpen(true)} />
      <main className="max-w-5xl mx-auto p-4 md:p-6">
        <Filters filters={filters} onFilterChange={setFilters} />

        {loading ? (
          <p className="text-ctp-subtext0 text-center py-10">
            Loading recipes...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <p className="text-ctp-subtext0 text-center col-span-full py-10">
                No recipes found matching your filters.
              </p>
            )}
          </div>
        )}
      </main>

      <SubmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(count) => {
          setIsModalOpen(false);
          alert(`${count} recipe(s) submitted for review. Thank you!`);
        }}
      />
    </>
  );
}
