import { useState, useRef, useEffect, useCallback } from "react";
import { Edit, Trash2, Plus, Search, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getCategories } from "../services/categories";
import type { Category } from "../types/Category";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/atoms/accordion";
import { Badge } from "@/components/atoms/badge";

const TableCreateCategory = () => {
  const [page, setPage] = useState(1);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const pageSize = 999;
  const [addingSubId, setAddingSubId] = useState<number | null>(null);
  const [newSubName, setNewSubName] = useState("");

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["categories", page],
    queryFn: () => getCategories(page, pageSize),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (response) {
      const newCategories = Array.isArray(response)
        ? response
        : response.data || response.categories || [response];

      if (newCategories.length === 0) {
        setHasMore(false);
        return;
      }

      if (page === 1) {
        setAllCategories(newCategories);
      } else {
        setAllCategories((prev) => {
          const existingIds = new Set(prev.map((cat) => cat.id));
          const uniqueNew = newCategories.filter(
            (cat: any) => !existingIds.has(cat.id)
          );
          return [...prev, ...uniqueNew];
        });
      }

      if (newCategories.length < pageSize) {
        setHasMore(false);
      }
    }
  }, [response, page, pageSize]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(allCategories);
      return;
    }

    const filtered = allCategories.filter(
      (category) =>
        category.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.subcategorias.some((sub) =>
          sub.subcategoria.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredCategories(filtered);
  }, [searchTerm, allCategories]);

  const handleScroll = useCallback(() => {
    const container = tableContainerRef.current;
    if (
      container &&
      hasMore &&
      !isLoading &&
      !isFetching &&
      !searchTerm &&
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

  useEffect(() => {
    if (error) {
      toast({
        title: "Error al cargar categorías",
        description:
          "Hubo un problema al obtener los datos. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleDelete = async (id: number) => {
    if (isDeleting) return;

    try {
      setIsDeleting(id);
      setAllCategories((prev) => prev.filter((cat) => cat.id !== id));
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada exitosamente.",
      });
    } catch (error) {
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
    setAddingSubId(categoryId);
    setNewSubName("");
  };

  const refreshCategories = useCallback(async () => {
    setIsRefreshing(true);
    try {
      setPage(1);
      setAllCategories([]);
      setHasMore(true);
      setSearchTerm("");
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      
      toast({
        title: "Datos actualizados",
        description: "Las categorías han sido actualizadas exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: "No se pudieron actualizar los datos. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, toast]);

  const handleCategoryCreated = useCallback(() => {
    refreshCategories();
  }, [refreshCategories]);

  const handleEdit = (category: Category) => {
    console.log("✏️ Editar categoría:", category);
  };

  const getTotalSubcategories = () => {
    return allCategories.reduce(
      (total, cat) => total + cat.subcategorias.length,
      0
    );
  };

  const handleSubmitSubcategory = async () => {
    if (!newSubName.trim() || addingSubId === null) return;

    await handleAddSubcategory(addingSubId);
    setAddingSubId(null);
    setNewSubName("");
  };

  const displayCategories = searchTerm ? filteredCategories : allCategories;

  return (
    <div className="space-y-3">
      {/* Encabezado compacto */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-white border border-gray-200 rounded-lg">
        <div className="flex gap-4 text-xs text-gray-500">
          <div><span className="font-medium text-gray-700">{allCategories.length}</span> categorías</div>
          <div><span className="font-medium text-gray-700">{getTotalSubcategories()}</span> subcategorías</div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-1/2 w-3.5 h-3.5 text-gray-400 -translate-y-1/2" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={refreshCategories}
            disabled={isRefreshing || isLoading}
            className="h-8 px-2.5"
            title="Actualizar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Listado como acordeones */}
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        <Accordion type="single" collapsible>
          {displayCategories.map((cat) => (
            <AccordionItem
              key={cat.id}
              value={`cat-${cat.id}`}
              className="group border-gray-200"
            >
              <AccordionTrigger className="flex justify-between items-center p-3 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs">{cat.categoria}</span>
                  {cat.subcategorias.length > 0 && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      {cat.subcategorias.length}
                    </Badge>
                  )}
                </div>
                {/* <ChevronDown className="w-4 h-4 text-gray-400 group-data-[state=open]:rotate-180 transition-transform" /> */}
              </AccordionTrigger>
              <AccordionContent className="p-3 pt-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  {cat.subcategorias.map((sub) => (
                    <Badge 
                      key={sub.id} 
                      variant="outline" 
                      className="text-xs font-normal text-gray-600 bg-gray-50"
                    >
                      {sub.subcategoria}
                    </Badge>
                  ))}
                </div>
                
                {addingSubId === cat.id ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      placeholder="Nueva subcategoría"
                      className="h-8 text-xs flex-1"
                    />
                    <Button size="sm" onClick={handleSubmitSubcategory} className="h-8 px-2 text-xs">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddSubcategory(cat.id)}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mt-1"
                  >
                    <Plus className="w-3 h-3" /> Agregar subcategoría
                  </button>
                )}
                
                <div className="flex justify-end gap-1 mt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(cat)}
                    className="h-7 w-7 p-0 hover:bg-gray-100"
                    title="Editar"
                  >
                    <Edit className="w-3.5 h-3.5 text-gray-500" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(cat.id)}
                    disabled={isDeleting === cat.id}
                    className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-500"
                    title="Eliminar"
                  >
                    {isDeleting === cat.id ? (
                      <span className="w-3 h-3 border-2 border-red-500 rounded-full border-t-transparent animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}

          {(!displayCategories.length && !isLoading) && (
            <div className="p-6 text-center text-gray-500 text-sm">
              {searchTerm ? (
                <>
                  <Search className="w-5 h-5 mx-auto mb-2 text-gray-300" />
                  No se encontraron resultados para «{searchTerm}»
                </>
              ) : (
                <p>No hay categorías registradas</p>
              )}
            </div>
          )}

          {(isLoading || isFetching) && !searchTerm && (
            <div className="p-4 text-center text-xs text-gray-500">
              <span className="inline-block w-3 h-3 border-2 border-gray-300 rounded-full border-t-gray-500 animate-spin mr-2" />
              Cargando...
            </div>
          )}
        </Accordion>
      </div>

      {searchTerm && (
        <p className="text-center text-xs text-gray-500">
          Mostrando {filteredCategories.length} de {allCategories.length} resultados
        </p>
      )}
    </div>
  );
};

export default TableCreateCategory;