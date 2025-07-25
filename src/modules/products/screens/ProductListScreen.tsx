import { useEffect, useMemo, useState } from "react"
import {
    Search,
    Filter,
    Edit,
    Trash2,
    Settings,
    Eye,
    ShoppingCart,
    Loader2,
} from "lucide-react"
import { Button } from "@/components/atoms/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { Input } from "@/components/atoms/input"
import { Checkbox } from "@/components/atoms/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/atoms/dropdown-menu"
import type { ProductGet } from "../types/ProductGet"
import { useProductFilters } from "../hooks/useProductFilters"
import { useProductsPaginated } from "../hooks/useProductsPaginated"
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef, type RowSelectionState, type SortingState } from "@tanstack/react-table"
import { Badge } from "@/components/atoms/badge"
import Pagination from "@/components/common/pagination"
import { Switch } from "@/components/atoms/switch"
import { Label } from "@/components/atoms/label"
import CustomizableTable from "@/components/common/CustomizableTable"
import InfiniteScroll from 'react-infinite-scroll-component';
import { useBranchStore } from "@/states/branchStore"
import authSDK from "@/services/sdk-simple-auth"
import { useNavigate } from "react-router"
import ProductFilters from "../components/productList/productFilters"
import { useCartWithUtils } from "@/modules/shoppingCart/hooks/useCartWithUtils"

