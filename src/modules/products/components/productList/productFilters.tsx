import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { useCategoriesWithSubcategories } from "@/modules/shared/hooks/useCategories";
import { useCommonBrands } from "@/modules/shared/hooks/useCommonBrands";
import { Search } from "lucide-react";
import type { useProductFilters } from "../../hooks/useProductFilters";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { ComboboxSelect } from "@/components/common/SelectCombobox";

interface ProductFiltersProps {
    filters: ReturnType<typeof useProductFilters>["filters"]
    updateFilter: ReturnType<typeof useProductFilters>["updateFilter"]
}
const ProductFilters: React.FC<ProductFiltersProps> = ({
    filters,
    updateFilter,
}) => {
    const { data: categoriesData } = useCategoriesWithSubcategories();
    const { data: brandsData } = useCommonBrands()

    // Inputs locales
    const [codigoOEM, setCodigoOEM] = useState("")
    const [codigoUPC, setCodigoUPC] = useState("")
    const [nroMotor, setNroMotor] = useState("")
    const [medida, setMedida] = useState("")
    const [searchDescription, setSearchDescription] = useState("");

    // Debounce
    const [debouncedSearchDescription] = useDebounce(searchDescription, 500);
    const [debouncedCodigoOEM] = useDebounce(codigoOEM, 500)
    const [debouncedCodigoUPC] = useDebounce(codigoUPC, 500)
    const [debouncedNroMotor] = useDebounce(nroMotor, 500)
    const [debouncedModelo] = useDebounce(medida, 500)

    // Sync debounced values al filtro global
    useEffect(() => {
        updateFilter("descripcion", debouncedSearchDescription);
    }, [debouncedSearchDescription, updateFilter]);

    useEffect(() => {
        updateFilter("codigo_oem", debouncedCodigoOEM)
    }, [debouncedCodigoOEM, updateFilter])

    useEffect(() => {
        updateFilter("codigo_upc", debouncedCodigoUPC)
    }, [debouncedCodigoUPC, updateFilter])

    useEffect(() => {
        updateFilter("nro_motor", debouncedNroMotor)
    }, [debouncedNroMotor, updateFilter])

    useEffect(() => {
        updateFilter("medida", debouncedModelo)
    }, [debouncedModelo, updateFilter])

    useEffect(() => {
        const { codigo_oem, codigo_upc, nro_motor, medida, descripcion } = filters;

        const allEmpty = !codigo_oem && !codigo_upc && !nro_motor && !medida && !descripcion;

        if (allEmpty) {
            setCodigoOEM("");
            setCodigoUPC("");
            setNroMotor("");
            setMedida("");
            setSearchDescription("");
        }
    }, [filters]);

    return (
        <>
            {/* Búsquedas individuales */}
            <div className="p-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                        <Label>Categorias</Label>
                        <ComboboxSelect
                            value={filters.categoria}
                            onChange={(value) => {
                                const parsedValue = value === "all" ? undefined : Number(value);
                                updateFilter("subcategoria", undefined);
                                updateFilter("categoria", parsedValue);
                            }}
                            options={(categoriesData || []).map((cat) => ({
                                id: String(cat.id),
                                categoria: cat.categoria,
                            }))}
                            optionTag={"categoria"}
                            enableAllOption={true}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Buscar por Descripción</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Buscar por descripcion..."
                                value={searchDescription}
                                onChange={(e) => setSearchDescription(e.target.value)}
                                className="pl-10 w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Buscar Código OEM</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="11122-10040-D..."
                                value={codigoOEM}
                                onChange={(e) => setCodigoOEM(e.target.value)}
                                className="pl-10 font-mono text-xs"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Buscar Código UPC</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="11122-10040..."
                                value={codigoUPC}
                                onChange={(e) => setCodigoUPC(e.target.value)}
                                className="pl-10 font-mono text-xs"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-2 pb-2 border-b border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

                    <div>
                        <Label>Subcategorias</Label>
                        <ComboboxSelect
                            disabled={filters.categoria === undefined}
                            value={filters.subcategoria !== undefined ? String(filters.subcategoria) : "all"}
                            onChange={(value) => {
                                const parsedValue = value === "all" ? undefined : Number(value);
                                updateFilter("subcategoria", parsedValue);
                            }}
                            options={(categoriesData
                                ?.find((cat) => cat.id === filters.categoria)
                                ?.subcategorias || []).map((subcat) => ({
                                    id: String(subcat.id),
                                    subcategoria: subcat.subcategoria,
                                }))}
                            optionTag={"subcategoria"}
                            enableAllOption={true}
                        />
                    </div>

                    <div>
                        <Label>Marca</Label>
                        <ComboboxSelect
                            value={filters.marca}
                            onChange={(value) => {
                                updateFilter("marca", value === "all" ? "" : value);
                            }}
                            options={(brandsData || []).map((brand) => ({
                                id: brand.id,
                                marca: brand.marca,
                            }))}
                            optionTag={"marca"}
                            enableAllOption={true}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Buscar Medida</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="11X6X40.6..."
                                value={medida}
                                onChange={(e) => setMedida(e.target.value)}
                                className="pl-10 font-mono text-xs"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Buscar Número de Motor</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="1ZZ-FE..."
                                value={nroMotor}
                                onChange={(e) => setNroMotor(e.target.value)}
                                className="pl-10 font-mono text-xs"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductFilters;