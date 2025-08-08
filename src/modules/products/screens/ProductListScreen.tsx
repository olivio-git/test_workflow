import { useEffect, useMemo, useState } from "react"
import {
    Search,
    Filter,
    Settings,
    Eye,
    ShoppingCart,
    Loader2,
    RefreshCcw,
    MoreVertical,
    Edit,
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
import TooltipButton from "@/components/common/TooltipButton"
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation"
import { TooltipWrapper } from "@/components/common/TooltipWrapper "
import { Kbd } from "@/components/atoms/kbd"
import { CartProductSchema } from "@/modules/shoppingCart/schemas/cartProduct.schema"

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
    } = useProductFilters(Number(selectedBranchId) || 1);

    const {
        data: productData,
        isLoading,
        error,
        isFetching,
        isError,
        refetch: refetchProducts,
        isRefetching: isRefetchingProducts,
    } = useProductsPaginated(filters);

    const { addItemToCart } = useCartWithUtils(user?.name ?? '')
    const [sorting, setSorting] = useState<SortingState>([])
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [products, setProducts] = useState<ProductGet[]>([]);
    const [columnVisibility, setColumnVisibility] = useState({})

    const [selectedProducts, setSelectedProducts] = useState<number[]>([])

    const COLUMN_VISIBILITY_KEY = `product-columns-${user?.name}`;

    useEffect(() => {
        updateFilter("sucursal", Number(selectedBranchId))
    }, [selectedBranchId])

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
        if (stock <= stockMin) return "danger"
        if (stock <= (stockMin + 10)) return "warning"
        return "success"
    }
    const handleProductDetail = (productId: number) => {
        navigate(`/dashboard/productos/${productId}`);
    }

    const handleAddItemCart = (product: ProductGet) => {
        const productForCart = CartProductSchema.parse(product)
        addItemToCart(productForCart)
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
                    className="group rounded flex items-center gap-1">

                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="size-8"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    onKeyDown={(e) => {
                                        if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
                                            e.stopPropagation();
                                        }
                                    }}
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                onCloseAutoFocus={(e) => {
                                    e.preventDefault();
                                }}
                                align="start"
                                className="w-48">
                                <DropdownMenuItem
                                    onKeyDown={(e) => e.stopPropagation()}
                                    onClick={() => handleProductDetail(row.original.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onKeyDown={(e) => e.stopPropagation()}
                                    onClick={() => handleAddItemCart(row.original)}>
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Agregar al carrito
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onKeyDown={(e) => e.stopPropagation()}
                                    onClick={() => { }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar producto
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex flex-col">
                        <TooltipWrapper
                            tooltip={
                                <p>Presiona <Kbd>enter</Kbd> para ver los detalles del producto</p>
                            }
                        >
                            <h3 className="font-medium text-gray-900 leading-tigh group-hover:underline truncate">{getValue<string>()}</h3>
                        </TooltipWrapper>
                        <span className=" text-gray-500 font-mono">
                            UPC: {row.original.codigo_upc}
                        </span>
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
                    <div className="space-y-1 flex items-end flex-col">
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
                    <Badge
                        variant={getStockColor(stock, stockMin)}
                        className={`flex flex-col justify-center rounded`}
                    >
                        <span className="font-bold">{getValue<number>().toFixed(0)}</span>
                        <span className="text-[10px] uppercase">{row.original.unidad_medida}</span>
                    </Badge>
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
                    <div className=" text-gray-500">Disponible</div>
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
                        <div className=" text-gray-500">Pedidos</div>
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

    const {
        selectedIndex,
        setSelectedIndex,
        isFocused,
        tableRef,
        handleTableClick,
    } = useKeyboardNavigation({
        products,
        onAddToCart: addItemToCart,
        onViewDetails: handleProductDetail,
        onRemoveFromCart: () => { },
    });
    const handleRowClick = (index: number) => {
        setSelectedIndex(index);
    };

    const handleRowDoubleClick = (product: ProductGet) => {
        addItemToCart(product);
    };

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

    const handleRefetchProducts = () => {
        refetchProducts();
    }

    return (
        <div
            className="min-h-screen max-w-full">
            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="p-2 border-b border-gray-200">
                    <h1 className="text-lg font-bold text-gray-900">Productos</h1>
                    <div className="flex items-center justify-between gap-2 md:gap-4 flex-wrap">
                        <div className="flex items-center gap-2 md:gap-4 grow">

                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar por descripcion..."
                                    value={filters.descripcion ?? ""}
                                    onChange={(e) => updateFilter("descripcion", e.target.value)}
                                    className="pl-10 w-full"
                                    autoFocus
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

                            <TooltipButton
                                onClick={handleRefetchProducts}
                                buttonProps={{
                                    className: 'w-8',
                                    disabled: isRefetchingProducts || isFetching,
                                }}
                                tooltip={"Recargar productos"}
                            >
                                <RefreshCcw className={`size-4 ${isRefetchingProducts || isFetching ? 'animate-spin' : ''}`} />
                            </TooltipButton>

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
                                                onClick={() => column.toggleVisibility(!column.getIsVisible())}
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

                            <Button variant="outline" size="sm" onClick={resetFilters}>
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
                        products.length > 0 ?
                            isInfiniteScroll ?

                                `Mostrando ${products.length} de ${productData?.meta.total} productos`
                                :
                                `Mostrando ${((filters.pagina ?? 1) * (filters.pagina_registros ?? 1)) - ((filters.pagina_registros ?? 1) - 1)} 
                            - ${(filters.pagina ?? 1) * (filters.pagina_registros ?? 1)} de ${productData?.meta.total} productos`
                            : <span>Cargando...</span>
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

                <div
                    onClick={handleTableClick}
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
                            selectedRowIndex={selectedIndex}
                            onRowClick={handleRowClick}
                            onRowDoubleClick={handleRowDoubleClick}
                            tableRef={tableRef}
                            focused={isFocused}
                            keyboardNavigationEnabled={true}
                        />
                    )}

                </div>

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
