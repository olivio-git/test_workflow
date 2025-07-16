import { useState, useRef, useEffect, useCallback } from "react";
import { Edit, Trash2, Plus, Search, MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "../Types/CateforiaGet";
import { getCategories } from "../Services/categories";

const TableCreateCategory = () => {
  const [page, setPage] = useState(1);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const pageSize = 20;

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["categories", page],
    queryFn: () => getCategories(page, pageSize),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Manejo de datos y paginación
  useEffect(() => {
    if (response) {
      // Ajusta según la estructura de tu respuesta API
      const newCategories = Array.isArray(response) 
        ? response 
        : response.data || response.categories || [response];

      if (newCategories.length === 0) {
        setHasMore(false);
        return;
      }

      // Si es la primera página, resetea las categorías
      if (page === 1) {
        setAllCategories(newCategories);
      } else {
        // Para páginas siguientes, agrega solo las nuevas
        setAllCategories((prev) => {
          const existingIds = new Set(prev.map((cat) => cat.id));
          const uniqueNew = newCategories.filter(
            (cat) => !existingIds.has(cat.id)
          );
          return [...prev, ...uniqueNew];
        });
      }

      // Si recibimos menos elementos que el pageSize, no hay más páginas
      if (newCategories.length < pageSize) {
        setHasMore(false);
      }
    }
  }, [response, page, pageSize]);

  // Filtrado en tiempo real
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(allCategories);
      return;
    }

    const filtered = allCategories.filter((category) =>
      category.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.subcategorias.some((sub) =>
        sub.subcategoria.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredCategories(filtered);
  }, [searchTerm, allCategories]);

  // Scroll infinito optimizado
  const handleScroll = useCallback(() => {
    const container = tableContainerRef.current;
    if (
      container &&
      hasMore &&
      !isLoading &&
      !isFetching &&
      !searchTerm && // No paginar mientras se busca
      container.scrollHeight - container.scrollTop <=
        container.clientHeight + 50
    ) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isLoading, isFetching, searchTerm]);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Manejo de errores
  useEffect(() => {
    if (error) {
      toast({
        title: "Error al cargar categorías",
        description: "Hubo un problema al obtener los datos. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleDelete = async (id: number) => {
    if (isDeleting) return;

    try {
      setIsDeleting(id);
      
      // Aquí implementa tu función de eliminación
      // await deleteCategory(id);
      
      // Actualizar estado local optimisticamente
      setAllCategories((prev) => prev.filter((cat) => cat.id !== id));
      
      // Invalidar y refetch las categorías
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada exitosamente.",
      });
    } catch (error) {
      // Revertir el cambio optimista en caso de error
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la categoría. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddSubcategory = (categoryId: number) => {
    console.log("➕ Agregar subcategoría a:", categoryId);
    // Aquí puedes abrir un modal para agregar subcategoría
  };

  // Función para refrescar datos
  const refreshCategories = useCallback(() => {
    setPage(1);
    setAllCategories([]);
    setHasMore(true);
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }, [queryClient]);

  // Función para manejar cambios en el formulario padre
  const handleCategoryCreated = useCallback(() => {
    refreshCategories();
  }, [refreshCategories]);

  const handleEdit = (category: Category) => {
    console.log("✏️ Editar categoría:", category);
    // Aquí puedes abrir un modal o navegar a la página de edición
  };

  const getTotalSubcategories = () => {
    return allCategories.reduce((total, cat) => total + cat.subcategorias.length, 0);
  };

  const displayCategories = searchTerm ? filteredCategories : allCategories;

  return (
    <div className="space-y-4">
      {/* Header con estadísticas y búsqueda */}
      <div className="flex flex-col gap-4 p-4 bg-white border border-gray-200 rounded-lg sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{allCategories.length}</span> categorías
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{getTotalSubcategories()}</span> subcategorías
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <Input
              placeholder="Buscar categorías o subcategorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10"
            />
          </div>
        </div>
      </div>

      {/* Tabla con scroll optimizado */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
        <div
          ref={tableContainerRef}
          className="overflow-y-auto max-h-[600px]"
          style={{ scrollBehavior: 'smooth' }}
        >
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 z-10 shadow-sm bg-gray-50">
              <TableRow className="text-sm text-gray-700">
                <TableHead className="font-semibold">Categoría</TableHead>
                <TableHead className="font-semibold">Subcategorías</TableHead>
                <TableHead className="w-32 font-semibold text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {/* Estado vacío */}
              {displayCategories.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={3} className="py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm ? (
                        <>
                          <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p>No se encontraron resultados para "{searchTerm}"</p>
                        </>
                      ) : (
                        <>
                          <p>No hay categorías registradas</p>
                          <p className="mt-1 text-sm text-gray-400">
                            Crea tu primera categoría para comenzar
                          </p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Contenido de la tabla */}
              {displayCategories.map((category) => (
                <TableRow 
                  key={category.id} 
                  className="transition-colors hover:bg-gray-50"
                >
                  <TableCell className="py-4 font-medium text-gray-900">
                    {category.categoria}
                  </TableCell>
                  <TableCell className="py-4">
                    {category.subcategorias.length > 0 ? (
                      <div className="space-y-1">
                        {category.subcategorias.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between group"
                          >
                            <span className="py-1 text-sm text-gray-700">
                              • {sub.subcategoria}
                            </span>
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddSubcategory(category.id)}
                          className="h-6 mt-2 text-xs text-gray-600 hover:text-gray-900"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Agregar subcategoría
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-sm italic text-gray-400">
                          Sin subcategorías
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddSubcategory(category.id)}
                          className="block h-6 text-xs text-gray-600 hover:text-gray-900"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Agregar subcategoría
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(category)}
                        className="w-8 h-8 p-0 hover:bg-gray-100"
                        title="Editar categoría"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting === category.id}
                        className="w-8 h-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        title="Eliminar categoría"
                      >
                        {isDeleting === category.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 rounded-full border-t-transparent animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {/* Indicador de carga */}
              {(isLoading || isFetching) && !searchTerm && (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-gray-600 animate-spin" />
                      Cargando más categorías...
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Fin de resultados */}
              {!hasMore && allCategories.length > 0 && !searchTerm && (
                <TableRow>
                  <TableCell colSpan={3} className="py-6 text-sm text-center text-gray-400">
                    <div className="pt-4 border-t border-gray-100">
                      Has visto todas las categorías disponibles
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer con información de resultados */}
      {searchTerm && (
        <div className="py-2 text-sm text-center text-gray-600">
          Mostrando {filteredCategories.length} de {allCategories.length} categorías
        </div>
      )}
    </div>
  );
};

export default TableCreateCategory;