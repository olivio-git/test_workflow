import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { Button } from "@/components/atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Input } from "@/components/atoms/input";
import { Checkbox } from "@/components/atoms/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { FilterActives } from "../components/FilterActives";
import { FilterSort } from "../components/FilterSort";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts } from "../services/api";
import type { ProductGet } from "../types/ProductGet";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const TableCreateProduct = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showFilter, setShowFilter] = useState("all-products");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");

  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];
    const filtered = products.filter((product: ProductGet) => {
      const matchesSearch =
        product.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.codigo_oem.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.categoria === categoryFilter;
      const matchesStore =
        storeFilter === "all" || product.sucursal === storeFilter;

      let matchesPrice = true;
      if (priceFilter === "50-100") {
        matchesPrice =
          Number(product.precio_venta) >= 50 &&
          Number(product.precio_venta) <= 100;
      } else if (priceFilter === "100-200") {
        matchesPrice =
          Number(product.precio_venta) >= 100 &&
          Number(product.precio_venta) <= 200;
      } else if (priceFilter === "200-500") {
        matchesPrice =
          Number(product.precio_venta) >= 200 &&
          Number(product.precio_venta) <= 500;
      }

      return matchesSearch && matchesCategory && matchesStore && matchesPrice;
    });

    // Sort products - prioritize column sorting over dropdown sorting
    if (sortColumn) {
      filtered.sort((a: ProductGet, b: ProductGet) => {
        let aValue: any = a[sortColumn as keyof ProductGet];
        let bValue: any = b[sortColumn as keyof ProductGet];

        if (sortColumn === "name") {
          aValue = a.descripcion.toLowerCase();
          bValue = b.descripcion.toLowerCase();
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
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

    return filtered;
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
  ]); 

  const handleDeleteProduct = (productId: number) => {
    // setProducts(products.filter((product) => product.id !== productId))
    // setSelectedProducts(selectedProducts.filter((id) => id !== productId))
  }; 

  const handleColumnSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    // Clear dropdown sorting when using column sorting
    setSortBy("default");
  };

  const resetFilters = () => {
    setCategoryFilter("all");
    setStatusFilter("all");
    setPriceFilter("all");
    setStoreFilter("all");
    setSearchQuery("");
    setSortBy("default");
    setShowFilter("all-products");
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: string;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-gray-50 select-none border-b border-gray-200"
      onClick={() => handleColumnSort(column)}
    >
      <div className="flex items-center gap-2">
        {children}
        <div className="flex flex-col">
          <ChevronUp
            className={`h-3 w-3 ${
              sortColumn === column && sortDirection === "asc"
                ? "text-blue-600"
                : "text-gray-300"
            }`}
          />
          <ChevronDown
            className={`h-3 w-3 -mt-1 ${
              sortColumn === column && sortDirection === "desc"
                ? "text-blue-600"
                : "text-gray-300"
            }`}
          />
        </div>
      </div>
    </TableHead>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow> 
          <SortableHeader column="name">Descripcion</SortableHeader>
          <SortableHeader column="price">Modelo</SortableHeader>
          <SortableHeader column="products">P.Venta</SortableHeader>
          <SortableHeader column="views">Marca</SortableHeader>
          <SortableHeader column="status">Cantegoria</SortableHeader>
          <TableHead className="border-b border-gray-200">Accion</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-gray-200  p-2">
        {products && products.map((product: ProductGet) => (
          <TableRow key={product.id}> 
            <TableCell className="p-1">
              <div className="flex items-center gap-1">
                <div>
                  <div className="text-sm">{product.descripcion}</div>
                  <div className="text-sm text-gray-500">
                    UPC: {product.codigo_upc}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="p-1">{product.modelo || <span className="text-gray-500">N/A</span>}</TableCell>
            <TableCell className="p-1">
              {product.precio_venta.toLocaleString()}
            </TableCell>
            <TableCell className="p-1">
              {product.marca.toLocaleString()}
            </TableCell>
            <TableCell className="w-32 p-1">
              {product.categoria || <span className="text-gray-500">N/A</span> }
            </TableCell>
            <TableCell className="p-1">
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-white bg-black border-red-600"
                >
                  <Edit className="h-4 w-4 mr-1" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-white bg-black border-red-600"
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
  );
};

export default TableCreateProduct;
