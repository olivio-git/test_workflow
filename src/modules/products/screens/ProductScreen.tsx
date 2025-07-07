import React,{ useState, useMemo } from "react" 
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Grid3X3,
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react" 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/table"
import { Button } from "@/components/atoms/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { Input } from "@/components/atoms/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog"
import { Label } from "@/components/atoms/label"
import { Checkbox } from "@/components/atoms/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/atoms/dropdown-menu" 
import { ImageContainer, ImageContent } from "@/components/atoms/Image"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "../services/api"

interface Product {
  id: number
  name: string
  sku: string
  price: number
  products: number
  views: number
  status: "Active" | "Inactive"
  image: string
  category: string
  store: string
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Gabriela Cashmere Blazer",
    sku: "T14116",
    price: 113.99,
    products: 1113,
    views: 14012,
    status: "Active",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 1",
  },
  {
    id: 2,
    name: "Loewe blend Jacket - Blue",
    sku: "T14116",
    price: 113.99,
    products: 721,
    views: 13212,
    status: "Active",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 1",
  },
  {
    id: 3,
    name: "Sandro - Jacket - Black",
    sku: "T14116",
    price: 113.99,
    products: 407,
    views: 8201,
    status: "Active",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 2",
  },
  {
    id: 4,
    name: "Adidas By Stella McCartney",
    sku: "T14116",
    price: 113.99,
    products: 1203,
    views: 1002,
    status: "Active",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 1",
  },
  {
    id: 5,
    name: "Meteo Hooded Wool Jacket",
    sku: "T14116",
    price: 113.99,
    products: 306,
    views: 807,
    status: "Active",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 2",
  },
  {
    id: 6,
    name: "Hida Down Ski Jacket - Red",
    sku: "T14116",
    price: 113.99,
    products: 201,
    views: 406,
    status: "Inactive",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 1",
  },
  {
    id: 7,
    name: "Dolce & Gabbana",
    sku: "T14116",
    price: 113.99,
    products: 108,
    views: 204,
    status: "Active",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 2",
  },
  {
    id: 8,
    name: "Moncler - Down Jacket",
    sku: "T14116",
    price: 113.99,
    products: 55,
    views: 102,
    status: "Inactive",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 1",
  },
  {
    id: 9,
    name: "Balenciaga - Oversized Jacket",
    sku: "T14116",
    price: 113.99,
    products: 30,
    views: 60,
    status: "Active",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 2",
  },
  {
    id: 10,
    name: "Prada - Wool Blend Jacket",
    sku: "T14116",
    price: 113.99,
    products: 15,
    views: 30,
    status: "Inactive",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 1",
  },
  {
    id: 11,
    name: "Gucci - Leather Jacket",
    sku: "T14116",
    price: 113.99,
    products: 8,
    views: 16,
    status: "Active",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 2",
  },
  {
    id: 12,
    name: "Burberry - Trench Coat",
    sku: "T14116",
    price: 113.99,
    products: 4,
    views: 8,
    status: "Inactive",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 1",
  },
  {
    id: 13,
    name: "Versace - Printed Jacket",
    sku: "T14116",
    price: 113.99,
    products: 2,
    views: 4,
    status: "Active",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 2",
  },
  {
    id: 14,
    name: "Fendi - Logo Jacket",
    sku: "T14116",
    price: 113.99,
    products: 1,
    views: 2,
    status: "Inactive",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 1",
  },
  {
    id: 15,
    name: "Balmain - Military Jacket",
    sku: "T14116",
    price: 113.99,
    products: 0,
    views: 0,
    status: "Active",
    image: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
    category: "Jackets",
    store: "Store 2",
  },
]

