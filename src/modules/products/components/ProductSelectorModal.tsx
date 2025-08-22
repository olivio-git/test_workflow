import { AlertDialogHeader } from "@/components/atoms/alert-dialog";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Plus, Search, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ProductGet } from "../types/ProductGet";
import { useProductsPaginated } from "../hooks/useProductsPaginated";
import { useProductFilters } from "../hooks/useProductFilters";
import { useBranchStore } from "@/states/branchStore";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatCurrency } from "@/utils/formaters";
import { useDebounce } from "use-debounce";
import NoDataComponent from "@/components/common/noDataComponent";
import { Checkbox } from "@/components/atoms/checkbox";

interface ProductSelectorModalProps {
    isSearchOpen: boolean
    setIsSearchOpen: any
    addItem: (product: ProductGet) => void
    addMultipleItem: (products: ProductGet[]) => void
    onlyWithStock?: boolean
}
const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({
    isSearchOpen,
    setIsSearchOpen,
    addItem,
    addMultipleItem,
    onlyWithStock = false,
}) => {
    const [products, setProducts] = useState<ProductGet[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<ProductGet[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500)

    const { selectedBranchId } = useBranchStore()
    const {
        filters,
        setPage,
        updateFilter,
        resetFilters,
    } = useProductFilters(Number(selectedBranchId) ?? 0)
    const {
        data: productsResponse,
        isLoading,
        isFetching,
        error,
    } = useProductsPaginated(filters)
    // Agregar producto al detalle
    const addProduct = (product: ProductGet) => {
        addItem(product)
        setIsSearchOpen(false);
    };

    useEffect(() => {
        updateFilter("descripcion", debouncedSearchTerm)
    }, [debouncedSearchTerm]);

    const filteredProducts = useMemo(() => {
        if (!productsResponse?.data) return [];

        return onlyWithStock
            ? productsResponse.data.filter((p) => p.stock_actual > 0)
            : productsResponse.data;
    }, [productsResponse?.data, onlyWithStock]);

    useEffect(() => {
        if (!filteredProducts || error || isFetching) return;

        if (filters.pagina && filters.pagina > 1) {
            setProducts((prev) => {
                const merged = [...prev, ...filteredProducts];
                // quitar duplicados por id
                const unique = merged.filter(
                    (item, index, self) => index === self.findIndex((p) => p.id === item.id)
                );

                return unique;
            });
        } else {
            setProducts(filteredProducts);
        }
    }, [filteredProducts, filters.pagina]);

    useEffect(() => {
        resetFilters()
        setSearchTerm("")
        setSelectedProducts([])
    }, [isSearchOpen])

    const handleToggleSelectedProduct = (product: ProductGet) => {
        setSelectedProducts((prev) => {
            const existingProduct = prev.find((p) => p.id === product.id)
            if (existingProduct) {
                return prev.filter((p) => p.id !== product.id)
            }
            return [...prev, product]
        })
    }

    const handleAddMultipleItems = () => {
        addMultipleItem(selectedProducts)
        setIsSearchOpen(false)
    }

    return (
        <section className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
                Detalle de Productos
            </h3>
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="bg-black hover:bg-gray-800 text-white"
                        size="sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Seleccionar Productos
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl border-gray-200">
                    <AlertDialogHeader>
                        <DialogTitle>Buscar Productos</DialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Buscar por descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-gray-200 focus:border-gray-300"
                            />
                        </div>

                        <div
                            id="products-scroll-container"
                            className="max-h-96 overflow-y-auto rounded-lg"
                        >
                            {isLoading && filters.pagina === 1 ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                    <span className="ml-2 text-gray-500">
                                        Cargando productos...
                                    </span>
                                </div>
                            ) : error ? (
                                <div className="text-center py-8 text-red-500">
                                    <p>Error al cargar los productos</p>
                                    <p className="text-sm mt-1">Intenta nuevamente</p>
                                </div>
                            ) : products.length > 0 ? (
                                <InfiniteScroll
                                    dataLength={products.length}
                                    next={() => setPage((filters.pagina || 1) + 1)}
                                    hasMore={products.length < (productsResponse?.meta.total || 0)}
                                    loader={
                                        <div className="flex items-center justify-center py-4">
                                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                            <span className="ml-2 text-gray-500 text-sm">
                                                Cargando más productos...
                                            </span>
                                        </div>
                                    }
                                    scrollableTarget="products-scroll-container"

                                >
                                    <div className="space-y-1 p-2">
                                        {products.map((product) => {
                                            const isSelected = selectedProducts.some((p) => p.id === product.id)
                                            return (
                                                <article
                                                    key={product.id}
                                                    className={`rounded-lg p-2 hover:bg-gray-100 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                                                    onDoubleClick={() => addProduct(product)}
                                                    onClick={() => handleToggleSelectedProduct(product)}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="">
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={() => handleToggleSelectedProduct(product)}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-sm">
                                                                {product.descripcion}
                                                            </h4>
                                                            <p className="text-xs text-gray-500">
                                                                OEM: {product.codigo_oem} | UPC:{" "}
                                                                {product.codigo_upc}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge
                                                                    variant="accent"
                                                                >
                                                                    {product.categoria}
                                                                </Badge>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-gray-200"
                                                                >
                                                                    {product.marca}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-green-600">
                                                                {formatCurrency(product.precio_venta)}
                                                            </p>
                                                            <Badge variant={'default'}>
                                                                {`${product.stock_actual} ${product.unidad_medida}`}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </article>
                                            )
                                        })}

                                        {products.length >= (productsResponse?.meta.total || 0) && (
                                            <div className="text-center py-4 text-gray-500 text-sm">
                                                No hay más productos para mostrar
                                            </div>
                                        )}
                                    </div>
                                </InfiniteScroll>
                            ) : (
                                <NoDataComponent
                                    message="No se encontraron productos"
                                    description="Intenta nuevamente con otro término de búsqueda"
                                />
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant={'outline'}
                            onClick={() => setIsSearchOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleAddMultipleItems}
                        >
                            <Plus className="size-4" />
                            {`Agregar ${selectedProducts.length > 0 ? `(${selectedProducts.length})` : ''}`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
};
export default ProductSelectorModal;