"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { RecipeFromDB } from "@/types/recipe";
import Filters, { FilterState } from "@/components/filters";
import RecipeCard from "@/components/recipe-card";
import SubmitModal from "@/components/submit-modal";
import Header from "@/components/header";

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
    fetchRecipes();
  }, [filters]);

  async function fetchRecipes() {
    setLoading(true);

    let query = supabase
      .from("recipes-hub")
      .select("*")
      .eq("is_approved", true);

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
        query = query
          .gte("total_cooking_time", 30)
          .lt("total_cooking_time", 60);
      } else if (filters.cookingTime === "60+") {
        query = query.gte("total_cooking_time", 60);
      }
    }

    // 4. Sorting
    if (filters.sortBy === "reviews") {
      query = query.order("average_review", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching recipes:", error);
    } else {
      setRecipes(data || []);
    }
    setLoading(false);
  }

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
