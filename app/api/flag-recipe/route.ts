import { supabase } from "@/lib/supabase-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 },
      );
    }

    // increment flag count by one
    const { data, error } = await supabase.rpc("increment_recipe_flag", {
      recipe_id: id,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to update flag count" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      flags: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