const ProductScreen = () => {
  // const { data, isLoading, error } = useQuery<any>({
  //   queryKey: ['products'],
  //   queryFn: fetchProducts, 

  // });

  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [showFilter, setShowFilter] = useState("all-products")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [storeFilter, setStoreFilter] = useState("all")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    price: "",
    products: "",
    category: "Jackets",
    store: "Store 1",
    status: "Active" as "Active" | "Inactive",
  })

  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      const matchesStatus = statusFilter === "all" || product.status === statusFilter
      const matchesStore = storeFilter === "all" || product.store === storeFilter

      let matchesPrice = true
      if (priceFilter === "50-100") {
        matchesPrice = product.price >= 50 && product.price <= 100
      } else if (priceFilter === "100-200") {
        matchesPrice = product.price >= 100 && product.price <= 200
      } else if (priceFilter === "200-500") {
        matchesPrice = product.price >= 200 && product.price <= 500
      }

      const matchesShow =
        showFilter === "all-products" ||
        (showFilter === "active" && product.status === "Active") ||
        (showFilter === "inactive" && product.status === "Inactive")

      return matchesSearch && matchesCategory && matchesStatus && matchesStore && matchesPrice && matchesShow
    })

    // Sort products - prioritize column sorting over dropdown sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortColumn as keyof Product]
        let bValue: any = b[sortColumn as keyof Product]

        if (sortColumn === "name") {
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
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
      if (sortBy === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortBy === "price") {
        filtered.sort((a, b) => b.price - a.price)
      } else if (sortBy === "views") {
        filtered.sort((a, b) => b.views - a.views)
      } else if (sortBy === "products") {
        filtered.sort((a, b) => b.products - a.products)
      }
    }

    return filtered
  }, [
    products,
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredAndSortedProducts.map((p) => p.id))
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
    setProducts(products.map((product) => (product.id === productId ? { ...product, status: newStatus } : product)))
  }

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter((product) => product.id !== productId))
    setSelectedProducts(selectedProducts.filter((id) => id !== productId))
  }

  const handleAddProduct = () => {
    const product: Product = {
      id: Math.max(...products.map((p) => p.id)) + 1,
      name: newProduct.name,
      sku: newProduct.sku,
      price: Number.parseFloat(newProduct.price),
      products: Number.parseInt(newProduct.products),
      views: Math.floor(Math.random() * 10000),
      status: newProduct.status,
      image: "/placeholder.svg?height=40&width=40",
      category: newProduct.category,
      store: newProduct.store,
    }

    setProducts([...products, product])
    setNewProduct({
      name: "",
      sku: "",
      price: "",
      products: "",
      category: "Jackets",
      store: "Store 1",
      status: "Active",
    })
    setIsAddProductOpen(false)
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
            className={`h-3 w-3 ${
              sortColumn === column && sortDirection === "asc" ? "text-blue-600" : "text-gray-300"
            }`}
          />
          <ChevronDown
            className={`h-3 w-3 -mt-1 ${
              sortColumn === column && sortDirection === "desc" ? "text-blue-600" : "text-gray-300"
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
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show:</span>
                <Select value={showFilter} onValueChange={setShowFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200 shadow-lg">
                    <SelectItem className="hover:bg-gray-50" value="all-products">All Products</SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="active">Active</SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200 shadow-lg">
                    <SelectItem className="hover:bg-gray-50" value="default">Default</SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="name">Name</SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="price">Price</SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="views">Views</SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="products">Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="hover:bg-gray-50" size="sm" onClick={resetFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>

              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sku" className="text-right">
                        SKU
                      </Label>
                      <Input
                        id="sku"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="stock" className="text-right">
                        Stock
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.products}
                        onChange={(e) => setNewProduct({ ...newProduct, products: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Jackets">Jackets</SelectItem>
                          <SelectItem value="Shirts">Shirts</SelectItem>
                          <SelectItem value="Pants">Pants</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="store" className="text-right">
                        Store
                      </Label>
                      <Select
                        value={newProduct.store}
                        onValueChange={(value) => setNewProduct({ ...newProduct, store: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Store 1">Store 1</SelectItem>
                          <SelectItem value="Store 2">Store 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddProduct}
                      disabled={!newProduct.name || !newProduct.sku || !newProduct.price || !newProduct.products}
                    >
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 shadow-lg">
                  <SelectItem className="hover:bg-gray-50" value="all">All Categories</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="Jackets">
                    Jackets ({products.filter((p) => p.category === "Jackets").length})
                  </SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="Shirts">Shirts</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="Pants">Pants</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 shadow-lg">
                  <SelectItem className="hover:bg-gray-50" value="all">All Status</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="Active">Active</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 shadow-lg">
                  <SelectItem className="hover:bg-gray-50" value="all">All Prices</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="50-100">$50 - $100</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="100-200">$100 - $200</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="200-500">$200 - $500</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
              <Select value={storeFilter} onValueChange={setStoreFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 shadow-lg">
                  <SelectItem className="hover:bg-gray-50" value="all">All Store</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="Store 1">Store 1</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="Store 2">Store 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="p-4 text-sm text-gray-600 border-b border-gray-200">
          Showing {filteredAndSortedProducts.length} of {products.length} products
          {selectedProducts.length > 0 && (
            <span className="ml-4 text-blue-600">{selectedProducts.length} selected</span>
          )}
        </div>

        {/* Content */}
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
                {filteredAndSortedProducts.map((product) => (
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
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-1">${product.price}</TableCell>
                    <TableCell className="p-1">{product.products.toLocaleString()}</TableCell>
                    <TableCell className="p-1">{product.views.toLocaleString()}</TableCell>
                    <TableCell className="w-32 p-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={product.status === "Active" ? "text-green-600" : "text-red-600"}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${product.status === "Active" ? "bg-green-500" : "bg-red-500"}`}
                              ></div>
                              {product.status}
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
              {filteredAndSortedProducts.map((product) => (
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
    </div>
  )
}

export default ProductScreen