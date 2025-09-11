import { Kbd } from "@/components/atoms/kbd";
import TooltipButton from "@/components/common/TooltipButton";
import { useGoBack } from "@/hooks/useGoBack";
import { CornerUpLeft, Edit, Filter, MapPin, RefreshCcw, Search, Trash2 } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useGetAllOrigins } from "../hooks/origin/useGetAllOrigins";
import { useOriginFilters } from "../hooks/origin/useOriginFilters";
import { Input } from "@/components/atoms/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import type { CreateOrigin, Origin, UpdateOrigin } from "../types/origin.types";
import CustomizableTable from "@/components/common/CustomizableTable";
import Pagination from "@/components/common/pagination";
import type { DialogConfig } from "../types/configFormDialog.types";
import { useForm } from "react-hook-form";
import { CreateOriginSchema, UpdateOriginSchema } from "../schemas/origin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetOriginById } from "../hooks/origin/useGetOriginById";
import { useCreateOrigin } from "../hooks/origin/useCreateOrigin";
import { useUpdateOrigin } from "../hooks/origin/useUpdateOrigin";
import { ConfigFormDialog } from "../components/configFormDialog";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { showErrorToast, showSuccessToast } from "@/hooks/use-toast-enhanced";
import { useLocation, useNavigate } from "react-router";
import ConfirmationModal from "@/components/common/confirmationModal";
import { useDeleteOrigin } from "../hooks/origin/useDeleteOrigin";
import useConfirmMutation from "@/hooks/useConfirmMutation";
import RowsPerPageSelect from "@/components/common/RowsPerPageSelect";

const ORIGINS_DIALOG_CONFIG: DialogConfig = {
    title: "Procedencia",
    description: "una procedencia",
    field: {
        name: "procedencia",
        label: "Procedencia",
        placeholder: "Ingresa el nombre de la procedencia...",
        required: true,
    }
};

const OriginsScreen = () => {
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
    } = useOriginFilters()

    const {
        data: originsData,
        refetch: handleRefetchOriginsData,
        isFetching: isFetchingOriginsData,
        isRefetching: isRefetchingOriginsData,
        isLoading: isLoadingOriginsData,
        isError: isErrorOriginsData,
    } = useGetAllOrigins(debouncedFilters)

    const {
        data: originById,
        isLoading: isLoadingOriginById,
        isError: isErrorOriginById,
        error: errorOriginById
    } = useGetOriginById(editingId || 0)

    const {
        mutate: handleCreateOrigin,
        isPending: isCreating
    } = useCreateOrigin()

    const {
        mutate: handleUpdateOrigin,
        isPending: isUpdating
    } = useUpdateOrigin()

    const { handleError } = useErrorHandler()

    const handleGoBack = useGoBack("/dashboard/settings");

    const handleDeleteSuccess = useCallback((_data: unknown, id: number) => {
        showSuccessToast({
            title: "Procedencia eliminada",
            description: `La procedencia #${id} se eliminó exitosamente`,
            duration: 5000
        })
        setEditingId(null)
    }, [])

    const handleDeleteError = useCallback((error: unknown, id: number) => {
        handleError({ error, customTitle: `Error al eliminar procedencia #${id}` });
    }, []);

    const {
        mutate: deleteOrigin,
        isPending: isDeleting
    } = useDeleteOrigin()

    const {
        close: handleCloseDeleteAlert,
        confirm: handleConfirmDeleteAlert,
        isOpen: showDeleteAlert,
        open: handleOpenDeleteAlert,
        variables: itemToDelete
    } = useConfirmMutation(deleteOrigin, handleDeleteSuccess, handleDeleteError)

    // Forms
    const createForm = useForm<CreateOrigin>({
        resolver: zodResolver(CreateOriginSchema),
        defaultValues: {
            procedencia: ''
        },
    });

    const updateForm = useForm<UpdateOrigin>({
        resolver: zodResolver(UpdateOriginSchema),
        defaultValues: {
            procedencia: ''
        },
    });

    const isEditing = useMemo(() => editingId !== null, [editingId]);
    const currentForm = useMemo(() => isEditing ? updateForm : createForm, [isEditing, updateForm, createForm]);
    const isSaving = useMemo(() => isCreating || isUpdating, [isCreating, isUpdating]);
    const totalRecords = useMemo(() => originsData?.meta?.total || 0, [originsData?.meta?.total]);
    const isRefreshing = useMemo(() => isRefetchingOriginsData || isFetchingOriginsData, [isRefetchingOriginsData, isFetchingOriginsData]);

    useEffect(() => {
        if (location.state?.openModal) {
            handleAddOrigin()
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        if (originById && isEditing) {
            updateForm.reset({
                procedencia: originById.procedencia
            });
        }
    }, [originById, isEditing, updateForm]);

    const handleAddOrigin = useCallback(() => {
        setEditingId(null);
        createForm.reset();
        setIsDialogOpen(true);
    }, [createForm]);

    const handleEditOrigin = useCallback((id: number) => {
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

    const handleCreateSubmit = useCallback(createForm.handleSubmit(async (data: CreateOrigin) => {
        handleCreateOrigin(data, {
            onSuccess: () => {
                showSuccessToast({
                    title: "Procedencia Agregada",
                    description: `Procedencia agregada exitosamente`,
                    duration: 5000
                });
                handleDialogToggle(false)
            },
            onError: (error: unknown) => {
                handleError({ error, customTitle: "No se pudo agregar la procedencia" });
            }
        });
    }), [createForm, handleCreateOrigin, handleDialogToggle, handleError]);

    const handleUpdateSubmit = useCallback(updateForm.handleSubmit(async (data: UpdateOrigin) => {
        if (editingId) {
            handleUpdateOrigin({ data, id: editingId }, {
                onSuccess: () => {
                    showSuccessToast({
                        title: "Procedencia Modificada",
                        description: `Procedencia modificada exitosamente`,
                        duration: 5000
                    });
                    handleDialogToggle(false)
                },
                onError: (error: unknown) => {
                    handleError({ error, customTitle: "No se pudo modificar la procedencia" });
                }
            });
        }
        else {
            showErrorToast({
                title: "Error al eliminar procedencia",
                description: `No se pudo eliminar la procedencia. Por favor, intenta nuevamente`,
                duration: 5000
            })
        }
    }), [updateForm, editingId, handleUpdateOrigin, handleDialogToggle, handleError]);

    const handleRowsChange = useCallback((rows: number) => {
        updateFilter("pagina_registros", rows);
    }, [updateFilter]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateFilter("procedencia", e.target.value);
    }, [updateFilter]);

    useEffect(() => {
        if (!isErrorOriginById) return
        handleError({ error: errorOriginById, customTitle: "Ocurrió un error al cargar los datos" });
        handleDialogToggle(false)
    }, [isErrorOriginById, errorOriginById, handleError, handleDialogToggle])

    const columns = useMemo<ColumnDef<Origin>[]>(() => [
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
            accessorKey: "procedencia",
            header: "Procedencia",
            cell: ({ getValue }) => (
                <h3 className="font-medium text-gray-700 truncate">
                    {getValue<string>()}
                </h3>
            )
        },
        {
            id: "actions",
            header: "Acciones",
            size: 80,
            cell: ({ row }) => {
                const id = row.original.id
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            className="w-8 cursor-pointer"
                            variant={"outline"}
                            onClick={() => handleEditOrigin(id)}
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
    ], [handleEditOrigin, handleOpenDeleteAlert]);

    const table = useReactTable<Origin>({
        data: originsData?.data || [],
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
                                Procedencias
                            </h1>
                            <p className="text-sm text-gray-500">Origen de los productos</p>
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
                                placeholder="Buscar procedencia..."
                                value={filters.procedencia}
                                onChange={handleSearchChange}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-2 justify-end w-full">
                            <TooltipButton
                                onClick={handleRefetchOriginsData}
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
                            <MapPin className="size-5 text-gray-700" />
                            Gestionar Procedencias
                        </CardTitle>
                        <CardDescription className="text-sm">
                            {totalRecords} elemento{totalRecords !== 1 ? "s" : ""} registrado
                            {totalRecords !== 1 ? "s" : ""}
                        </CardDescription>
                    </div>
                    <ConfigFormDialog
                        config={ORIGINS_DIALOG_CONFIG}
                        isOpen={isDialogOpen}
                        onOpenChange={handleDialogToggle}
                        onSubmit={isEditing ? handleUpdateSubmit : handleCreateSubmit}
                        register={currentForm.register}
                        errors={currentForm.formState.errors}
                        isLoading={isLoadingOriginById}
                        isEditing={isEditing}
                        editingId={editingId}
                        isSaving={isSaving}
                    />
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg border-gray-200">
                        <CustomizableTable
                            table={table}
                            isLoading={isLoadingOriginsData}
                            isError={isErrorOriginsData}
                            isFetching={isFetchingOriginsData}
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
                title="Eliminar procedencia"
                message={`¿Estás seguro de que deseas eliminar la procedencia #${itemToDelete}?`}
                onClose={handleCloseDeleteAlert}
                onConfirm={handleConfirmDeleteAlert}
                isLoading={isDeleting}
            />
        </main>
    );
}
export default OriginsScreen;