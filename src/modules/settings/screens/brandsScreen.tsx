import { Kbd } from "@/components/atoms/kbd";
import TooltipButton from "@/components/common/TooltipButton";
import { useGoBack } from "@/hooks/useGoBack";
import { CornerUpLeft, Edit, Filter, RefreshCcw, Search, Tag, Trash2 } from "lucide-react";
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
import { useGetAllBrands } from "../hooks/brand/useGetAllBrands";
import { useGetBrandById } from "../hooks/brand/useGetBrandById";
import { useCreateBrand } from "../hooks/brand/useCreateBrand";
import { useUpdateBrand } from "../hooks/brand/useUpdateBrand";
import { useDeleteBrand } from "../hooks/brand/useDeleteBrand";
import type { Brand, CreateBrand, UpdateBrand } from "../types/brand.types";
import { CreateBrandSchema, UpdateBrandSchema } from "../schemas/brand.schema";
import { useBrandFilters } from "../hooks/brand/useBrandFilters";
import RowsPerPageSelect from "@/components/common/RowsPerPageSelect";

const BRANDS_DIALOG_CONFIG: DialogConfig = {
    title: "Marca",
    description: "una marca",
    field: {
        name: "marca",
        label: "Marca",
        placeholder: "Ingresa el nombre de la marca...",
        required: true,
    }
};

const BrandsScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const {
        filters,
        updateFilter,
        debouncedFilters,
        resetFilters,
        setPage,
    } = useBrandFilters()

    const {
        data: brandsData,
        refetch: handleRefetchBrandsData,
        isFetching: isFetchingBrandsData,
        isRefetching: isRefetchingBrandsData,
        isLoading: isLoadingBrandsData,
        isError: isErrorBrandsData,
    } = useGetAllBrands(debouncedFilters)

    const {
        data: brandById,
        isLoading: isLoadingBrandById
    } = useGetBrandById(editingId || 0)

    const {
        mutate: handleCreateBrand,
        isPending: isCreating
    } = useCreateBrand()

    const {
        mutate: handleUpdateBrand,
        isPending: isUpdating
    } = useUpdateBrand()

    const { handleError } = useErrorHandler()

    const handleGoBack = useGoBack("/dashboard/settings");

    const handleDeleteSuccess = useCallback((_data: unknown, id: number) => {
        showSuccessToast({
            title: "Marca eliminada",
            description: `La marca #${id} se eliminó exitosamente`,
            duration: 5000
        });
        setEditingId(null);
    }, []);

    const handleDeleteError = useCallback((error: unknown, id: number) => {
        handleError({ error, customTitle: `Error al eliminar marca #${id}` });
    }, [handleError]);

    const {
        mutate: deleteBrand,
        isPending: isDeleting
    } = useDeleteBrand()

    const {
        close: handleCloseDeleteAlert,
        confirm: handleConfirmDeleteAlert,
        isOpen: showDeleteAlert,
        open: handleOpenDeleteAlert,
        variables: itemToDelete
    } = useConfirmMutation(deleteBrand, handleDeleteSuccess, handleDeleteError)

    // Forms
    const createForm = useForm<CreateBrand>({
        resolver: zodResolver(CreateBrandSchema),
        defaultValues: {
            marca: ''
        },
    });

    const updateForm = useForm<UpdateBrand>({
        resolver: zodResolver(UpdateBrandSchema),
        defaultValues: {
            marca: ''
        },
    });

    const isEditing = useMemo(() => editingId !== null, [editingId]);
    const currentForm = useMemo(() => isEditing ? updateForm : createForm, [isEditing, updateForm, createForm]);
    const isSaving = useMemo(() => isCreating || isUpdating, [isCreating, isUpdating]);
    const totalRecords = useMemo(() => brandsData?.meta?.total || 0, [brandsData?.meta?.total]);
    const isRefreshing = useMemo(() => isRefetchingBrandsData || isFetchingBrandsData, [isRefetchingBrandsData, isFetchingBrandsData]);

    useEffect(() => {
        if (location.state?.openModal) {
            handleAddBrand()
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        if (brandById && isEditing) {
            updateForm.reset({
                marca: brandById.marca
            });
        }
    }, [brandById, isEditing, updateForm]);

    const handleAddBrand = useCallback(() => {
        setEditingId(null);
        createForm.reset();
        setIsDialogOpen(true);
    }, [createForm]);

    const handleEditBrand = useCallback((id: number) => {
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

    const handleCreateSubmit = useCallback(createForm.handleSubmit(async (data: CreateBrand) => {
        handleCreateBrand(data, {
            onSuccess: () => {
                showSuccessToast({
                    title: "Marca Agregada",
                    description: "Marca agregada exitosamente",
                    duration: 5000
                });
                handleDialogToggle(false);
            },
            onError: (error: unknown) => {
                handleError({ error, customTitle: "No se pudo agregar la marca" });
            }
        });
    }), [createForm, handleCreateBrand, handleDialogToggle, handleError]);

    const handleUpdateSubmit = useCallback(updateForm.handleSubmit(async (data: UpdateBrand) => {
        if (!editingId) {
            showErrorToast({
                title: "Error al modificar marca",
                description: "No se pudo modificar la marca. Por favor, intenta nuevamente",
                duration: 5000
            });
            return;
        }

        handleUpdateBrand({ data, id: editingId }, {
            onSuccess: () => {
                showSuccessToast({
                    title: "Marca Modificada",
                    description: "Marca modificada exitosamente",
                    duration: 5000
                });
                handleDialogToggle(false);
            },
            onError: (error: unknown) => {
                handleError({ error, customTitle: "No se pudo modificar la marca" });
            }
        });
    }), [updateForm, editingId, handleUpdateBrand, handleDialogToggle, handleError]);

    const handleRowsChange = useCallback((rows: number) => {
        updateFilter("pagina_registros", rows);
    }, [updateFilter]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateFilter("marca", e.target.value);
    }, [updateFilter]);

    const columns = useMemo<ColumnDef<Brand>[]>(() => [
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
            accessorKey: "marca",
            header: "Marca",
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
                            onClick={() => handleEditBrand(id)}
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
    ], [handleEditBrand, handleOpenDeleteAlert]);

    const table = useReactTable<Brand>({
        data: brandsData?.data || [],
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
                                Marcas
                            </h1>
                            <p className="text-sm text-gray-500">Marcas de productos</p>
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
                        <div className="flex w-full relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar marca..."
                                value={filters.marca}
                                onChange={handleSearchChange}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-2 justify-end w-full">
                            <TooltipButton
                                onClick={handleRefetchBrandsData}
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
                            <Tag className="size-5 text-gray-700" />
                            Gestionar Marcas
                        </CardTitle>
                        <CardDescription className="text-sm">
                            {totalRecords} elemento{totalRecords !== 1 ? "s" : ""} registrado
                            {totalRecords !== 1 ? "s" : ""}
                        </CardDescription>
                    </div>
                    <ConfigFormDialog
                        config={BRANDS_DIALOG_CONFIG}
                        isOpen={isDialogOpen}
                        onOpenChange={handleDialogToggle}
                        onSubmit={isEditing ? handleUpdateSubmit : handleCreateSubmit}
                        register={currentForm.register}
                        errors={currentForm.formState.errors}
                        isLoading={isLoadingBrandById}
                        isEditing={isEditing}
                        editingId={editingId}
                        isSaving={isSaving}
                    />
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg border-gray-200">
                        <CustomizableTable
                            table={table}
                            isLoading={isLoadingBrandsData}
                            isError={isErrorBrandsData}
                            isFetching={isFetchingBrandsData}
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
                title="Eliminar marca"
                message={`¿Estás seguro de que deseas eliminar la marca #${itemToDelete}?`}
                onClose={handleCloseDeleteAlert}
                onConfirm={handleConfirmDeleteAlert}
                isLoading={isDeleting}
            />
        </main>
    );
}
export default BrandsScreen;