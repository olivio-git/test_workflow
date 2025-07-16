import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/atoms/input";

interface Category {
  id: string;
  categoria: string;
}

interface SearchCategoriesProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  disabled?: boolean;
}

export const SearchCategories = ({ categories, onSelect, disabled }: SearchCategoriesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter((category) =>
        category.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [searchTerm, categories]);

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Buscar categoría..."
          className="pl-9"
          disabled={disabled}
        />
        <Search className="absolute w-4 h-4 text-gray-400 left-2 top-2" />
      </div>
      
      {isOpen && filteredCategories.length > 0 && (
        <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg max-h-60">
          {filteredCategories.map((category) => (
            <button
              key={category.id}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none"
              onClick={() => {
                onSelect(category);
                setSearchTerm(category.categoria);
                setIsOpen(false);
              }}
            >
              {category.categoria}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};