import { AlertDialogHeader } from "@/components/atoms/alert-dialog";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Plus, Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProductGet } from "../types/ProductGet";
import { useProductsPaginated } from "../hooks/useProductsPaginated";
import { useProductFilters } from "../hooks/useProductFilters";
import { useBranchStore } from "@/states/branchStore";
import InfiniteScroll from "react-infinite-scroll-component";

interface ProductSelectorModalProps {
    isSearchOpen: boolean
    setIsSearchOpen: any
    searchTerm: any
    setSearchTerm: any
    addItem: (product: ProductGet) => void
}
const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({
    isSearchOpen,
    setIsSearchOpen,
    searchTerm,
    setSearchTerm,
    addItem
}) => {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [products, setProducts] = useState<ProductGet[]>([]);

    const { selectedBranchId } = useBranchStore()
    const {
        filters,
        setPage,
        updateFilter
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
        setSearchTerm("");
        setPage(1); // Reset page when closing modal
    };

    // Debounce para el término de búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset cuando cambia el término de búsqueda o se abre el modal
    useEffect(() => {
        if (isSearchOpen) {
            setPage(1);
            updateFilter("descripcion", debouncedSearchTerm)
        }
    }, [debouncedSearchTerm, isSearchOpen]);

    useEffect(() => {
        if (!productsResponse?.data || error || isFetching) return;
        if (productsResponse?.data) {
            if (filters.pagina && filters.pagina > 1) {
                setProducts((prev) => [...prev, ...productsResponse.data]);
            } else {
                setProducts(productsResponse.data);
            }
        }
    }, [productsResponse, filters.pagina]);

    return (
        <div className="flex items-center justify-between">
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
                                        {products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="rounded-lg p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                                                onClick={() => addProduct(product)}
                                            >
                                                <div className="flex items-center justify-between">
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
                                                                variant="default"
                                                                className="text-xs "
                                                            >
                                                                {product.marca}
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs border-gray-200"
                                                            >
                                                                {product.categoria}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold text-green-600">
                                                            ${product.precio_venta}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Stock: {product.stock_actual}{" "}
                                                            {product.unidad_medida}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {products.length >= (productsResponse?.meta.total || 0) && (
                                            <div className="text-center py-4 text-gray-500 text-sm">
                                                No hay más productos para mostrar
                                            </div>
                                        )}
                                    </div>
                                </InfiniteScroll>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No se encontraron productos
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default ProductSelectorModal;