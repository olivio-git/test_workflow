import { useCallback, useEffect, useMemo, useState } from "react"
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
import { useDebounce } from "use-debounce"
import { formatCell } from "@/utils/formatCell"
import BottomShoppingCartBar from "@/modules/shoppingCart/components/BottomShoppingCartBar"
import ResizableBox from "@/components/atoms/resizable-box"

const getColumnVisibilityKey = (userName: string) => `product-columns-${userName}`;

const ProductListScreen = () => {
    const [isInfiniteScroll, setIsInfiniteScroll] = useState(false)
    const { selectedBranchId } = useBranchStore()
    const navigate = useNavigate()
    const user = authSDK.getCurrentUser()
    const [showFilters, setShowFilters] = useState<boolean>(true)
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

    const { addItemToCart, addMultipleItems } = useCartWithUtils(user?.name ?? '', selectedBranchId ?? '')
    const [sorting, setSorting] = useState<SortingState>([])
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [products, setProducts] = useState<ProductGet[]>([]);
    const [columnVisibility, setColumnVisibility] = useState({})
    const [searchDescription, setSearchDescription] = useState("");
    const [debouncedSearchDescription] = useDebounce(searchDescription, 500);

    useEffect(() => {
        updateFilter("descripcion", debouncedSearchDescription);
    }, [debouncedSearchDescription]);

    useEffect(() => {
        updateFilter("sucursal", Number(selectedBranchId))
    }, [selectedBranchId])

    useEffect(() => {
        if (!user?.name) return;
        const COLUMN_VISIBILITY_KEY = getColumnVisibilityKey(user.name);
        const savedVisibility = localStorage.getItem(COLUMN_VISIBILITY_KEY);
        if (savedVisibility) {
            try {
                const parsed = JSON.parse(savedVisibility);
                setColumnVisibility(parsed);
            } catch (error) {
                console.error('Error parsing column visibility:', error);
                localStorage.removeItem(COLUMN_VISIBILITY_KEY);
            }
        }
    }, [user?.name]);

    useEffect(() => {
        if (!user?.name || Object.keys(columnVisibility).length === 0) return;
        const COLUMN_VISIBILITY_KEY = getColumnVisibilityKey(user.name);
        try {
            localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(columnVisibility));
        } catch (error) {
            console.error('Error saving column visibility:', error);
        }
    }, [columnVisibility, user?.name]);

    useEffect(() => {
        if (!productData?.data || error || isFetching) return;

        if (isInfiniteScroll && filters.pagina && filters.pagina > 1) {
            setProducts((prev) => {
                // Evitar duplicados
                const newProducts = productData.data.filter(
                    newProduct => !prev.some(existingProduct => existingProduct.id === newProduct.id)
                );
                return [...prev, ...newProducts];
            });
        } else {
            setProducts(productData.data);
        }
    }, [productData?.data, isInfiniteScroll, filters.pagina]);

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
                    className="flex items-center gap-1">

                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="size-6 px-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    onKeyDown={(e) => {
                                        if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
                                            e.stopPropagation();
                                        }
                                    }}
                                >
                                    <MoreVertical className="size-4" />
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
                            tooltipContentProps={{
                                align: 'start'
                            }}
                            tooltip={
                                <p>Presiona <Kbd>enter</Kbd> para ver los detalles del producto</p>
                            }
                        >
                            <h3 className="font-medium text-gray-900 leading-tigh hover:underline truncate">{getValue<string>()}</h3>
                        </TooltipWrapper>
                        <span className=" text-gray-500 font-mono">
                            UPC: {formatCell(row.original.codigo_upc)}
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
                    <Badge className="font-mono rounded font-normal w-full" variant="secondary">{formatCell(getValue<string>())}</Badge>
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
                        <div className="flex items-center gap-1">
                            <span className=" text-gray-500">Alt: ${formatCell(precioAlt.toFixed(2))}</span>
                        </div>
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
                    <div className="font-medium">{formatCell(getValue<string>())}</div>
                    <div className="text-gray-500 font-mono">Modelo: {formatCell(row.original.modelo)}</div>
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
            cell: ({ getValue }) => {
                const value = getValue<string>()
                const formatValue = formatCell(value)
                return (
                    <div className={`${!value ? 'italic text-gray-400' : ''}`}>
                        {formatValue}
                    </div>
                )
            },

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

    const hasProductSelected = Object.keys(rowSelection).length;
    const handleAddSelectedToCart = useCallback(() => {
        if (!table || !table.getSelectedRowModel) {
            console.warn("Tabla no inicializada correctamente");
            return;
        }

        const selectedProducts = table.getSelectedRowModel().rows.map(row => row.original);

        if (selectedProducts.length === 0) {
            console.warn("No hay productos seleccionados para agregar al carrito.");
            return;
        }

        try {
            const productsForCart = selectedProducts.map(product => CartProductSchema.parse(product));
            addMultipleItems(productsForCart);

            setTimeout(() => {
                if (table && table.resetRowSelection) {
                    table.resetRowSelection();
                }
            }, 0);
        } catch (error) {
            console.error("Error al procesar productos para el carrito:", error);
        }
    }, [table, addMultipleItems]);


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

    const toggleShowFilters = () => {
        setShowFilters(!showFilters)
    }

    return (
        <main
            className="min-h-screen max-w-full">
            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <header className="p-2 border-b border-gray-200">
                    <h1 className="text-lg font-bold text-gray-900">Productos</h1>
                    <section className="flex items-center justify-between gap-2 md:gap-4 flex-wrap">
                        <div className="flex items-center gap-2 md:gap-4 grow">

                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar por descripcion..."
                                    value={searchDescription}
                                    onChange={(e) => setSearchDescription(e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="infinite-scroll"
                                    checked={isInfiniteScroll}
                                    onCheckedChange={(checked) => {
                                        setIsInfiniteScroll(checked)
                                        setPage(1)
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

                            <Button variant="outline" size="sm" onClick={resetFilters}>
                                <Filter className="h-4 w-4 mr-2" />
                                Reset Filters
                            </Button>
                            <Button size={'sm'} onClick={toggleShowFilters}>
                                {
                                    showFilters ?
                                        "Ocultar filtros" :
                                        "Mostrar filtros"
                                }
                            </Button>
                        </div>
                    </section>
                </header>
                {/* Búsquedas individuales */}
                {
                    showFilters &&
                    <ProductFilters
                        filters={filters}
                        updateFilter={updateFilter}
                    />
                }
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
                        {
                            table && hasProductSelected > 0 && (
                                <Button size={'sm'} className="relative" onClick={handleAddSelectedToCart}>
                                    Agregar al carrito
                                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                                        {hasProductSelected}
                                    </Badge>
                                </Button>
                            )
                        }
                    </div>
                </div>

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
                            rows={filters.pagina_registros}
                            noDataMessage="No se encontraron productos"
                            selectedRowIndex={selectedIndex}
                            onRowClick={handleRowClick}
                            onRowDoubleClick={handleRowDoubleClick}
                            tableRef={tableRef}
                            focused={isFocused}
                            keyboardNavigationEnabled={true}
                        />
                    </InfiniteScroll>
                ) : (
                    <ResizableBox
                        direction="vertical"
                        minSize={10}
                        initialSize={20}
                    >
                        <div
                            className="overflow-auto h-full">
                            <div
                                onClick={handleTableClick}
                                className="overflow-x-hidden">
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

                            </div>

                            {/* Pagination */}
                            {
                                (productData?.data?.length ?? 0) > 0 && (
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
                    </ResizableBox>
                )}

            </div>
            {
                !isInfiniteScroll &&
                <BottomShoppingCartBar />
            }
        </main>
    )
}

export default ProductListScreen
