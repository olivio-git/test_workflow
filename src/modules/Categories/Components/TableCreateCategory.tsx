import { useState, useRef, useEffect, useCallback } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { Button } from "@/components/atoms/button";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "../Types/CateforiaGet";
import { getCategories } from "../Services/categories";

const TableCreateCategory = () => {
  const [page, setPage] = useState(1);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const pageSize = 20;

  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["categories", page],
    queryFn: () => getCategories(page, pageSize),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (response) {
      const newCategories = Array.isArray(response) ? response : [response];

      if (newCategories.length === 0) {
        setHasMore(false); // evita seguir paginando
        return;
      }

      setAllCategories((prev) => {
        const existingIds = new Set(prev.map((cat) => cat.id));
        const uniqueNew = newCategories.filter(
          (cat) => !existingIds.has(cat.id)
        );
        return [...prev, ...uniqueNew];
      });
    }
  }, [response]);

  const handleScroll = useCallback(() => {
    const container = tableContainerRef.current;
    if (
      container &&
      hasMore &&
      !isLoading &&
      !isFetching &&
      container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100
    ) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isLoading, isFetching]);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleDelete = (id: number) => {
    console.log("🗑️ Eliminar categoría ID:", id);
  };

  return (
    <div
      ref={tableContainerRef}
      className="overflow-y-auto border border-gray-200 rounded-md"
    >
      <Table className="min-w-full">
        <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
          <TableRow className="text-sm text-gray-700">
            <TableHead>Categoría</TableHead>
            <TableHead>Subcategorías</TableHead>
            <TableHead className="w-24">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200">
          {allCategories.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={3} className="py-4 text-center text-gray-500">
                No se encontraron categorías.
              </TableCell>
            </TableRow>
          )}
          {allCategories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell className="font-medium">{cat.categoria}</TableCell>
              <TableCell>
                {cat.subcategorias.length > 0 ? (
                  <ul className="pl-4 text-sm text-gray-700 list-disc">
                    {cat.subcategorias.map((sub) => (
                      <li key={sub.id}>{sub.subcategoria}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-sm italic text-gray-400">
                    Sin subcategorías
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="text-white bg-black"
                    onClick={() => console.log("✏️ Editar", cat.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {(isLoading || isFetching) && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="py-4 text-sm text-center text-gray-500"
              >
                Cargando más datos...
              </TableCell>
            </TableRow>
          )}
          {!hasMore && allCategories.length > 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="py-4 italic text-center text-gray-400"
              >
                No hay más categorías para mostrar.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableCreateCategory;
