import { Plus } from "lucide-react";

interface HeaderProps {
  onSumbitClick: () => void;
}

export default function Header({ onSumbitClick }: HeaderProps) {
  return (
    <header className="bg-ctp-mantle border-b border-ctp-surface0 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-ctp-green">n-recipe Hub</h1>
        <button
          onClick={onSumbitClick}
          className="flex items-center gap-2 bg-ctp-green text-ctp-base font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Submit Recipe
        </button>
      </div>
    </header>
  );
}