const ProductListScreen = () => {
    const [isInfiniteScroll, setIsInfiniteScroll] = useState(false)
    const { selectedBranchId } = useBranchStore()
    const navigate = useNavigate()
    const user = authSDK.getCurrentUser()
    const {
        filters,
        updateFilter,
        setPage,
        resetFilters,
    } = useProductFilters(Number(selectedBranchId) || 1); // suponiendo sucursal 1 por sesión

    const { data: productData, isLoading, error, isFetching, isError } = useProductsPaginated(filters);

    const { addItem } = useCartWithUtils(user?.name ?? '')
    const [sorting, setSorting] = useState<SortingState>([])
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [products, setProducts] = useState<ProductGet[]>([]);
    const [columnVisibility, setColumnVisibility] = useState({})

    const [viewMode, setViewMode] = useState<"list" | "grid">("list")
    const [selectedProducts, setSelectedProducts] = useState<number[]>([])

    const COLUMN_VISIBILITY_KEY = `product-columns-${user?.name}`;

    useEffect(() => {
        const savedVisibility = localStorage.getItem(COLUMN_VISIBILITY_KEY);
        if (savedVisibility) {
            try {
                setColumnVisibility(JSON.parse(savedVisibility));
            } catch {
                localStorage.removeItem(COLUMN_VISIBILITY_KEY);
            }
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(columnVisibility));
    }, [columnVisibility, user]);


    useEffect(() => {
        if (!productData?.data || error || isFetching) return;
        if (productData?.data) {
            if (isInfiniteScroll && filters.pagina && filters.pagina > 1) {
                setProducts((prev) => [...prev, ...productData.data]);
            } else {
                setProducts(productData.data);
            }
        }
    }, [productData, isInfiniteScroll, filters.pagina]);

    useEffect(() => {
        if (isInfiniteScroll) {
            setProducts([]);
            setPage(1);
        }
    }, [filters.descripcion, filters.categoria, filters.subcategoria, filters.codigo_oem]);

    // Función para determinar el color del stock
    const getStockColor = (stock: number, stock_min: number) => {
        const stockMin: number = stock_min || 10
        if (stock <= stockMin) return "text-red-600 bg-red-50"
        if (stock <= (stockMin + 10)) return "text-yellow-600 bg-yellow-50"
        return "text-green-600 bg-green-50"
    }
    const handleProductDetail = (productId: number) => {
        navigate(`/dashboard/productos/${productId}`);
    }

    const columns = useMemo<ColumnDef<ProductGet>[]>(() => [
        {
            id: "Select",
            header: ({ table }) => (
                <Checkbox
                    className="border border-gray-400"
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Seleccionar todo"
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <Checkbox
                        className="border border-gray-400"
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Seleccionar fila"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: true,
            size: 40,
            minSize: 40,
        },
        {
            accessorKey: "descripcion",
            header: "Producto",
            size: 300,
            minSize: 250,
            enableHiding: false,
            cell: ({ row, getValue }) => (
                <div
                    onClick={() => handleProductDetail(row.original.id)}
                    className="space-y-1 cursor-pointer group hover:bg-blue-50 p-1 rounded">
                    <div className="font-medium text-gray-900 leading-tight group-hover:underline">{getValue<string>()}</div>
                    <div className=" text-gray-500 font-mono">
                        UPC: {row.original.codigo_upc}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "codigo_oem",
            header: "Cód. OEM",
            size: 180,
            minSize: 150,
            cell: ({ getValue }) => (
                <div className="flex items-center justify-center">
                    <Badge className="font-mono rounded font-normal" variant="secondary">{getValue<string>()}</Badge>
                </div>
            ),
        },
        {
            accessorKey: "precio_venta",
            header: "Precio Venta",
            size: 120,
            minSize: 100,
            cell: ({ row, getValue }) => {
                const precioAlt = row.original.precio_venta_alt;
                return (
                    <div className="space-y-1">
                        <div className="font-bold text-green-600">${getValue<number>().toFixed(2)}</div>
                        {/* {precioAlt < precio && ( */}
                        <div className="flex items-center gap-1">
                            <span className=" text-gray-500">Alt: ${precioAlt.toFixed(2)}</span>
                            {/* <Badge variant="destructive" className="text-xs px-1 py-0">
                                    {descuento}%
                                </Badge> */}
                        </div>
                        {/* )} */}
                    </div>
                );
            },
        },
        {
            accessorKey: "stock_actual",
            header: "Stock Actual",
            size: 110,
            minSize: 100,
            cell: ({ row, getValue }) => {
                const stock = getValue<number>();
                const stockMin = row.original.stock_minimo || 1;
                return (
                    <div
                        className={`flex gap-1 flex-wrap justify-center px-2 py-1 rounded ${getStockColor(stock, stockMin)}`}
                    >
                        <div className="flex items-center gap-1">
                            <span className="font-medium">{getValue<number>().toFixed(0)}</span>
                        </div>
                        <span className="">{row.original.unidad_medida}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "stock_resto",
            header: "Stock Sucursales",
            size: 100,
            minSize: 100,
            cell: ({ getValue }) => (
                <div className="text-center">
                    <div className="text-sm font-medium">{getValue<number>().toFixed(0)}</div>
                    <div className=" text-gray-500">disponible</div>
                </div>
            ),
        },
        {
            accessorKey: "marca",
            header: "Marca",
            size: 100,
            minSize: 80,
        },
        {
            accessorKey: "categoria",
            header: "Categoría",
            size: 150,
            minSize: 120,
            cell: ({ row, getValue }) => (
                <div className="space-y-1">
                    <span className="text-blue-600 font-medium">{getValue<string>()}</span>
                    <div className=" text-gray-500">{row.original.subcategoria}</div>
                </div>
            ),
        },
        {
            accessorKey: "nro_motor",
            header: "Motor/Modelo",
            size: 150,
            minSize: 120,
            cell: ({ row, getValue }) => (
                <div className="space-y-1">
                    <div className="font-medium">{getValue<string>()}</div>
                    {
                        row.original.modelo && (
                            <div className="text-gray-500 font-mono">Modelo: {row.original.modelo}</div>
                        )
                    }
                </div>
            ),
        },
        {
            accessorKey: "pedido_transito",
            header: "En Tránsito",
            size: 100,
            minSize: 100,
            cell: ({ getValue }) => {
                const value = getValue<number>()
                return (
                    <div className="text-center">
                        <div className={`text-sm font-medium ${value > 0 ? "text-blue-600" : "text-gray-400"}`}>
                            {getValue<number>().toFixed(0)}
                        </div>
                        <div className=" text-gray-500">pedidos</div>
                    </div>
                );
            },
        },
        {
            accessorKey: "pedido_almacen",
            header: "En Almacén",
            size: 100,
            minSize: 100,
            cell: ({ getValue }) => (
                <div className="text-center">
                    <div className="text-sm font-medium text-green-600">{getValue<number>()}</div>
                    {/* <div className=" text-gray-500">reservado</div> */}
                </div>
            ),
        },
        {
            accessorKey: "procedencia",
            header: "Origen",
            size: 100,
            minSize: 80,
        },
        {
            accessorKey: "medida",
            header: "Medida",
            size: 100,
            minSize: 80,
        },
        {
            accessorKey: "sucursal",
            header: "Sucursal",
            size: 100,
            minSize: 100,
            cell: ({ getValue }) => (
                <div className="text-center">
                    <Badge className="rounded" variant="secondary">{getValue<string>()}</Badge>
                </div>
            ),
        },
        {
            id: "Actions",
            header: "Acciones",
            cell: ({ row }) => (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleProductDetail(row.original.id)}
                        aria-label="Ver Detalle"
                        className="size-8 cursor-pointer"
                    >
                        <Eye className="size-4" />
                    </Button>
                    <Button
                        variant="default"
                        size="icon"
                        onClick={() => addItem(row.original)}
                        aria-label="Añadir Producto al Carrito"
                        className="size-8 cursor-pointer"
                    >
                        <ShoppingCart className="size-4" />
                    </Button>
                </div>
            ),
            enableSorting: false,
            enableHiding: true,
            size: 100,
            minSize: 100,
        },
    ], [])
    // Filter and sort products
    const table = useReactTable<ProductGet>({
        data: products,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
        enableColumnResizing: true,
        enableRowSelection: true,
    })

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            // setSelectedProducts(filteredAndSortedProducts.map((p) => p.id))
        } else {
            setSelectedProducts([])
        }
    }

    const handleSelectProduct = (productId: number, checked: boolean) => {
        if (checked) {
            setSelectedProducts([...selectedProducts, productId])
        } else {
            setSelectedProducts(selectedProducts.filter((id) => id !== productId))
        }
    }
    const onPageChange = (page: number) => {
        setPage(page);
    };

    const onShowRowsChange = (rows: number) => {
        updateFilter("pagina_registros", rows);
        updateFilter("pagina", 1);
    };

    return (
        <div
            className="min-h-screen max-w-full">
            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="p-2 border-b border-gray-200">
                    {/* <h1 className="text-2xl font-bold">Productos</h1> */}
                    <div className="flex items-center justify-between gap-2 md:gap-4 flex-wrap">
                        <div className="flex items-center gap-2 md:gap-4 grow">
                            {/* <div className="flex items-center gap-2">
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                            </div> */}

                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar productos..."
                                    value={filters.descripcion ?? ""}
                                    onChange={(e) => updateFilter("descripcion", e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap md:gap-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="infinite-scroll"
                                    checked={isInfiniteScroll}
                                    onCheckedChange={(checked) => {
                                        setIsInfiniteScroll(checked);
                                        setPage(1);
                                        setProducts([])
                                    }}
                                />
                                <Label htmlFor="infinite-scroll">
                                    Scroll Infinito
                                </Label>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Columnas
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto border border-gray-200">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => (
                                            <DropdownMenuItem
                                                key={column.id}
                                                className="flex items-center space-x-2 cursor-pointer"
                                                onSelect={(e) => e.preventDefault()}
                                            >
                                                <Checkbox
                                                    className="border border-gray-400"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                />
                                                <span className="flex-1">
                                                    {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
                                                </span>
                                            </DropdownMenuItem>
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button variant="outline" className="hover:bg-gray-50" size="sm" onClick={resetFilters}>
                                <Filter className="h-4 w-4 mr-2" />
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Búsquedas individuales */}
                <ProductFilters
                    filters={filters}
                    updateFilter={updateFilter}
                />
                {/* Results Info */}
                <div className="p-2 text-sm text-gray-600 border-b border-gray-200 flex items-center justify-between">
                    {
                        isInfiniteScroll ?

                            `Mostrando ${products.length} de ${productData?.meta.total} productos`
                            :
                            `Mostrando ${((filters.pagina ?? 1) * (filters.pagina_registros ?? 1)) - ((filters.pagina_registros ?? 1) - 1)} 
                            - ${(filters.pagina ?? 1) * (filters.pagina_registros ?? 1)} de ${productData?.meta.total} productos`
                    }
                    {selectedProducts.length > 0 && (
                        <span className="ml-4 text-blue-600">{selectedProducts.length} selected</span>
                    )}
                    <div className="flex items-center gap-2">
                        <label className="block text-sm font-medium text-gray-700">Mostrar:</label>
                        <Select value={(filters.pagina_registros ?? 10).toString()} onValueChange={(value) => onShowRowsChange?.(Number(value))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="shadow-lg">
                                <SelectItem value={"10"}>10</SelectItem>
                                <SelectItem value={"25"}>25</SelectItem>
                                <SelectItem value={"50"}>50</SelectItem>
                                <SelectItem value={"100"}>100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {viewMode === "list" ? (
                    <div
                        className="overflow-x-hidden">
                        {isInfiniteScroll ? (
                            <InfiniteScroll
                                dataLength={products.length}
                                next={() => setPage((filters.pagina || 1) + 1)}
                                hasMore={products.length < (productData?.meta.total || 0)}
                                loader={
                                    <div className="flex items-center justify-center gap-2 text-center p-6 text-xs sm:text-sm text-gray-500 bg-gray-50">
                                        <Loader2 className="size-4 animate-spin" />
                                        Cargando más productos...
                                    </div>
                                }
                                scrollableTarget="main-scroll-container"
                            >
                                <CustomizableTable
                                    table={table}
                                    isError={isError}
                                    errorMessage="Ocurrió un error al cargar los productos"
                                    isLoading={isLoading}
                                    noDataMessage="No se encontraron productos"
                                />
                            </InfiniteScroll>
                        ) : (
                            <CustomizableTable
                                table={table}
                                isError={isError}
                                isFetching={isFetching}
                                isLoading={isLoading}
                                errorMessage="Ocurrió un error al cargar los productos"
                                rows={filters.pagina_registros}
                                noDataMessage="No se encontraron productos"
                            />
                        )}

                    </div>
                ) : (
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {productData?.data.map((product: any) => (
                                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <Checkbox
                                            className="border border-gray-400"
                                            checked={selectedProducts.includes(product.id)}
                                            onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                                        />
                                        <div
                                            className={`px-2 py-1 rounded-full text-xs ${product.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                        >
                                            {product.status}
                                        </div>
                                    </div>

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        width={200}
                                        height={150}
                                        className="w-full h-32 object-cover rounded-md mb-3"
                                    />

                                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                                    <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
                                    <p className="text-lg font-bold text-blue-600 mb-2">${product.price}</p>

                                    <div className="flex justify-between text-xs text-gray-500 mb-3">
                                        <span>Stock: {product.products}</span>
                                        <span>Views: {product.views}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 text-blue-600 border-blue-600 bg-transparent">
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 border-red-600 bg-transparent"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Pagination */}
                {
                    !isInfiniteScroll && (productData?.data?.length ?? 0) > 0 && (
                        <Pagination
                            currentPage={filters.pagina || 1}
                            onPageChange={onPageChange}
                            totalData={productData?.meta.total || 1}
                            onShowRowsChange={onShowRowsChange}
                            showRows={filters.pagina_registros}
                        />
                    )
                }
            </div>
        </div>
    )
}

export default ProductListScreen
