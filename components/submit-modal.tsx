"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { Recipe } from "@/types/recipe";
import { getTotalCookingTime } from "@/lib/utils";
import { X } from "lucide-react";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
}

export default function SubmitModal({
  isOpen,
  onClose,
  onSuccess,
}: SubmitModalProps) {
  const [jsonText, setJsonText] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("");
  const [languages, setLanguages] = useState<
    Array<{ code: string; name: string; nativeName: string }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load ISO 639-1 language data
    const loadLanguages = async () => {
      try {
        const ISO6391 = (await import("iso-639-1")).default;
        const codes = ISO6391.getAllCodes();
        const langList = codes.map((code) => ({
          code,
          name: ISO6391.getName(code),
          nativeName: ISO6391.getNativeName(code),
        }));
        // Sort by English name
        langList.sort((a, b) => a.name.localeCompare(b.name));
        setLanguages(langList);
      } catch (err) {
        console.error("Failed to load languages:", err);
        // Fallback to a small list if import fails
        setLanguages([
          { code: "en", name: "English", nativeName: "English" },
          { code: "de", name: "German", nativeName: "Deutsch" },
          { code: "es", name: "Spanish", nativeName: "Español" },
          { code: "fr", name: "French", nativeName: "Français" },
        ]);
      }
    };
    loadLanguages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!author.trim()) {
      setError("Please enter your name or a nickname.");
      setLoading(false);
      return;
    }

    if (!language) {
      setError("Please select a language.");
      setLoading(false);
      return;
    }

    let recipeJson: Recipe[];
    try {
      recipeJson = JSON.parse(jsonText);
      if (!Array.isArray(recipeJson)) {
        throw new Error("Input is not a JSON array.");
      }
      if (recipeJson.length === 0) {
        throw new Error("The JSON array is empty.");
      }
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}. Please paste the export directly.`);
      setLoading(false);
      return;
    }

    const recipesToInsert = [];
    let invalidRecipeCount = 0;

    for (const recipeObject of recipeJson) {
      if (!recipeObject.title || !recipeObject.steps) {
        invalidRecipeCount++;
        continue;
      }

      const total_cooking_time = getTotalCookingTime(recipeObject);

      recipesToInsert.push({
        recipe_data: recipeObject,
        title: recipeObject.title,
        category: recipeObject.category || "lunch",
        author: author.trim(),
        language: language,
        total_cooking_time: total_cooking_time,
        is_approved: false,
      });
    }

    if (recipesToInsert.length === 0) {
      setError(
        "No valid recipes found in the JSON. Check for title and steps.",
      );
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("recipes-hub")
        .insert(recipesToInsert);

      if (insertError) throw insertError;

      setLoading(false);
      setJsonText("");
      setAuthor("");
      setLanguage("");
      onSuccess(recipesToInsert.length);
    } catch (e: any) {
      setError(`Submission failed: ${e.message}`);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ctp-overlay2 bg-opacity-70"
      onClick={onClose}
    >
      <div
        className="relative bg-ctp-mantle w-full max-w-2xl p-6 rounded-xl shadow-2xl border border-ctp-surface0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ctp-subtext0 hover:text-ctp-text"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-ctp-text mb-4">
          Submit Your Recipe(s)
        </h2>
        <p className="text-ctp-subtext0 mb-6">
          Paste your n-recipe JSON export below. All recipes in the array will
          be submitted for approval. <br />
          You can export your recipe as text in the app: <br />
          Settings {"->"} Export {"->"} (select recipes) {"->"} Show more
          options
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="author"
              className="block text-sm font-medium text-ctp-subtext1 mb-1"
            >
              Your Name
            </label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., 'Chef John'"
              required
              className="w-full bg-ctp-surface0 border border-ctp-surface1 rounded-lg p-3 text-ctp-text focus:ring-ctp-green focus:border-ctp-green"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-ctp-subtext1 mb-1"
            >
              Recipe Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
              className="w-full bg-ctp-surface0 border border-ctp-surface1 rounded-lg p-3 text-ctp-text focus:ring-ctp-green focus:border-ctp-green cursor-pointer"
            >
              <option value="">Select a language...</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="json-input"
              className="block text-sm font-medium text-ctp-subtext1 mb-1"
            >
              Recipe JSON
            </label>
            <textarea
              id="json-input"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={10}
              placeholder='[ { "title": "Recipe 1", ... }, { "title": "Recipe 2", ... } ]'
              required
              className="w-full bg-ctp-surface0 border border-ctp-surface1 rounded-lg p-3 text-ctp-text font-mono text-sm focus:ring-ctp-green focus:border-ctp-green"
            />
          </div>

          {error && <p className="text-ctp-red mb-4 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ctp-green text-ctp-base font-semibold px-4 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit for Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
