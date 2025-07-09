import React, { useState, useRef, useEffect, useCallback } from "react";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { Button } from "@/components/atoms/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts } from "../services/api";
import type { ProductGet } from "../types/ProductGet";

const TableCreateProduct = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductGet[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const pageSize = 20; // Ajusta según necesites

  const {
    data: products,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page, pageSize),
    staleTime: 5 * 60 * 1000, 
  });

  useEffect(() => {
    if (products) {
      setAllProducts(prev => [...prev, ...products]);
    }
  }, [products]);

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleDeleteProduct = (productId: number) => {
    console.log(productId);
  };

  const handleColumnSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleScroll = useCallback(() => {
    if (
      tableContainerRef.current &&
      !isLoading &&
      !isFetching &&
      tableContainerRef.current.scrollHeight - tableContainerRef.current.scrollTop <=
        tableContainerRef.current.clientHeight + 100
    ) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, isFetching]);

  useEffect(() => {
    const tableRef = tableContainerRef.current;
    if (tableRef) {
      tableRef.addEventListener("scroll", handleScroll);
      return () => tableRef.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);
  
  return (
    <div 
      ref={tableContainerRef}
      className="h-[80vh] overflow-y-auto border border-gray-200 rounded-md"
    >
      <Table className="min-w-full">
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow className="text-sm text-gray-600">
            <TableHead className="border-b border-gray-200">
              Descripcion
            </TableHead>
            <TableHead className="border-b border-gray-200">Modelo</TableHead>
            <TableHead className="border-b border-gray-200">P.Venta</TableHead>
            <TableHead className="border-b border-gray-200">Marca</TableHead>
            <TableHead className="border-b border-gray-200">Cantegoria</TableHead>
            <TableHead className="border-b border-gray-200">Accion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200">
          {allProducts.map((product: ProductGet) => (
            <TableRow key={`${product.id}-${Math.random()}`}>
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
              <TableCell className="p-1">
                {product.modelo || <span className="text-gray-500">N/A</span>}
              </TableCell>
              <TableCell className="p-1">
                {product.precio_venta.toLocaleString()}
              </TableCell>
              <TableCell className="p-1">
                {product.marca.toLocaleString()}
              </TableCell>
              <TableCell className="w-32 p-1">
                {product.categoria || (
                  <span className="text-gray-500">N/A</span>
                )}
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
          {(isLoading || isFetching) && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Cargando más datos...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableCreateProduct;