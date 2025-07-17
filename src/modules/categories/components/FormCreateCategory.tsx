import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Save, Edit, Trash2, Plus, Search, RefreshCw } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/atoms/accordion";
import { useToast } from "@/hooks/use-toast";
import { useInfiniteQuery, useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { apiConstructor } from "../services/api";

// Interfaces
interface Category {
  id: number;
  categoria: string;
  subcategorias: Array<{
    id: number;
    subcategoria: string;
  }>;
} 
// Hook personalizado para debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Simplificar para test inicial
const SIMPLE_MODE = false; // Cambiar a false para activar infinite scroll

// Servicios API
const categoriesService = {
  getCategories: async ({ pageParam = 1, categoria = "" }) => {
    // URL directa con percent-encoding para evitar problemas
    let url = `/categories?pagina=${pageParam}&pagina_registros=20`;
    
    if (categoria.trim()) {
      url += `&categoria=${encodeURIComponent(categoria.trim())}`;
    }

    console.log("🌐 URL de petición:", url);

    try {
      // Usar apiConstructor pero manejar la respuesta completa
      const response = await apiConstructor({
        url,
        method: "GET"
      });
      
      console.log("📦 Response del apiConstructor:", response);
      
      // Si apiConstructor ya devuelve solo los datos, reconstruir la estructura
      if (Array.isArray(response)) {
        // Si response es directamente el array de categorías
        return {
          data: response,
          meta: { total: response.length, current_page: pageParam, last_page: 1 }
        };
      }
      
      // Si response ya tiene la estructura completa
      if (response && response.data) {
        return response;
      }
      
      // Fallback
      return { data: [], meta: { total: 0, current_page: 1, last_page: 1 } };
      
    } catch (error) {
      console.error("❌ Error en getCategorias:", error);
      throw error;
    }
  },

  // Versión simple para test inicial
  getCategoriesSimple: async () => {
    try {
      const response = await apiConstructor({
        url: "/categories?pagina=1&pagina_registros=50",
        method: "GET"
      });
      
      console.log("📦 Simple Response del apiConstructor:", response);
      
      // Manejar diferentes estructuras de respuesta
      if (Array.isArray(response)) {
        return {
          data: response,
          meta: { total: response.length }
        };
      }
      
      return response;
    } catch (error) {
      console.error("❌ Error en getCategoriesSimple:", error);
      throw error;
    }
  },

  createCategory: async (categoria: string) => {
    return await apiConstructor({
      url: "/categories",
      method: "POST",
      data: { categoria }
    });
  },

  createSubcategory: async (data: { subcategoria: string; categoriaId: number }) => {
    return await apiConstructor({
      url: "/subcategories",
      method: "POST",
      data: {
        subcategoria: data.subcategoria,
        categoria_id: data.categoriaId
      }
    });
  },

  deleteCategory: async (id: number) => {
    return await apiConstructor({
      url: `/categories/${id}`,
      method: "DELETE"
    });
  },

  updateCategory: async (id: number, categoria: string) => {
    return await apiConstructor({
      url: `/categories/${id}`,
      method: "PUT",
      data: { categoria }
    });
  }
};

const FormCreateCategory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Estados para formularios
  const [newCategory, setNewCategory] = useState("");
  const [addingSubId, setAddingSubId] = useState<number | null>(null);
  const [newSubName, setNewSubName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Query simple para debug inicial
  const simpleQuery = useQuery({
    queryKey: ["categories-simple"],
    queryFn: categoriesService.getCategoriesSimple,
    enabled: SIMPLE_MODE,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Query para obtener categorías con infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch
  } = useInfiniteQuery({
    queryKey: ["categories", debouncedSearchTerm],
    queryFn: ({ pageParam }) => categoriesService.getCategories({ 
      pageParam, 
      categoria: debouncedSearchTerm 
    }),
    initialPageParam: 1,
    enabled: !SIMPLE_MODE, // Solo habilitar si no estamos en modo simple
    getNextPageParam: (lastPage: any) => {
      // Manejo seguro de la paginación Laravel
      if (lastPage && lastPage.meta) {
        const { current_page, last_page } = lastPage.meta;
        return current_page < last_page ? current_page + 1 : undefined;
      }
      // Si no hay meta, intentar con links.next
      if (lastPage && lastPage.links && lastPage.links.next) {
        // Extraer número de página de la URL
        const nextUrl = lastPage.links.next;
        const pageMatch = nextUrl.match(/[?&]pagina=(\d+)/);
        return pageMatch ? parseInt(pageMatch[1]) : undefined;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Mutation para crear categoría
  const createCategoryMutation = useMutation({
    mutationFn: categoriesService.createCategory,
    onSuccess: () => {
      setNewCategory("");
      // Invalidar ambas queries según el modo
      if (SIMPLE_MODE) {
        queryClient.invalidateQueries({ queryKey: ["categories-simple"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
      toast({
        title: "Categoría creada",
        description: `La categoría fue creada exitosamente.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear",
        description: error.message || "No se pudo crear la categoría.",
        variant: "destructive",
      });
    }
  });

  // Mutation para crear subcategoría
  const createSubcategoryMutation = useMutation({
    mutationFn: categoriesService.createSubcategory,
    onSuccess: () => {
      setAddingSubId(null);
      setNewSubName("");
      // Invalidar ambas queries según el modo
      if (SIMPLE_MODE) {
        queryClient.invalidateQueries({ queryKey: ["categories-simple"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
      toast({
        title: "Subcategoría creada",
        description: "La subcategoría fue creada exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear subcategoría",
        description: error.message || "No se pudo crear la subcategoría.",
        variant: "destructive",
      });
    }
  });

  // Mutation para eliminar categoría
  const deleteCategoryMutation = useMutation({
    mutationFn: categoriesService.deleteCategory,
    onSuccess: () => {
      // Invalidar ambas queries según el modo
      if (SIMPLE_MODE) {
        queryClient.invalidateQueries({ queryKey: ["categories-simple"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar la categoría.",
        variant: "destructive",
      });
    }
  });

  // Mutation para actualizar categoría
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, categoria }: { id: number; categoria: string }) => 
      categoriesService.updateCategory(id, categoria),
    onSuccess: () => {
      setEditingId(null);
      setEditingName("");
      // Invalidar ambas queries según el modo
      if (SIMPLE_MODE) {
        queryClient.invalidateQueries({ queryKey: ["categories-simple"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
      toast({
        title: "Categoría actualizada",
        description: "La categoría ha sido actualizada exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar",
        description: error.message || "No se pudo actualizar la categoría.",
        variant: "destructive",
      });
    }
  });

  // Obtener todas las categorías (modo simple o infinite)
  const allCategories = useMemo(() => {
    if (SIMPLE_MODE) {
      // Modo simple para debugging
      if (simpleQuery.data && simpleQuery.data.data) {
        return simpleQuery.data.data;
      }
      if (simpleQuery.data && Array.isArray(simpleQuery.data)) {
        return simpleQuery.data;
      }
      return [];
    } else {
      // Modo infinite scroll
      if (!data || !data.pages) return [];
      
      return data.pages.flatMap(page => {
        // Manejo flexible de la estructura de respuesta
        if (page && page.data && Array.isArray(page.data)) {
          return page.data;
        }
        // Si la respuesta es directamente un array
        if (Array.isArray(page)) {
          return page;
        }
        return [];
      });
    }
  }, [data, simpleQuery.data]);

  // Obtener estadísticas
  const totalCategories = useMemo(() => {
    if (SIMPLE_MODE) {
      if (simpleQuery.data?.meta?.total) {
        return simpleQuery.data.meta.total;
      }
      return allCategories.length;
    } else {
      if (!data?.pages || !data.pages[0]) return 0;
      
      const firstPage = data.pages[0];
      if (firstPage.meta && firstPage.meta.total) {
        return firstPage.meta.total;
      }
      return allCategories.length;
    }
  }, [data, simpleQuery.data, allCategories]);
  
  const totalSubcategories = useMemo(() => {
    return allCategories.reduce((total: number, cat: Category) => {
      if (cat && cat.subcategorias && Array.isArray(cat.subcategorias)) {
        return total + cat.subcategorias.length;
      }
      return total;
    }, 0);
  }, [allCategories]);

  // Estados de loading y error unificados
  const isLoadingUnified = SIMPLE_MODE ? simpleQuery.isLoading : isLoading;
  const isErrorUnified = SIMPLE_MODE ? simpleQuery.isError : isError;

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const threshold = 100; // Pixels antes del final para cargar más

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Configurar scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Agregar debugging más detallado
  useEffect(() => {
    if (SIMPLE_MODE && simpleQuery.data) {
      console.log("🔍 MODO SIMPLE - Datos recibidos:", simpleQuery.data);
      console.log("📦 MODO SIMPLE - Categorías:", allCategories);
    } else if (data) {
      console.log("🔍 MODO INFINITE - Datos recibidos completos:", data);
      console.log("📊 MODO INFINITE - Primera página:", data.pages[0]);
      console.log("📦 MODO INFINITE - Categorías procesadas:", allCategories);
    }
    console.log("📈 Total categorías:", totalCategories);
    console.log("🏷️ Total subcategorías:", totalSubcategories);
  }, [data, simpleQuery.data, allCategories, totalCategories, totalSubcategories]);

  // Agregar debugging para errores
  useEffect(() => {
    if (isErrorUnified) {
      console.error("❌ Error en la query:", SIMPLE_MODE ? simpleQuery.error : isError);
    }
  }, [isErrorUnified, simpleQuery.error, isError]);

  // Debug para loading states
  useEffect(() => {
    console.log("🔄 Estados:", { 
      mode: SIMPLE_MODE ? 'SIMPLE' : 'INFINITE',
      isLoading: isLoadingUnified, 
      isFetchingNextPage, 
      hasNextPage 
    });
  }, [isLoadingUnified, isFetchingNextPage, hasNextPage]);

  // Handlers para formularios
  const handleCreateCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error de validación",
        description: "El nombre de la categoría es requerido",
        variant: "destructive",
      });
      return;
    }

    if (newCategory.length < 3) {
      toast({
        title: "Error de validación", 
        description: "La categoría debe tener al menos 3 caracteres",
        variant: "destructive",
      });
      return;
    }

    createCategoryMutation.mutate(newCategory);
  };

  const handleSubmitSubcategory = () => {
    if (!newSubName.trim() || addingSubId === null) return;

    if (newSubName.length < 3) {
      toast({
        title: "Error de validación",
        description: "La subcategoría debe tener al menos 3 caracteres",
        variant: "destructive",
      });
      return;
    }

    createSubcategoryMutation.mutate({
      subcategoria: newSubName,
      categoriaId: addingSubId
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.categoria);
  };

  const handleSaveEdit = () => {
    if (!editingName.trim() || editingId === null) return;

    if (editingName.length < 3) {
      toast({
        title: "Error de validación",
        description: "La categoría debe tener al menos 3 caracteres",
        variant: "destructive",
      });
      return;
    }

    updateCategoryMutation.mutate({
      id: editingId,
      categoria: editingName
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleRefresh = () => {
    if (SIMPLE_MODE) {
      simpleQuery.refetch();
    } else {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      refetch();
    }
  };

  if (isErrorUnified) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">Error al cargar las categorías</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Categorías</h1>
          <p className="text-sm text-gray-600 mt-1">
            Administra las categorías y subcategorías del sistema
          </p>
        </div>
      </div>

      {/* Formulario de creación */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label htmlFor="new-category" className="text-sm font-medium text-gray-700">
              Nueva categoría
            </Label>
            <Input
              id="new-category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Ej: Amortiguadores"
              className="mt-1 h-9"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              disabled={createCategoryMutation.isPending}
            />
          </div>
          <Button
            onClick={handleCreateCategory}
            disabled={createCategoryMutation.isPending || !newCategory.trim()}
            className="h-9 px-4"
          >
            <Save className="w-4 h-4 mr-2" />
            {createCategoryMutation.isPending ? "Creando..." : "Crear"}
          </Button>
        </div>
      </div>

      {/* Estadísticas y búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span><strong>{totalCategories}</strong> categorías</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span><strong>{totalSubcategories}</strong> subcategorías</span>
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 -translate-y-1/2" />
            <Input
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 w-64"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoadingUnified}
            className="h-9 px-3"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingUnified ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Lista de categorías con scroll infinito */}
      <div 
        ref={scrollContainerRef}
        className="bg-white border border-gray-200 rounded-lg max-h-[600px] overflow-y-auto"
      >
        <Accordion type="single" collapsible className="w-full">
          {allCategories.length > 0 ? allCategories.map((cat: Category) => (
            <AccordionItem
              key={cat.id}
              value={`cat-${cat.id}`}
              className="border-b border-gray-100 last:border-b-0"
            >
              <AccordionTrigger className="flex justify-between items-center p-4 hover:bg-gray-50 text-left">
                <div className="flex items-center gap-3">
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="h-8 w-48"
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit();
                        }}
                        disabled={updateCategoryMutation.isPending}
                        className="h-8 px-2"
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEdit();
                        }}
                        className="h-8 px-2"
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900">{cat.categoria}</span>
                      {cat.subcategorias && cat.subcategorias.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {cat.subcategorias.length} subcategorías
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 pb-4">
                {/* Subcategorías existentes */}
                {cat.subcategorias && cat.subcategorias.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Subcategorías:</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.subcategorias.map((sub: { id: number; subcategoria: string }) => (
                        <Badge 
                          key={sub.id} 
                          variant="outline" 
                          className="text-sm bg-gray-50 hover:bg-gray-100"
                        >
                          {sub.subcategoria}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formulario para nueva subcategoría */}
                {addingSubId === cat.id ? (
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      placeholder="Nueva subcategoría"
                      className="h-8 flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmitSubcategory()}
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSubmitSubcategory}
                      disabled={!newSubName.trim() || createSubcategoryMutation.isPending}
                      className="h-8 px-3"
                    >
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setAddingSubId(null)}
                      className="h-8 px-3"
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAddingSubId(cat.id);
                      setNewSubName("");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-4"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar subcategoría
                  </button>
                )}
                
                {/* Acciones */}
                <div className="flex justify-end gap-2">
                  {editingId !== cat.id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditCategory(cat)}
                      className="h-8 px-3 text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(cat.id)}
                    disabled={deleteCategoryMutation.isPending}
                    className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deleteCategoryMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-red-500 rounded-full border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </>
                    )}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          )) : null}
        </Accordion>

        {/* Loading más datos */}
        {isFetchingNextPage && (
          <div className="p-4 text-center border-t border-gray-100">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-blue-500 animate-spin" />
              Cargando más categorías...
            </div>
          </div>
        )}

        {/* Estados vacíos */}
        {!allCategories.length && !isLoadingUnified && (
          <div className="p-8 text-center text-gray-500">
            {debouncedSearchTerm ? (
              <div>
                <Search className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No se encontraron resultados para "{debouncedSearchTerm}"</p>
              </div>
            ) : (
              <div>
                <p className="text-sm">No hay categorías registradas</p>
                <p className="text-xs text-gray-400 mt-1">Crea tu primera categoría usando el formulario superior</p>
              </div>
            )}
          </div>
        )}

        {/* Loading inicial */}
        {isLoadingUnified && (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-blue-500 animate-spin" />
              {SIMPLE_MODE ? "Cargando categorías (modo simple)..." : "Cargando categorías..."}
            </div>
          </div>
        )}
      </div>

      {/* Footer con info de paginación */}
      {allCategories.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          {debouncedSearchTerm ? (
            <p>Mostrando resultados para "{debouncedSearchTerm}"</p>
          ) : (
            <p>
              Mostrando {allCategories.length} de {totalCategories} categorías
              {!SIMPLE_MODE && hasNextPage && " - Scroll para cargar más"}
              {!SIMPLE_MODE && data?.pages[0]?.meta && (
                <span className="ml-2 text-xs text-gray-400">
                  (Páginas cargadas: {data.pages.length})
                </span>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FormCreateCategory;