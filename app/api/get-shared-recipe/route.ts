import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("recipe-shared")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching recipe:", error);
      return NextResponse.json(
        { error: "Failed to fetch recipe" },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      recipe: data,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
