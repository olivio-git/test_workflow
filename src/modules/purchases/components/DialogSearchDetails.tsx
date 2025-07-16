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
import { apiConstructor } from "@/modules/products/services/api";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";

// Tipo de dato que responde el api
interface ProductResponse {
  id: number;
  descripcion: string;
  codigo_oem: string;
  codigo_upc: string;
  modelo: string;
  medida: string | null;
  nro_motor: string;
  categoria: string;
  subcategoria: string;
  marca: string;
  procedencia: string;
  unidad_medida: string;
  stock_actual: string;
  stock_resto: string;
  pedido_transito: string;
  pedido_almacen: string;
  precio_venta: string;
  precio_venta_alt: string;
  sucursal: string;
}

// El tipo de producto que ira en el detalle
interface PurchaseDetail {
  id_producto: string;
  cantidad: number;
  costo: number;
  inc_p_venta: number;
  precio_venta: number;
  inc_p_venta_alt: number;
  precio_venta_alt: number;
  producto: ProductResponse; // Referencia al producto original
  subtotal: number; // Calculado
}

export default function DialogSearchDetails({
  isSearchOpen,
  setIsSearchOpen,
  searchTerm,
  setSearchTerm,
  details,
  setDetails,
}: any) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  
  // Ref para el contenedor de scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: productsResponse,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["products", page, pageSize, debouncedSearchTerm],
    queryFn: () => {
      const searchParam = debouncedSearchTerm
        ? `&descripcion=${encodeURIComponent(debouncedSearchTerm)}`
        : "";
      return apiConstructor({
        url: `/products?pagina=${page}&pagina_registros=${pageSize}&sucursal=1${searchParam}`,
        method: "GET",
      });
    },
    staleTime: 5 * 60 * 1000,
    enabled: isSearchOpen, // Solo hacer la petición cuando el modal esté abierto
  });

  // Agregar producto al detalle
  const addProduct = (product: ProductResponse) => {
    const existingDetail = details.find(
      (d: any) => d.id_producto === product.id.toString()
    );

    if (existingDetail) {
      return;
    }

    const costo = parseFloat(product.precio_venta) || 0;
    const inc_p_venta = 30; // 30% por defecto
    const inc_p_venta_alt = 15; // 15% por defecto

    const precio_venta = costo * (1 + inc_p_venta / 100);
    const precio_venta_alt = costo * (1 + inc_p_venta_alt / 100);

    const newDetail: PurchaseDetail = {
      id_producto: product.id.toString(),
      cantidad: 1,
      costo,
      inc_p_venta,
      precio_venta,
      inc_p_venta_alt,
      precio_venta_alt,
      producto: product,
      subtotal: costo * 1, // costo * cantidad
    };

    setDetails([...details, newDetail]);
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
      setAllProducts([]);
      setHasNextPage(true);
    }
  }, [debouncedSearchTerm, isSearchOpen]);

  // Manejar los productos cuando llega nueva data
  useEffect(() => {
    if (productsResponse && isSearchOpen) {
      if (page === 1) {
        // Si es la primera página, reemplazar todos los productos
        setAllProducts(productsResponse);
      } else {
        // Si es una página adicional, agregar a los productos existentes
        setAllProducts(prev => [...prev, ...productsResponse]);
      }
      
      // Determinar si hay más páginas (si recibimos menos productos que el pageSize, no hay más)
      setHasNextPage(productsResponse.length === pageSize);
    }
  }, [productsResponse, page, pageSize, isSearchOpen]);

  // Función para manejar el scroll infinito
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isFetching || !hasNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // Si estamos cerca del final (100px antes del final)
    if (scrollHeight - scrollTop - clientHeight < 100) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, hasNextPage]);

  // Agregar event listener para scroll
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Detalle de Productos
      </h3>
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="h-8 border-gray-200 hover:border-gray-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
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
              ref={scrollContainerRef}
              className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg"
            >
              {isLoading && page === 1 ? (
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
              ) : allProducts.length > 0 ? (
                <div className="space-y-1 p-2">
                  {allProducts.map((product: ProductResponse) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer hover:border-gray-300 transition-colors"
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
                              variant="secondary"
                              className="text-xs border-gray-200"
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

                  {isFetching && page > 1 && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-500 text-sm">
                        Cargando más...
                      </span>
                    </div>
                  )}
                  
                  {!hasNextPage && allProducts.length > 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No hay más productos para mostrar
                    </div>
                  )}
                </div>
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