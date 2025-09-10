import { Kbd } from "@/components/atoms/kbd";
import TooltipButton from "@/components/common/TooltipButton";
import { useGoBack } from "@/hooks/useGoBack";
import { CornerUpLeft, Edit, Filter, FolderOpen, RefreshCcw, Search, Trash2 } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { Input } from "@/components/atoms/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import CustomizableTable from "@/components/common/CustomizableTable";
import Pagination from "@/components/common/pagination";
import type { DialogConfig } from "../types/configFormDialog.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigFormDialog } from "../components/configFormDialog";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { showErrorToast, showSuccessToast } from "@/hooks/use-toast-enhanced";
import { useLocation, useNavigate } from "react-router";
import ConfirmationModal from "@/components/common/confirmationModal";
import useConfirmMutation from "@/hooks/useConfirmMutation";
import RowsPerPageSelect from "@/components/common/RowsPerPageSelect";
import { useCategoryFilters } from "../hooks/category/useCategoryFilters";
import { useGetAllCategories } from "../hooks/category/useGetAllCategories";
import { useGetCategoryById } from "../hooks/category/useGetCategoryById";
import { useCreateCategory } from "../hooks/category/useCreateCategory";
import { useUpdateCategory } from "../hooks/category/useUpdateCategory";
import { useDeleteCategory } from "../hooks/category/useDeleteCategory";
import type { Category, CreateCategory, UpdateCategory } from "../types/category.types";
import { CreateCategorySchema, UpdateCategorySchema } from "../schemas/category.schema";
import { Label } from "@/components/atoms/label";

const CATEGORIES_DIALOG_CONFIG: DialogConfig = {
    title: "Categoria",
    description: "una categoria",
    field: {
        name: "categoria",
        label: "Categoria",
        placeholder: "Ingresa el nombre de la categoria...",
        required: true,
    }
};

const CategoriesScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [codigo_interno, setCodigoInterno] = useState("")

    const {
        filters,
        updateFilter,
        debouncedFilters,
        resetFilters,
        setPage,
    } = useCategoryFilters()

    const {
        data: categoriesData,
        refetch: handleRefetchCategoriesData,
        isFetching: isFetchingCategoriesData,
        isRefetching: isRefetchingCategoriesData,
        isLoading: isLoadingCategoriesData,
        isError: isErrorCategoriesData,
    } = useGetAllCategories(debouncedFilters)

    const {
        data: categoryById,
        isLoading: isLoadingCategoryById,
        isError: isErrorCategoryById,
        error: errorCategoryById
    } = useGetCategoryById(editingId || 0)

    const {
        mutate: handleCreateCategory,
        isPending: isCreating
    } = useCreateCategory()

    const {
        mutate: handleUpdateCategory,
        isPending: isUpdating
    } = useUpdateCategory()

    const { handleError } = useErrorHandler()

    const handleGoBack = useGoBack("/dashboard/settings");

    const handleDeleteSuccess = useCallback((_data: unknown, id: number) => {
        showSuccessToast({
            title: "Categoría eliminada",
            description: `La Categoría #${id} se eliminó exitosamente`,
            duration: 5000
        });
        setEditingId(null);
    }, []);

    const handleDeleteError = useCallback((error: unknown, id: number) => {
        handleError({ error, customTitle: `Error al eliminar Categoría #${id}` });
    }, [handleError]);

    const {
        mutate: deleteCategory,
        isPending: isDeleting
    } = useDeleteCategory()

    const {
        close: handleCloseDeleteAlert,
        confirm: handleConfirmDeleteAlert,
        isOpen: showDeleteAlert,
        open: handleOpenDeleteAlert,
        variables: itemToDelete
    } = useConfirmMutation(deleteCategory, handleDeleteSuccess, handleDeleteError)

    // Forms
    const createForm = useForm<CreateCategory>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            categoria: ''
        },
    });

    const updateForm = useForm<UpdateCategory>({
        resolver: zodResolver(UpdateCategorySchema),
        defaultValues: {
            categoria: ''
        },
    });

    const isEditing = useMemo(() => editingId !== null, [editingId]);
    const currentForm = useMemo(() => isEditing ? updateForm : createForm, [isEditing, updateForm, createForm]);
    const isSaving = useMemo(() => isCreating || isUpdating, [isCreating, isUpdating]);
    const totalRecords = useMemo(() => categoriesData?.meta?.total || 0, [categoriesData?.meta?.total]);
    const isRefreshing = useMemo(() => isRefetchingCategoriesData || isFetchingCategoriesData, [isRefetchingCategoriesData, isFetchingCategoriesData]);

    useEffect(() => {
        if (location.state?.openModal) {
            handleAddCategory()
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        if (categoryById && isEditing) {
            updateForm.reset({
                categoria: categoryById.categoria
            });
        }
    }, [categoryById, isEditing, updateForm]);

    const handleAddCategory = useCallback(() => {
        setEditingId(null);
        createForm.reset();
        setIsDialogOpen(true);
    }, [createForm]);

    const handleEditCategory = useCallback((id: number) => {
        setEditingId(id);
        setIsDialogOpen(true);
    }, []);

    const handleDialogToggle = useCallback((open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setEditingId(null);
            createForm.reset();
            updateForm.reset();
        }
    }, [createForm, updateForm]);

    const handleCreateSubmit = useCallback(createForm.handleSubmit(async (data: CreateCategory) => {
        handleCreateCategory(data, {
            onSuccess: () => {
                showSuccessToast({
                    title: "Categoría Agregada",
                    description: "Categoría agregada exitosamente",
                    duration: 5000
                });
                handleDialogToggle(false);
            },
            onError: (error: unknown) => {
                handleError({ error, customTitle: "No se pudo agregar la categoría" });
            }
        });
    }), [createForm, handleCreateCategory, handleDialogToggle, handleError]);

    const handleUpdateSubmit = useCallback(updateForm.handleSubmit(async (data: UpdateCategory) => {
        if (!editingId) {
            showErrorToast({
                title: "Error al modificar categoría",
                description: "No se pudo modificar la categoría. Por favor, intenta nuevamente",
                duration: 5000
            });
            return;
        }

        handleUpdateCategory({ data, id: editingId }, {
            onSuccess: () => {
                showSuccessToast({
                    title: "Categoría Modificada",
                    description: "Categoría modificada exitosamente",
                    duration: 5000
                });
                handleDialogToggle(false);
            },
            onError: (error: unknown) => {
                handleError({ error, customTitle: "No se pudo modificar la categoría" });
            }
        });
    }), [updateForm, editingId, handleUpdateCategory, handleDialogToggle, handleError]);

    const handleRowsChange = useCallback((rows: number) => {
        updateFilter("pagina_registros", rows);
    }, [updateFilter]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateFilter("categoria", e.target.value);
    }, [updateFilter]);

    const handleFilterByInternalCode = useCallback(() => {
        console.log(codigo_interno)
        updateFilter("codigo_interno", Number(codigo_interno))
    }, [updateFilter, codigo_interno])

    useEffect(() => {
        if (!isErrorCategoryById) return
        handleError({ error: errorCategoryById, customTitle: "Ocurrió un error al cargar los datos" });
        handleDialogToggle(false)
    }, [isErrorCategoryById, errorCategoryById, handleError, handleDialogToggle])

    const columns = useMemo<ColumnDef<Category>[]>(() => [
        {
            accessorKey: "id",
            header: "ID",
            size: 40,
            minSize: 30,
            cell: ({ getValue }) => (
                <span className="font-medium font-mono text-gray-700">
                    #{getValue<number>()}
                </span>
            )
        },
        {
            accessorKey: "categoria",
            header: "Categoría",
            cell: ({ getValue }) => (
                <h3 className="font-medium text-gray-700">
                    {getValue<string>()}
                </h3>
            )
        },
        {
            id: "actions",
            header: "Acciones",
            size: 60,
            cell: ({ row }) => {
                const id = row.original.id
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            className="w-8 cursor-pointer"
                            variant={"outline"}
                            onClick={() => handleEditCategory(id)}
                        >
                            <Edit className="size-4" />
                        </Button>

                        <Button
                            className="w-8 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent hover:border-red-200"
                            variant={"outline"}
                            onClick={() => handleOpenDeleteAlert(id)}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                )
            },
        },
    ], [handleEditCategory, handleOpenDeleteAlert]);

    const table = useReactTable<Category>({
        data: categoriesData?.data || [],
        columns,
        state: {},
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
        enableColumnResizing: true,
        enableRowSelection: true,
    })

    // Shortcuts
    useHotkeys('escape', (e) => {
        e.preventDefault();
        handleGoBack();
    }, {
        scopes: ["esc-key"],
        enabled: true
    });

    return (
        <main className="w-full max-w-5xl mx-auto space-y-2">
            <header className="border-gray-200 border bg-white rounded-lg p-2 sm:p-3">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TooltipButton
                            tooltipContentProps={{
                                align: 'start'
                            }}
                            onClick={handleGoBack}
                            tooltip={<p className="flex items-center gap-1">Presiona <Kbd>esc</Kbd> para volver atrás</p>}
                            buttonProps={{
                                variant: 'default',
                                type: 'button',
                                className: 'size-9'
                            }}
                        >
                            <CornerUpLeft />
                        </TooltipButton>
                        <div>
                            <h1 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                                Categorías
                            </h1>
                            <p className="text-sm text-gray-500">Categorías principales</p>
                        </div>
                    </div >
                </div >
            </header >

            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                        <Filter className="size-5 text-gray-700" />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <section className="grid gap-2 sm:grid-cols-2">
                        <div className=" grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="categoria">Categoría</Label>
                                <div className="flex w-full relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar categoría..."
                                        value={filters.categoria}
                                        onChange={handleSearchChange}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Cod. Interno</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={codigo_interno}
                                        onChange={(e) => setCodigoInterno(e.target.value)}
                                        placeholder="Ej. 16"
                                    />
                                    <Button
                                        className="cursor-pointer"
                                        onClick={handleFilterByInternalCode}
                                    >
                                        <Search className="size-4 " />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end w-full items-end">
                            <TooltipButton
                                onClick={handleRefetchCategoriesData}
                                buttonProps={{
                                    className: 'w-8',
                                    disabled: isRefreshing,
                                }}
                                tooltip={"Recargar datos"}
                            >
                                <RefreshCcw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </TooltipButton>

                            <RowsPerPageSelect
                                value={filters.pagina_registros}
                                onChange={handleRowsChange}
                            />

                            <Button onClick={resetFilters}>
                                <Filter className="size-4" />
                                Limpiar Filtros
                            </Button>
                        </div>
                    </section>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                            <FolderOpen className="size-5 text-gray-700" />
                            Gestionar Categorías
                        </CardTitle>
                        <CardDescription className="text-sm">
                            {totalRecords} elemento{totalRecords !== 1 ? "s" : ""} registrado
                            {totalRecords !== 1 ? "s" : ""}
                        </CardDescription>
                    </div>
                    <ConfigFormDialog
                        config={CATEGORIES_DIALOG_CONFIG}
                        isOpen={isDialogOpen}
                        onOpenChange={handleDialogToggle}
                        onSubmit={isEditing ? handleUpdateSubmit : handleCreateSubmit}
                        register={currentForm.register}
                        errors={currentForm.formState.errors}
                        isLoading={isLoadingCategoryById}
                        isEditing={isEditing}
                        editingId={editingId}
                        isSaving={isSaving}
                    />
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg border-gray-200">
                        <CustomizableTable
                            table={table}
                            isLoading={isLoadingCategoriesData}
                            isError={isErrorCategoriesData}
                            isFetching={isFetchingCategoriesData}
                            rows={filters.pagina_registros}
                        />
                    </div>

                    <Pagination
                        className="border-0 px-0 pt-3 pb-0"
                        currentPage={filters.pagina || 1}
                        onPageChange={setPage}
                        totalData={totalRecords}
                        onShowRowsChange={handleRowsChange}
                        showRows={filters.pagina_registros}
                    />
                </CardContent>
            </Card>

            <ConfirmationModal
                isOpen={showDeleteAlert}
                title="Eliminar categoría"
                message={`¿Estás seguro de que deseas eliminar la categoría #${itemToDelete}?`}
                onClose={handleCloseDeleteAlert}
                onConfirm={handleConfirmDeleteAlert}
                isLoading={isDeleting}
            />
        </main>
    );
}
export default CategoriesScreen;