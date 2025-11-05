import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const { data, error } = await supabase.rpc("fuzzy_search_recipes", {
      search_text: searchParams.get("query")?.trim() || "",
      category_filter: searchParams.get("category") || "all",
      language_filter: searchParams.get("language") || "all",
      cooking_filter: searchParams.get("cookingTime") || "all",
      sort_by: searchParams.get("sortBy") || "newest",
    });

    if (error) {
      console.error("Error fetching recipes:", error);
      return NextResponse.json(
        { error: "Failed to fetch recipes" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      recipes: data || [],
      count: data?.length || 0,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
