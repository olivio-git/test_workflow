// src/components/SearchButton.tsx
import { Button } from "@/components/atoms/button";
import { Kbd } from "@/components/atoms/kbd";
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
      <Kbd>
        Ctrl K
      </Kbd>
    </Button>
  );
}
