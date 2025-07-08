import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";

export const FilterSort = ({ sortBy, setSortBy }:any) => {
    return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Ordenar por:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-24">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 shadow-lg">
                    <SelectItem className="hover:bg-gray-50" value="default">
                        Predeterminado
                    </SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="name">
                        Nombre
                    </SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="price">
                        Precio
                    </SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="views">
                        Vistas
                    </SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="products">
                        Stock
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};
