// src/components/SearchButton.tsx
import { useHotkeys } from "react-hotkeys-hook";

export default function SearchButton({ onClick }: { onClick: () => void }) {
  useHotkeys("ctrl+k", (e) => {
    e.preventDefault();
    onClick();
  });

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full sm:w-[240px] text-left text-sm text-gray-500 border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50 flex items-center justify-between"
    >
      <span className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
          />
        </svg>
        Buscar...
      </span>
      <kbd className="px-1 text-xs text-gray-400 border border-gray-200 rounded">Ctrl K</kbd>
    </button>
  );
}
