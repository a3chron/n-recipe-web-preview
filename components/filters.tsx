import { RecipeCategoryType } from "@/types/recipe";

const categories: { value: RecipeCategoryType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
  { value: "dessert", label: "Dessert" },
  { value: "drinks", label: "Drinks" },
];

const cookingTimes: { value: FilterState["cookingTime"]; label: string }[] = [
  { value: "all", label: "Any time" },
  { value: "0-30", label: "≤ 30 min" },
  { value: "30-60", label: "30-60 min" },
  { value: "60+", label: "60+ min" },
];

const sortOptions: { value: FilterState["sortBy"]; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "reviews", label: "Top Rated" },
];

export interface FilterState {
  category: RecipeCategoryType | "all";
  cookingTime: "all" | "0-30" | "30-60" | "60+";
  sortBy: "newest" | "reviews";
}

interface FilterProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
}

export default function Filters({ filters, onFilterChange }: FilterProps) {
  // Helper to update a single filter value
  const updateFilter = (
    key: keyof FilterState,
    value: FilterState[keyof FilterState],
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Category Filter */}
      <div className="flex-1">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-ctp-subtext1 mb-1"
        >
          Category
        </label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) =>
            updateFilter(
              "category",
              e.target.value as FilterState[keyof FilterState],
            )
          }
          className="w-full bg-ctp-surface0 border border-ctp-surface1 rounded-lg p-2 text-ctp-text focus:ring-ctp-green focus:border-ctp-green"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Cooking Time Filter */}
      <div className="flex-1">
        <label
          htmlFor="cookingTime"
          className="block text-sm font-medium text-ctp-subtext1 mb-1"
        >
          Cooking Time
        </label>
        <select
          id="cookingTime"
          value={filters.cookingTime}
          onChange={(e) =>
            updateFilter(
              "cookingTime",
              e.target.value as FilterState[keyof FilterState],
            )
          }
          className="w-full bg-ctp-surface0 border border-ctp-surface1 rounded-lg p-2 text-ctp-text focus:ring-ctp-green focus:border-ctp-green"
        >
          {cookingTimes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By Filter */}
      <div className="flex-1">
        <label
          htmlFor="sortBy"
          className="block text-sm font-medium text-ctp-subtext1 mb-1"
        >
          Sort By
        </label>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={(e) =>
            updateFilter(
              "sortBy",
              e.target.value as FilterState[keyof FilterState],
            )
          }
          className="w-full bg-ctp-surface0 border border-ctp-surface1 rounded-lg p-2 text-ctp-text focus:ring-ctp-green focus:border-ctp-green"
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
