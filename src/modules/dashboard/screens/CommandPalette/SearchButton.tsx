// src/components/SearchButton.tsx
import { Button } from "@/components/atoms/button";
import { SearchIcon } from "lucide-react"; 

export default function SearchButton({ onClick }: { onClick: () => void }) { 

  return (
    <Button
      type="button"
      onClick={onClick}
      size={'sm'}
      variant={'outline'}
      className="bg-white border border-gray-200 rounded-lg"
    >
      <SearchIcon className="w-4 h-4 text-gray-400" />
      <kbd className="px-1 text-xs text-gray-400 border border-gray-200 rounded">
        Ctrl K
      </kbd>
    </Button>
  );
}
