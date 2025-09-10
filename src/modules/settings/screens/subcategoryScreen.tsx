import { Kbd } from "@/components/atoms/kbd";
import TooltipButton from "@/components/common/TooltipButton";
import { useGoBack } from "@/hooks/useGoBack";
import { CornerUpLeft, Edit, Filter, Layers, RefreshCcw, Search, Trash2 } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { Input } from "@/components/atoms/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import CustomizableTable from "@/components/common/CustomizableTable";
import Pagination from "@/components/common/pagination";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { showSuccessToast } from "@/hooks/use-toast-enhanced";
import { useLocation, useNavigate } from "react-router";
import ConfirmationModal from "@/components/common/confirmationModal";
import useConfirmMutation from "@/hooks/useConfirmMutation";
import RowsPerPageSelect from "@/components/common/RowsPerPageSelect";
import { useSubcategoryFilters } from "../hooks/subcategory/useSubcategoryFilters";
import { useGetAllSubcategories } from "../hooks/subcategory/useGetAllSubcategories";
import { useDeleteSubcategory } from "../hooks/subcategory/useDeleteSubcategory";
import type { Subcategory } from "../types/subcategory.types";
import { Label } from "@/components/atoms/label";
import SubcategoryFormDialog from "../components/subcategoryFormDialog";
import { useCategoriesWithSubcategories } from "@/modules/shared/hooks/useCategories";
import { ComboboxSelect } from "@/components/common/SelectCombobox";
import { formatCell } from "@/utils/formatCell";

const SubcategoriessScreen = () => {
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
    } = useSubcategoryFilters()

    const {
        data: subcategoriesData,
        refetch: handleRefetchSubcategoriesData,
        isFetching: isFetchingSubcategoriesData,
        isRefetching: isRefetchingSubcategoriesData,
        isLoading: isLoadingSubcategoriesData,
        isError: isErrorSubcategoriesData,
    } = useGetAllSubcategories(debouncedFilters)

    const {
        data: categoriesData,
        isLoading: isLoadingCategoriesData,
    } = useCategoriesWithSubcategories()

    const { handleError } = useErrorHandler()

    const handleGoBack = useGoBack("/dashboard/settings");

    const handleDeleteSuccess = useCallback((_data: unknown, id: number) => {
        showSuccessToast({
            title: "Subcategoria eliminada",
            description: `La Subcategoria #${id} se eliminó exitosamente`,
            duration: 5000
        });
        setEditingId(null);
    }, []);

    const handleDeleteError = useCallback((error: unknown, id: number) => {
        handleError({ error, customTitle: `Error al eliminar la Subcategoria #${id}` });
    }, [handleError]);

    const {
        mutate: deleteSubcategory,
        isPending: isDeleting
    } = useDeleteSubcategory()

    const {
        close: handleCloseDeleteAlert,
        confirm: handleConfirmDeleteAlert,
        isOpen: showDeleteAlert,
        open: handleOpenDeleteAlert,
        variables: itemToDelete
    } = useConfirmMutation(deleteSubcategory, handleDeleteSuccess, handleDeleteError)

    const isEditing = useMemo(() => editingId !== null, [editingId]);
    const totalRecords = useMemo(() => subcategoriesData?.meta?.total || 0, [subcategoriesData?.meta?.total]);
    const isRefreshing = useMemo(() => isRefetchingSubcategoriesData || isFetchingSubcategoriesData, [isRefetchingSubcategoriesData, isFetchingSubcategoriesData]);

    useEffect(() => {
        if (location.state?.openModal) {
            handleAddSubcategory()
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const handleAddSubcategory = useCallback(() => {
        setEditingId(null);
        setIsDialogOpen(true);
    }, []);

    const handleEditSubcategory = useCallback((id: number) => {
        setEditingId(id);
        setIsDialogOpen(true);
    }, []);

    const handleDialogToggle = useCallback((open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setEditingId(null);
        }
    }, []);

    const handleRowsChange = useCallback((rows: number) => {
        updateFilter("pagina_registros", rows);
    }, [updateFilter]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateFilter("subcategoria", e.target.value);
    }, [updateFilter]);

    const columns = useMemo<ColumnDef<Subcategory>[]>(() => [
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
            accessorKey: "subcategoria",
            header: "Subcategoria",
            cell: ({ getValue }) => (
                <h3 className="font-medium text-gray-700">
                    {getValue<string>()}
                </h3>
            )
        },
        {
            accessorFn: row => row.categoria?.categoria,
            id: "categoria",
            header: "Categoria",
            cell: ({ getValue, row }) => {
                const value = getValue<string>()
                const id = row.original.categoria?.id
                return (
                    <div>
                        <h3 className={`${value ? "font-medium text-gray-700" : "italic text-gray-400"}`}>
                            {formatCell(value)}
                        </h3>
                        {
                            id && (
                                <span className="text-xs text-muted-foreground font-mono">ID: {id}</span>
                            )
                        }
                    </div>
                )
            }
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
                            onClick={() => handleEditSubcategory(id)}
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
    ], [handleEditSubcategory, handleOpenDeleteAlert]);

    const table = useReactTable<Subcategory>({
        data: subcategoriesData?.data || [],
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
                                Subcategorías
                            </h1>
                            <p className="text-sm text-gray-500">Subcategorías de los productos</p>
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
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Subcategoría</Label>
                                <div className="flex w-full relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar subcategoria..."
                                        value={filters.subcategoria}
                                        onChange={handleSearchChange}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Categoria</Label>
                                <ComboboxSelect
                                    value={filters.categoria}
                                    onChange={(value) => {
                                        const parsedValue = value === "all" ? undefined : Number(value);
                                        updateFilter("categoria", parsedValue);
                                    }}
                                    options={(categoriesData || []).map((cat) => ({
                                        id: String(cat.id),
                                        categoria: cat.categoria,
                                    }))}
                                    optionTag={"categoria"}
                                    enableAllOption={true}
                                    isLoadingData={isLoadingCategoriesData}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end w-full items-end">
                            <TooltipButton
                                onClick={handleRefetchSubcategoriesData}
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
                            <Layers className="size-5 text-gray-700" />
                            Gestionar Subcategorías
                        </CardTitle>
                        <CardDescription className="text-sm">
                            {totalRecords} elemento{totalRecords !== 1 ? "s" : ""} registrado
                            {totalRecords !== 1 ? "s" : ""}
                        </CardDescription>
                    </div>
                    <SubcategoryFormDialog
                        isOpen={isDialogOpen}
                        onOpenChange={handleDialogToggle}
                        isEditing={isEditing}
                        editingId={editingId}
                        categories={categoriesData || []}
                        isLoadingCategories={isLoadingCategoriesData}
                    />
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg border-gray-200">
                        <CustomizableTable
                            table={table}
                            isLoading={isLoadingSubcategoriesData}
                            isError={isErrorSubcategoriesData}
                            isFetching={isFetchingSubcategoriesData}
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
                title="Eliminar subcategoria"
                message={`¿Estás seguro de que deseas eliminar la subcategoria #${itemToDelete}?`}
                onClose={handleCloseDeleteAlert}
                onConfirm={handleConfirmDeleteAlert}
                isLoading={isDeleting}
            />
        </main>
    );
}
export default SubcategoriessScreen;