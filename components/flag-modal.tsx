import { X } from "lucide-react";

interface FlagModalProps {
  isOpen: boolean;
  recipeTitle: string;
  onSubmit: () => void;
  onClose: () => void;
}

export default function FlagModal({
  isOpen,
  recipeTitle,
  onSubmit,
  onClose,
}: FlagModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ctp-overlay2 bg-opacity-70"
      onClick={onClose}
    >
      <div
        className="relative bg-ctp-mantle w-full max-w-lg p-6 rounded-xl shadow-2xl border border-ctp-surface0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ctp-subtext0 hover:text-ctp-text"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-ctp-text mb-2">Flag Recipe</h2>
        <p className="text-ctp-subtext0 mb-6 text-sm">{recipeTitle}</p>

        <div>
          <p>Are you sure you want to flag &quot;{recipeTitle}&quot;?</p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={onClose}
              className="flex-1 bg-ctp-surface0 text-ctp-text font-semibold px-4 py-3 rounded-lg hover:bg-ctp-surface1 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit()}
              className="flex-1 bg-ctp-green text-ctp-base font-semibold px-4 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Flag Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
