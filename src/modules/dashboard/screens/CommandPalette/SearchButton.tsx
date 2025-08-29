import { Button } from "@/components/atoms/button";
import { SearchIcon } from "lucide-react";

export default function SearchButton({ onClick }: { onClick: () => void }) {

  return (
    <Button
      type="button"
      onClick={onClick}
      size={'sm'}
      variant={'secondary'}
      className="rounded-full text-gray-500 flex items-center justify-center"
    >
      <SearchIcon className="w-4 h-4" />
      <span className="font-normal text-xs">Ctrl K</span>
    </Button>
  );
}
