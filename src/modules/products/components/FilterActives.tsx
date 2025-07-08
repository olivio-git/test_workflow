import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";

export const FilterActives = ({ showFilter, setShowFilter }: any) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span>Show:</span>
      <Select value={showFilter} onValueChange={setShowFilter}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border border-gray-200 shadow-lg">
          <SelectItem className="hover:bg-gray-50" value="all-products">
            Todos los productos
          </SelectItem>
          <SelectItem className="hover:bg-gray-50" value="active">
            Activos
          </SelectItem>
          <SelectItem className="hover:bg-gray-50" value="inactive">
            Inactivos
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
