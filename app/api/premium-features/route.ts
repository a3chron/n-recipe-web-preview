import { NextResponse } from "next/server";

const PREMIUM_FEATURES = {
  existing: [
    "Import Helper Tool - Automatically convert recipes from websites, PDFs or images to the correct format to import them",
    "Bigger limit for servings",
    "View what changed from your installed version to the latest one",
    "Several small to big UX / UI improvements",
    "Haptic feedback for several components",
    "More than three tags, more filter options for tags (filter against tags, filter for several tags)",
    "Search for recipes",
    "New category: drinks",
  ],
  immediate: [
    "Finish Translations for free & premium",
    "Tighten security for export/import (only allowed format (strip rest to ensure future compatibility), escaping if not automatically done) *free version too*",
    "Sharing with app -> link to web-hub recipe, create temporary recipe in web app",
    "Browse n-recipe hub recipes directly in the app",
    "Export recipes as PDF",
    "Vote for features or bugs that should be added next (featurebase)",
    "Add export filters",
    "Select which recipes and tags to import",
    "Maybe Show import progress (x of y imported)",
    "Option in settings to delete tags if not used in any recipe anymore (-> check on remove)",
    "Add custom themes (+ option for sharing these easily, json, maybe qr later on)",
    "Optional images for recipes (clean URLs on export)",
  ],
  midterm: [
    "Improve add recipe screen",
    "For first time recipes option instead of timer a stopwatch, to get time (or average times) for this step",
    "Auto-select Catppuccin accent closest to material you primary color",
    "Add counter for how many times a recipe was finished",
    "Maybe Share custom themes via qr",
    "Add more languages",
  ],
  future: [
    "Ingredients screen (e.g. show me recipes for what I have in my fridge)",
    "Meal planner screen",
    "Sync -> can be used on laptop / PC as well",
    "Accounts -> simpler sync, create shared meal planning calendars, family groups",
    "Addition to ingredients screen: if you track what you have at home, when planning meals, or about to cook, shows which ingredients are missing",
    "If you have more features you would like to see, just ping me at 'kurt.schambach@gmail.com'",
  ],
};

export async function GET() {
  return NextResponse.json(PREMIUM_FEATURES, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
