import { RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const SearchCategories = ({ value, onChange, onRefresh, isLoading }: Props) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white border border-gray-200 rounded-lg sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-6 text-sm text-gray-600">
        {/* Estos contadores los mantendremos fuera por ahora */}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <Input
            placeholder="Buscar categorías..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-64 pl-10 h-9"
          />
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          className="px-3 h-9"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  );
};

export default SearchCategories;
