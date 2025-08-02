import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { Accordion } from "@/components/atoms/accordion";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import useDebounce from "../hooks/useDebounce";
import categoriesService from "../services/categoriesService";
import FormCreateCategory from "./FormCreateCategory";
import SearchCategories from "./SearchCategories";
import CategoryItem from "./CategoryItem";
import PaginationControls from "./PaginationControls";

interface Category {
  id: number;
  categoria: string;
  subcategorias: Array<{
    id: number;
    subcategoria: string;
  }>;
}

const SIMPLE_MODE = false;

const TableCreateCategory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newCategory, setNewCategory] = useState("");
  const [addingSubId, setAddingSubId] = useState<number | null>(null);
  const [newSubName, setNewSubName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, perPage]);

  const simpleQuery = useQuery({
    queryKey: ["categories-simple"],
    queryFn: categoriesService.getCategoriesSimple,
    enabled: SIMPLE_MODE,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", debouncedSearchTerm, currentPage, perPage],
    queryFn: () =>
      categoriesService.getCategories({
        page: currentPage,
        categoria: debouncedSearchTerm,
        perPage,
      }),
    enabled: !SIMPLE_MODE,
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const createCategoryMutation = useMutation({
    mutationFn: categoriesService.createCategory,
    onSuccess: () => {
      setNewCategory("");
      queryClient.invalidateQueries({ queryKey: [SIMPLE_MODE ? "categories-simple" : "categories"] });
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
    },
  });

  const createSubcategoryMutation = useMutation({
    mutationFn: categoriesService.createSubcategory,
    onSuccess: () => {
      setAddingSubId(null);
      setNewSubName("");
      queryClient.invalidateQueries({ queryKey: [SIMPLE_MODE ? "categories-simple" : "categories"] });
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
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: categoriesService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SIMPLE_MODE ? "categories-simple" : "categories"] });
      toast({
        title: "Categoría eliminada",
        description: "La categoría fue eliminada exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar la categoría.",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, categoria }: { id: number; categoria: string }) =>
      categoriesService.updateCategory(id, categoria),
    onSuccess: () => {
      setEditingId(null);
      setEditingName("");
      queryClient.invalidateQueries({ queryKey: [SIMPLE_MODE ? "categories-simple" : "categories"] });
      toast({
        title: "Categoría actualizada",
        description: "La categoría fue actualizada exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar",
        description: error.message || "No se pudo actualizar la categoría.",
        variant: "destructive",
      });
    },
  });

  const allCategories = useMemo(() => {
    if (SIMPLE_MODE) return Array.isArray(simpleQuery.data) ? simpleQuery.data : simpleQuery.data?.data ?? [];
    return Array.isArray(data?.data) ? data.data : [];
  }, [data, simpleQuery.data]);

  const totalCategories = useMemo(() => {
    if (SIMPLE_MODE) return simpleQuery.data?.meta?.total ?? allCategories.length;
    return data?.meta?.total ?? allCategories.length;
  }, [data, simpleQuery.data, allCategories]);

  const totalSubcategories = useMemo(() => {
    return allCategories.reduce((total: number, cat: Category) => {
      return total + (Array.isArray(cat.subcategorias) ? cat.subcategorias.length : 0);
    }, 0);
  }, [allCategories]);

  const lastPage = useMemo(() => {
    return data?.meta?.last_page ?? 1;
  }, [data]);

  const isLoadingUnified = SIMPLE_MODE ? simpleQuery.isLoading : isLoading;
  const isErrorUnified = SIMPLE_MODE ? simpleQuery.isError : isError;

  useEffect(() => {
    if (isErrorUnified) {
      console.error("❌ Error en la query:", SIMPLE_MODE ? simpleQuery.error : isError);
    }
  }, [isErrorUnified, simpleQuery.error, isError]);

  const handleCreateCategory = () => {
    if (!newCategory.trim()) {
      return toast({
        title: "Error de validación",
        description: "El nombre de la categoría es requerido",
        variant: "destructive",
      });
    }
    if (newCategory.length < 3) {
      return toast({
        title: "Error de validación",
        description: "La categoría debe tener al menos 3 caracteres",
        variant: "destructive",
      });
    }

    createCategoryMutation.mutate(newCategory);
  };

  const handleSubmitSubcategory = () => {
    if (!newSubName.trim() || addingSubId === null) return;

    if (newSubName.length < 3) {
      return toast({
        title: "Error de validación",
        description: "La subcategoría debe tener al menos 3 caracteres",
        variant: "destructive",
      });
    }

    createSubcategoryMutation.mutate({
      subcategoria: newSubName,
      categoriaId: addingSubId,
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.categoria);
  };

  const handleSaveEdit = () => {
    if (!editingName.trim() || editingId === null) return;

    if (editingName.length < 3) {
      return toast({
        title: "Error de validación",
        description: "La categoría debe tener al menos 3 caracteres",
        variant: "destructive",
      });
    }

    updateCategoryMutation.mutate({
      id: editingId,
      categoria: editingName,
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
    }
  };

  return (
    <div className="max-w-4xl p-4 mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestión de Categorías
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra las categorías y subcategorías del sistema
          </p>
        </div>
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <FormCreateCategory
          value={newCategory}
          onChange={setNewCategory}
          onSubmit={handleCreateCategory}
          isLoading={createCategoryMutation.isPending}
        />
      </div>

      <SearchCategories
        value={searchTerm}
        onChange={setSearchTerm}
        onRefresh={handleRefresh}
        isLoading={isLoadingUnified}
      />

      <div className="bg-white border border-gray-200 rounded-lg">
        <Accordion type="single" collapsible className="w-full">
          {allCategories.length > 0 &&
            allCategories.map((cat: Category) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                editingId={editingId}
                editingName={editingName}
                onEdit={handleEditCategory}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onChangeEditName={setEditingName}
                onDelete={handleDelete}
                addingSubId={addingSubId}
                newSubName={newSubName}
                onAddSub={(id) => {
                  setAddingSubId(id);
                  setNewSubName("");
                }}
                onChangeSubName={setNewSubName}
                onSubmitSub={handleSubmitSubcategory}
                onCancelSub={() => setAddingSubId(null)}
                isSavingEdit={updateCategoryMutation.isPending}
                isDeleting={deleteCategoryMutation.isPending}
                isSavingSub={createSubcategoryMutation.isPending}
              />
            ))}
        </Accordion>

        {isLoadingUnified && (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-blue-500 animate-spin" />
              Cargando categorías...
            </div>
          </div>
        )}

        {!allCategories.length && !isLoadingUnified && (
          <div className="p-8 text-center text-gray-500">
            {debouncedSearchTerm ? (
              <>
                <Search className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">
                  No se encontraron resultados para "{debouncedSearchTerm}"
                </p>
              </>
            ) : (
              <>
                <p className="text-sm">No hay categorías registradas</p>
                <p className="mt-1 text-xs text-gray-400">
                  Crea tu primera categoría usando el formulario superior
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {!SIMPLE_MODE && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={setCurrentPage}
          isLoading={isLoadingUnified}
          perPage={perPage}
          onPerPageChange={setPerPage}
        />
      )}

      {allCategories.length > 0 && (
        <div className="text-sm text-center text-gray-500">
          {debouncedSearchTerm ? (
            <p>Mostrando resultados para "{debouncedSearchTerm}"</p>
          ) : (
            <p>
              Mostrando {allCategories.length} de {totalCategories} categorías{" "}
              {data?.meta?.total &&
                `en la página ${data.meta.current_page} de ${data.meta.last_page}`}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TableCreateCategory;
