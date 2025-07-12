import { useCallback, useEffect, useRef, useState } from "react"
import {
    Search,
    Filter,
    Edit,
    Trash2,
    Grid3X3,
    List,
    Settings,
} from "lucide-react"
import { Button } from "@/components/atoms/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { Input } from "@/components/atoms/input"
import { Checkbox } from "@/components/atoms/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/atoms/dropdown-menu"
import type { ProductGet } from "../types/ProductGet"
import { useProductFilters } from "../hooks/useProductFilters"
import { useProductsPaginated } from "../hooks/useProductsPaginated"
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type ColumnResizeMode, type RowSelectionState, type SortingState } from "@tanstack/react-table"
import { Badge } from "@/components/atoms/badge"
import { useDebounce } from "use-debounce";
import { useCategoriesWithSubcategories } from "@/modules/catalog/hooks/useCategories"
import Pagination from "@/components/common/pagination"
import { Switch } from "@/components/atoms/switch"
import { Label } from "@/components/atoms/label"
import CustomizableTable from "@/components/common/CustomizableTable"

const ProductListScreen = () => {
    const [isInfiniteScroll, setIsInfiniteScroll] = useState(false)
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const {
        filters,
        updateFilter,
        setPage,
        resetFilters,
    } = useProductFilters(1); // suponiendo sucursal 1 por sesión
    // Aplicar debounce solo a los campos de texto
    const [debouncedDescripcion] = useDebounce(filters.descripcion, 1000);
    const [debouncedCodigoOEM] = useDebounce(filters.codigo_oem || '', 1000);
    const [debouncedCodigoUPC] = useDebounce(filters.codigo_upc || '', 1000);
    const [debouncedNroMotor] = useDebounce(filters.nro_motor || '', 1000);

    const debouncedFilters = {
        ...filters,
        descripcion: debouncedDescripcion,
        codigo_oem: debouncedCodigoOEM,
        codigo_upc: debouncedCodigoUPC,
        nro_motor: debouncedNroMotor
    };
    const { data, isLoading, error, isFetching } = useProductsPaginated(debouncedFilters);
    const { data: categoriesData } = useCategoriesWithSubcategories();
    // Función para determinar el color del stock
    const getStockColor = (stock: string) => {
        const stockNum = Number.parseInt(stock)
        if (stockNum <= 10) return "text-red-600 bg-red-50"
        if (stockNum <= 50) return "text-yellow-600 bg-yellow-50"
        return "text-green-600 bg-green-50"
    }

    const [sorting, setSorting] = useState<SortingState>([])
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    const columns: ColumnDef<ProductGet>[] = [
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
                <div className="space-y-1">
                    <div className="font-medium text-gray-900 leading-tight">{getValue<string>()}</div>
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
                const precio = Number.parseFloat(getValue<string>());
                const precioAlt = Number.parseFloat(row.original.precio_venta_alt);
                // const descuento = (((precio - precioAlt) / precio) * 100).toFixed(0);

                return (
                    <div className="space-y-1">
                        <div className="font-bold text-green-600">${precio.toFixed(2)}</div>
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
                const stock = getValue<string>();
                return (
                    <div
                        className={`flex gap-1 flex-wrap justify-center px-2 py-1 rounded ${getStockColor(stock)}`}
                    >
                        <div className="flex items-center gap-1">
                            <span className="font-medium">{Number.parseFloat(stock).toFixed(1)}</span>
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
                    <div className="text-sm font-medium">{Number.parseFloat(getValue<string>()).toFixed(1)}</div>
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
                const value = Number.parseInt(getValue<string>());
                return (
                    <div className="text-center">
                        <div className={`text-sm font-medium ${value > 0 ? "text-blue-600" : "text-gray-400"}`}>
                            {Number.parseFloat(getValue<string>()).toFixed(1)}
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
                    <div className="text-sm font-medium text-green-600">{getValue<string>()}</div>
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
    ];

    const [columnVisibility, setColumnVisibility] = useState({})

    const [viewMode, setViewMode] = useState<"list" | "grid">("list")
    const [selectedProducts, setSelectedProducts] = useState<number[]>([])
    const [priceFilter, setPriceFilter] = useState("all")
    const [storeFilter, setStoreFilter] = useState("all");

    // Filter and sort products
    const table = useReactTable<ProductGet>({
        data: data?.data || [],
        columns,
        state: {
            sorting,
            columnVisibility,
            // globalFilter,
            // columnFilters,
            rowSelection,
            // pagination,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        // onGlobalFilterChange: setGlobalFilter,
        // onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        // onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
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
    const handleScroll = useCallback(() => {
        if (
            tableContainerRef.current &&
            !isLoading &&
            !isFetching &&
            tableContainerRef.current.scrollHeight - tableContainerRef.current.scrollTop <=
            tableContainerRef.current.clientHeight + 100
        ) {
            setPage((filters.pagina || 1) + 1);
        }
    }, [isLoading, isFetching]);

    useEffect(() => {
        if (isInfiniteScroll) {
            const tableRef = tableContainerRef.current;
            if (tableRef) {
                tableRef.addEventListener("scroll", handleScroll);
                return () => tableRef.removeEventListener("scroll", handleScroll);
            }
        }
        else return
    }, [handleScroll]);
    return (
        <div
            ref={tableContainerRef}
            className="min-h-screen max-w-full">
            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="p-2 border-b border-gray-200">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
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
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar productos..."
                                    value={filters.descripcion}
                                    onChange={(e) => updateFilter("descripcion", e.target.value)}
                                    className="pl-10 w-64 text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    className="bg-gray-200"
                                    id="infinite-scroll" checked={isInfiniteScroll} onCheckedChange={setIsInfiniteScroll} />
                                <Label htmlFor="infinite-scroll text-gray-700" className="text-sm">
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
                            {/* <FilterActives showFilter={showFilter} setShowFilter={setShowFilter} />
                            <FilterSort sortBy={sortBy} setSortBy={setSortBy} /> */}

                            <Button variant="outline" className="hover:bg-gray-50" size="sm" onClick={resetFilters}>
                                <Filter className="h-4 w-4 mr-2" />
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-gray-200">
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categorias</label>
                            <Select
                                value={filters.categoria !== undefined ? String(filters.categoria) : "all"}
                                onValueChange={(value) => {
                                    const parsedValue = value === "all" ? undefined : Number(value);
                                    updateFilter("subcategoria", undefined);
                                    updateFilter("categoria", parsedValue);
                                }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="TODAS" />
                                </SelectTrigger>
                                <SelectContent className="border border-gray-200 shadow-lg">
                                    <SelectItem className="hover:bg-gray-50" value="all">TODAS</SelectItem>
                                    {categoriesData?.map((category) => (
                                        <SelectItem key={category.id} className="hover:bg-gray-50" value={String(category.id)}>
                                            {category.categoria}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subcategorias</label>
                            <Select
                                disabled={filters.categoria === undefined}
                                value={filters.subcategoria !== undefined ? String(filters.subcategoria) : "all"}
                                onValueChange={(value) => {
                                    const parsedValue = value === "all" ? undefined : Number(value);
                                    updateFilter("subcategoria", parsedValue);
                                }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="TODAS" />
                                </SelectTrigger>
                                <SelectContent className="border border-gray-200 shadow-lg">
                                    <SelectItem className="hover:bg-gray-50" value="all">TODAS</SelectItem>
                                    {categoriesData
                                        ?.find((cat) => cat.id === filters.categoria)
                                        ?.subcategorias?.map((sub) => (
                                            <SelectItem
                                                key={sub.id}
                                                value={String(sub.id)}
                                                className="hover:bg-gray-50"
                                            >
                                                {sub.subcategoria}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio de venta</label>
                            <Select value={priceFilter} onValueChange={setPriceFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border border-gray-200 shadow-lg">
                                    <SelectItem className="hover:bg-gray-50" value="all">Todos los precios</SelectItem>
                                    <SelectItem className="hover:bg-gray-50" value="50-100">50 - 100</SelectItem>
                                    <SelectItem className="hover:bg-gray-50" value="100-200">100 - 200</SelectItem>
                                    <SelectItem className="hover:bg-gray-50" value="200-500">200 - 500</SelectItem>
                                    <SelectItem className="hover:bg-gray-50" value="500-1000">500 - 1000</SelectItem>

                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sucursal</label>
                            <Select value={storeFilter} onValueChange={setStoreFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border border-gray-200 shadow-lg">
                                    <SelectItem className="hover:bg-gray-50" value="all">Ver todas</SelectItem>
                                    <SelectItem className="hover:bg-gray-50" value="Store 1">Store 1</SelectItem>
                                    <SelectItem className="hover:bg-gray-50" value="Store 2">Store 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="p-4 text-sm text-gray-600 border-b border-gray-200">
                    Showing {data?.data.length} of {data?.meta.total} products
                    {selectedProducts.length > 0 && (
                        <span className="ml-4 text-blue-600">{selectedProducts.length} selected</span>
                    )}
                </div>

                {viewMode === "list" ? (
                    <div
                        className="overflow-x-hidden">
                        <CustomizableTable
                            table={table}
                        />
                    </div>
                ) : (
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {data?.data.map((product: any) => (
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
                    !isInfiniteScroll && (
                        <Pagination
                            currentPage={filters.pagina || 1}
                            onPageChange={onPageChange}
                            totalData={data?.meta.total || 1}
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
