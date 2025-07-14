import { useState, useRef, useEffect, useCallback } from "react";
// import { Edit, Trash2 } from "lucide-react";
// import { Button } from "@/components/atoms/button";
import { useQuery } from "@tanstack/react-query";
import { apiConstructor } from "../services/api";
import type { ProductGet } from "../types/ProductGet";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import CustomizableTable from "@/components/common/CustomizableTable";

const TableCreateProduct = () => {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductGet[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const pageSize = 20;

  const {
    data: products,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: () =>
      apiConstructor({
        url: `/products?pagina=${page}&pagina_registros=${pageSize}&sucursal=1`,
        method: "GET",
      }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (products) {
      setAllProducts((prev) => [...prev, ...products]);
    }
  }, [products]);

  // const handleDeleteProduct = (productId: number) => {
  //   console.log(productId);
  // };

  const handleScroll = useCallback(() => {
    if (
      tableContainerRef.current &&
      !isLoading &&
      !isFetching &&
      tableContainerRef.current.scrollHeight -
        tableContainerRef.current.scrollTop <=
        tableContainerRef.current.clientHeight + 100
    ) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, isFetching]);

  useEffect(() => {
    const tableRef = tableContainerRef.current;
    if (tableRef) {
      tableRef.addEventListener("scroll", handleScroll);
      return () => tableRef.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Definir las columnas para TanStack Table
  const columns: ColumnDef<ProductGet>[] = [
    {
      accessorKey: "descripcion",
      header: "Descripción",
      size: 300,
      minSize: 250,
      cell: ({ row, getValue }) => (
        <div className="flex items-center gap-1">
          <div>
            <div className="text-sm">{getValue<string>()}</div>
            <div className="text-sm text-gray-500">
              UPC: {row.original.codigo_upc}
            </div>
          </div>
        </div>
      ),
    },
    // {
    //   accessorKey: "modelo",
    //   header: "Modelo",
    //   size: 120,
    //   minSize: 100,
    //   cell: ({ getValue }) => (
    //     <div>
    //       {getValue<string>() || <span className="text-gray-500">N/A</span>}
    //     </div>
    //   ),
    // },
    {
      accessorKey: "precio_venta",
      header: "P.Venta",
      size: 120,
      minSize: 100,
      cell: ({ row,getValue }) => (
        <div className="space-y-1">
          <div className="font-bold text-green-600">
            ${Number(getValue<number>()).toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <span className=" text-gray-500">
              Alt: ${Number(row.original.precio_venta_alt).toLocaleString()}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "marca",
      header: "Marca",
      size: 120,
      minSize: 100,
      cell: ({ getValue }) => <div>{getValue<string>()}</div>,
    },
    {
      accessorKey: "categoria",
      header: "Categoría",
      size: 120,
      minSize: 100,
      cell: ({ getValue }) => (
        <div>
          {getValue<string>() || <span className="text-gray-500">N/A</span>}
        </div>
      ),
    },
    // {
    //   id: "actions",
    //   header: "Acción",
    //   size: 120,
    //   minSize: 120,
    //   enableSorting: false,
    //   cell: ({ row }) => (
    //     <div className="flex items-center gap-2">
    //       <Button
    //         variant="destructive"
    //         size="sm"
    //         className="text-white bg-black border-red-600"
    //       >
    //         <Edit className="h-4 w-4 mr-1" />
    //       </Button>
    //       <Button
    //         variant="destructive"
    //         size="sm"
    //         className="text-white bg-black border-red-600"
    //         onClick={() => handleDeleteProduct(row.original.id)}
    //       >
    //         <Trash2 className="h-4 w-4" />
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  const table = useReactTable<ProductGet>({
    data: allProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    enableColumnResizing: true,
  });

  return (
    <div
      ref={tableContainerRef}
      className="h-full overflow-y-auto border border-gray-200 rounded-md"
    >
      <CustomizableTable table={table} />

      {(isLoading || isFetching) && (
        <div className="text-center py-4 border-t border-gray-200">
          Cargando más datos...
        </div>
      )}
    </div>
  );
};

export default TableCreateProduct;
