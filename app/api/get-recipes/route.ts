import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get filter parameters
    const category = searchParams.get("category") || "all";
    const language = searchParams.get("language") || "all";
    const cookingTime = searchParams.get("cookingTime") || "all";
    const sortBy = searchParams.get("sortBy") || "newest";

    // Start building the query
    let query = supabase.from("recipe-hub").select("*").eq("is_approved", true);

    // 1. Category Filter
    if (category !== "all") {
      query = query.eq("category", category);
    }

    // 2. Language Filter
    if (language !== "all") {
      query = query.eq("language", language);
    }

    // 3. Cooking Time Filter
    if (cookingTime !== "all") {
      if (cookingTime === "0-30") {
        query = query.lte("total_cooking_time", 30);
      } else if (cookingTime === "30-60") {
        query = query
          .gte("total_cooking_time", 30)
          .lt("total_cooking_time", 60);
      } else if (cookingTime === "60+") {
        query = query.gte("total_cooking_time", 60);
      }
    }

    // 4. Sorting
    if (sortBy === "reviews") {
      query = query.order("average_review", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

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
