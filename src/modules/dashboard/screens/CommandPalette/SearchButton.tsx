// src/components/SearchButton.tsx
import { Button } from "@/components/atoms/button";
import ShortcutKey from "@/components/common/ShortcutKey";
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
      <ShortcutKey combo="ctrl+k" />
    </Button>
  );
}
