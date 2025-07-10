import React, { useState, useMemo } from "react"
import {
    Search,
    Filter,
    Edit,
    Trash2,
    Grid3X3,
    List,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    AlertTriangle,
    Package,
    CheckCircle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/table"
import { Button } from "@/components/atoms/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { Input } from "@/components/atoms/input"
import { Checkbox } from "@/components/atoms/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/atoms/dropdown-menu"
import { FilterActives } from "../components/FilterActives"
import { FilterSort } from "../components/FilterSort"
import type { ProductGet } from "../types/ProductGet"
import { useProductFilters } from "../hooks/useProductFilters"
import { useProductsPaginated } from "../hooks/useProductsPaginated"
import ProductListTable from "../components/ProductListTable"
import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type ColumnResizeMode, type RowSelectionState, type SortingState } from "@tanstack/react-table"
import { Badge } from "@/components/atoms/badge"

const ProductListScreen = () => {
    const {
        filters,
        updateFilter,
        setPage,
        // resetFilters,
    } = useProductFilters(1); // suponiendo sucursal 1 por sesión
    const { data, isLoading, error } = useProductsPaginated(filters);
    // Función para determinar el color del stock
    const getStockColor = (stock: string) => {
        const stockNum = Number.parseInt(stock)
        if (stockNum <= 10) return "text-red-600 bg-red-50"
        if (stockNum <= 50) return "text-yellow-600 bg-yellow-50"
        return "text-green-600 bg-green-50"
    }

    // Función para obtener el ícono del stock
    const getStockIcon = (stock: string) => {
        const stockNum = Number.parseInt(stock)
        if (stockNum <= 10) return <AlertTriangle className="w-3 h-3" />
        if (stockNum <= 50) return <Package className="w-3 h-3" />
        return <CheckCircle className="w-3 h-3" />
    }

    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [columnResizeMode, setColumnResizeMode] = useState<ColumnResizeMode>("onChange")
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    const columns: ColumnDef<ProductGet>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Seleccionar todo"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Seleccionar fila"
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40,
        },
        {
            accessorKey: "descripcion",
            header: "Producto",
            size: 250,
            cell: ({ row, getValue }) => (
                <div className="space-y-1">
                    <div className="font-medium text-gray-900 leading-tight">{getValue<string>()}</div>
                    <div className="text-xs text-gray-500 font-mono">
                        UPC: {row.original.codigo_upc}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "codigo_oem",
            header: "Cód. OEM",
            size: 100,
            cell: ({ getValue }) => (
                <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-center">
                    {getValue<string>()}
                </div>
            ),
        },
        {
            accessorKey: "marca",
            header: "Marca",
            size: 100,
            cell: ({ getValue }) => (
                <Badge variant="outline" className="font-medium">
                    {getValue<string>()}
                </Badge>
            ),
        },
        {
            accessorKey: "categoria",
            header: "Categoría",
            size: 120,
            cell: ({ row, getValue }) => (
                <div className="space-y-1">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{getValue<string>()}</Badge>
                    <div className="text-xs text-gray-500">{row.original.subcategoria}</div>
                </div>
            ),
        },
        {
            accessorKey: "modelo",
            header: "Modelo/Motor",
            size: 140,
            cell: ({ row, getValue }) => (
                <div className="space-y-1">
                    <div className="text-sm font-medium">{getValue<string>() || "Universal"}</div>
                    <div className="text-xs text-gray-500 font-mono">{row.original.nro_motor}</div>
                </div>
            ),
        },
        {
            accessorKey: "stock_actual",
            header: "Stock Actual",
            size: 110,
            cell: ({ row, getValue }) => {
                const stock = getValue<string>();
                return (
                    <div
                        className={`flex items-center gap-2 px-2 py-1 rounded-md ${getStockColor(stock)}`}
                    >
                        {getStockIcon(stock)}
                        <span className="font-medium">{Number.parseFloat(stock).toFixed(0)}</span>
                        <span className="text-xs">{row.original.unidad_medida}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "stock_resto",
            header: "Stock Resto",
            size: 100,
            cell: ({ getValue }) => (
                <div className="text-center">
                    <div className="text-sm font-medium">{Number.parseFloat(getValue<string>()).toFixed(0)}</div>
                    <div className="text-xs text-gray-500">disponible</div>
                </div>
            ),
        },
        {
            accessorKey: "pedido_transito",
            header: "En Tránsito",
            size: 100,
            cell: ({ getValue }) => {
                const value = Number.parseInt(getValue<string>());
                return (
                    <div className="text-center">
                        <div className={`text-sm font-medium ${value > 0 ? "text-blue-600" : "text-gray-400"}`}>
                            {getValue<string>()}
                        </div>
                        <div className="text-xs text-gray-500">pedidos</div>
                    </div>
                );
            },
        },
        {
            accessorKey: "pedido_almacen",
            header: "En Almacén",
            size: 100,
            cell: ({ getValue }) => (
                <div className="text-center">
                    <div className="text-sm font-medium text-green-600">{getValue<string>()}</div>
                    <div className="text-xs text-gray-500">reservado</div>
                </div>
            ),
        },
        {
            accessorKey: "precio_venta",
            header: "Precio Venta",
            size: 120,
            cell: ({ row, getValue }) => {
                const precio = Number.parseFloat(getValue<string>());
                const precioAlt = Number.parseFloat(row.original.precio_venta_alt);
                const descuento = (((precio - precioAlt) / precio) * 100).toFixed(0);

                return (
                    <div className="space-y-1">
                        <div className="font-bold text-green-600">${precio.toFixed(2)}</div>
                        {/* {precioAlt < precio && ( */}
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 line-through">${precioAlt.toFixed(2)}</span>
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
            accessorKey: "procedencia",
            header: "Origen",
            size: 100,
            cell: ({ getValue }) => {
                const origen = getValue<string>();
                const colorMap: Record<string, string> = {
                    Japón: "bg-red-100 text-red-800",
                    USA: "bg-blue-100 text-blue-800",
                    Alemania: "bg-yellow-100 text-yellow-800",
                    China: "bg-red-100 text-red-800",
                };

                return <Badge className={colorMap[origen] || "bg-gray-100 text-gray-800"}>{origen}</Badge>;
            },
        },
        {
            accessorKey: "sucursal",
            header: "Sucursal",
            size: 100,
            cell: ({ getValue }) => (
                <div className="text-center">
                    <Badge variant="secondary">{getValue<string>()}</Badge>
                </div>
            ),
        },
    ];

    const [columnVisibility, setColumnVisibility] = useState({})

    const [viewMode, setViewMode] = useState<"list" | "grid">("list")
    const [selectedProducts, setSelectedProducts] = useState<number[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("default")
    const [showFilter, setShowFilter] = useState("all-products")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [priceFilter, setPriceFilter] = useState("all")
    const [storeFilter, setStoreFilter] = useState("all");

    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        if (!data?.data) return []
        const filtered = data.data.filter((product: ProductGet) => {
            const matchesSearch =
                product.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.codigo_oem.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesCategory = categoryFilter === "all" || product.categoria === categoryFilter
            const matchesStore = storeFilter === "all" || product.sucursal === storeFilter

            let matchesPrice = true
            if (priceFilter === "50-100") {
                matchesPrice = Number(product.precio_venta) >= 50 && Number(product.precio_venta) <= 100
            } else if (priceFilter === "100-200") {
                matchesPrice = Number(product.precio_venta) >= 100 && Number(product.precio_venta) <= 200
            } else if (priceFilter === "200-500") {
                matchesPrice = Number(product.precio_venta) >= 200 && Number(product.precio_venta) <= 500
            }

            return matchesSearch && matchesCategory && matchesStore && matchesPrice
        })

        // Sort products - prioritize column sorting over dropdown sorting
        if (sortColumn) {
            filtered.sort((a: ProductGet, b: ProductGet) => {
                let aValue: any = a[sortColumn as keyof ProductGet]
                let bValue: any = b[sortColumn as keyof ProductGet]

                if (sortColumn === "name") {
                    aValue = a.descripcion.toLowerCase()
                    bValue = b.descripcion.toLowerCase()
                }

                if (typeof aValue === "string" && typeof bValue === "string") {
                    return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
                }

                if (typeof aValue === "number" && typeof bValue === "number") {
                    return sortDirection === "asc" ? aValue - bValue : bValue - aValue
                }

                return 0
            })
        } else if (sortBy !== "default") {
            // Fallback to dropdown sorting
            // if (sortBy === "name") {
            //   filtered.sort((a, b) => a.name.localeCompare(b.name))
            // } else if (sortBy === "price") {
            //   filtered.sort((a, b) => b.price - a.price)
            // } else if (sortBy === "views") {
            //   filtered.sort((a, b) => b.views - a.views)
            // } else if (sortBy === "products") {
            //   filtered.sort((a, b) => b.products - a.products)
            // }
        }

        return filtered
    }, [
        data?.data,
        searchQuery,
        sortBy,
        showFilter,
        categoryFilter,
        statusFilter,
        priceFilter,
        storeFilter,
        sortColumn,
        sortDirection,
    ])
    const table = useReactTable({
        data: filteredAndSortedProducts,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
        state: {
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
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

    const handleStatusChange = (productId: number, newStatus: "Active" | "Inactive") => {
        // setProducts(products.map((product:ProductGet) => (product.id === productId ? { ...product, status: newStatus } : product)))
    }

    const handleDeleteProduct = (productId: number) => {
        // setProducts(products.filter((product) => product.id !== productId))
        // setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    }

    const handleAddProduct = () => {
        // const product: ProductGet = {
        //   // id: Math.max(...products.map((p) => p.id)) + 1,
        //   descripcion: newProduct.name,
        //   codigo_oem: newProduct.sku,
        //   codigo_upc: newProduct.price,
        //   modelo: newProduct.products,
        //   categoria: newProduct.category,
        //   sucursal: newProduct.store,
        // }

        // // setProducts([...products, product])
        // setNewProductFiltered({
        //   name: "",
        //   sku: "",
        //   price: "",
        //   products: "",
        //   categoria: "Jackets",
        //   sucursal: "Store 1",
        //   status: "Active",
        // })
        // setIsAddProductOpen(false)
    }

    const handleColumnSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
        // Clear dropdown sorting when using column sorting
        setSortBy("default")
    }

    const resetFilters = () => {
        setCategoryFilter("all")
        setStatusFilter("all")
        setPriceFilter("all")
        setStoreFilter("all")
        setSearchQuery("")
        setSortBy("default")
        setShowFilter("all-products")
    }

    const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
        <TableHead className="cursor-pointer hover:bg-gray-50 select-none border-b border-gray-200" onClick={() => handleColumnSort(column)}>
            <div className="flex items-center gap-2">
                {children}
                <div className="flex flex-col">
                    <ChevronUp
                        className={`h-3 w-3 ${sortColumn === column && sortDirection === "asc" ? "text-blue-600" : "text-gray-300"
                            }`}
                    />
                    <ChevronDown
                        className={`h-3 w-3 -mt-1 ${sortColumn === column && sortDirection === "desc" ? "text-blue-600" : "text-gray-300"
                            }`}
                    />
                </div>
            </div>
        </TableHead>
    )

    return (
        <div className="min-h-screen">
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
                                    placeholder="Search customer..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-64 text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <FilterActives showFilter={showFilter} setShowFilter={setShowFilter} />
                            <FilterSort sortBy={sortBy} setSortBy={setSortBy} />

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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ver categorias</label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border border-gray-200 shadow-lg">
                                    <SelectItem className="hover:bg-gray-50" value="all">Todas</SelectItem>
                                    {/* <SelectItem className="hover:bg-gray-50" value="Jackets">
                        Jackets ({products.filter((p) => p.category === "Jackets").length})
                    </SelectItem> */}
                                    <SelectItem className="hover:bg-gray-50" value="AMORTIGUADOR">AMORTIGUADOR</SelectItem>
                                    {/* <SelectItem className="hover:bg-gray-50" value="Pants">Pants</SelectItem> */}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ver modelo</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border border-gray-200 shadow-lg">
                                    {/* <SelectItem className="hover:bg-gray-50" value="all">Todos</SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="Active">Active</SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="Inactive">Inactive</SelectItem> */}
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
                {/* <div className="p-4 text-sm text-gray-600 border-b border-gray-200">
            Showing {filteredAndSortedProducts.length} of {products.length} products
            {selectedProducts.length > 0 && (
                <span className="ml-4 text-blue-600">{selectedProducts.length} selected</span>
            )}
            </div> */}

                {viewMode === "list" ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12 border-b border-gray-200 p-2">
                                        <Checkbox
                                            checked={
                                                selectedProducts.length === filteredAndSortedProducts.length &&
                                                filteredAndSortedProducts.length > 0
                                            }
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <SortableHeader column="name">Product Name</SortableHeader>
                                    <SortableHeader column="price">Purchase Unit Price</SortableHeader>
                                    <SortableHeader column="products">Products</SortableHeader>
                                    <SortableHeader column="views">Views</SortableHeader>
                                    <SortableHeader column="status">Status</SortableHeader>
                                    <TableHead className="border-b border-gray-200">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-200  p-2">
                                {filteredAndSortedProducts.map((product: ProductGet) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="p-1">
                                            <Checkbox
                                                className="border border-gray-400"
                                                checked={selectedProducts.includes(product.id)}
                                                onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                                            />
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <div className="flex items-center gap-1">
                                                <div>
                                                    <div className="font-medium">{product.descripcion}</div>
                                                    <div className="text-sm text-gray-500">SKU: {product.codigo_upc}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-1">${product.precio_venta}</TableCell>
                                        <TableCell className="p-1">{product.categoria.toLocaleString()}</TableCell>
                                        <TableCell className="p-1">{product.marca.toLocaleString()}</TableCell>
                                        <TableCell className="w-32 p-1">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={product.codigo_oem === "Active" ? "text-green-600" : "text-red-600"}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`w-2 h-2 rounded-full ${product.codigo_oem === "Active" ? "bg-green-500" : "bg-red-500"}`}
                                                            ></div>
                                                            {product.codigo_oem}
                                                            <ChevronDown className="h-3 w-3" />
                                                        </div>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="border border-gray-200">
                                                    <DropdownMenuItem onClick={() => handleStatusChange(product.id, "Active")}>
                                                        Active
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(product.id, "Inactive")}>
                                                        Inactive
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 bg-transparent">
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 border-red-600 bg-transparent"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredAndSortedProducts.map((product: any) => (
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
                                            onClick={() => handleDeleteProduct(product.id)}
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
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                            1
                        </Button>
                        <Button variant="outline" size="sm">
                            2
                        </Button>
                        <Button variant="default" size="sm">
                            3
                        </Button>
                        <Button variant="outline" size="sm">
                            4
                        </Button>
                        <Button variant="outline" size="sm">
                            5
                        </Button>
                        <Button variant="outline" size="sm">
                            6
                        </Button>
                        <span className="text-gray-500">...</span>
                        <Button variant="outline" size="sm">
                            24
                        </Button>
                        <Button variant="outline" size="sm">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <ProductListTable
                table={table}
            />

        </div>
    )
}

export default ProductListScreen
