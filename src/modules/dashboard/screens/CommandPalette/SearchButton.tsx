import { Button } from "@/components/atoms/button";
import { Kbd } from "@/components/atoms/kbd";
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
      <Kbd useIcons className="font-normal text-xs border-0 shadow-none bg-transparent px-0 font-sans">Ctrl K</Kbd>
    </Button>
  );
}
