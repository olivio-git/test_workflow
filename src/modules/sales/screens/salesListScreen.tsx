import { useBranchStore } from "@/states/branchStore";
import { useSalesPaginated } from "../hooks/useSalesPaginated";
import { useSalesFilters } from "../hooks/useSalesFilters";
import { useEffect, useState } from "react";
import { Filter, RefreshCcw, Search } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { useDebounce } from "use-debounce";
import { Switch } from "@/components/atoms/switch";
import { Label } from "@/components/atoms/label";
import TooltipButton from "@/components/common/TooltipButton";
import { Button } from "@/components/atoms/button";
import SalesFiltersComponent from "../components/salesFilterComponent";
import { Separator } from "@/components/atoms/separator";
import type { SaleGetAll } from "../types/salesGetResponse";
import SalesListTable from "../components/salesListTable";
import ConfirmationModal from "@/components/common/confirmationModal";
import { useDeleteSale } from "../hooks/useDeleteSale";
import useConfirmMutation from "@/hooks/useConfirmMutation";
import { showErrorToast, showSuccessToast } from "@/hooks/use-toast-enhanced";

const SalesListScreen = () => {
    const { selectedBranchId } = useBranchStore()
    const [searchKeywords, setSearchKeywords] = useState("");
    const [debouncedSearchKeywords] = useDebounce(searchKeywords, 500);
    const [isInfiniteScroll, setIsInfiniteScroll] = useState<boolean>(false)
    const [showFilters, setShowFilters] = useState<boolean>(true)
    const [sales, setSales] = useState<SaleGetAll[]>([]);

    const {
        filters,
        updateFilter,
        setPage,
        resetFilters,
    } = useSalesFilters(Number(selectedBranchId) || 1)

    const {
        data: salesData,
        isLoading,
        error,
        isFetching,
        isError,
        refetch: refetchSales,
        isRefetching: isRefetchingSales,
    } = useSalesPaginated(filters)

    useEffect(() => {
        if (!salesData?.data || error || isFetching) return;

        if (isInfiniteScroll && filters.pagina && filters.pagina > 1) {
            setSales((prev) => {
                // Evitar duplicados
                const newSales = salesData.data.filter(
                    newSale => !prev.some(existingSale => existingSale.id === newSale.id)
                );
                return [...prev, ...newSales];
            });
        } else {
            setSales(salesData.data);
        }
    }, [salesData?.data, isInfiniteScroll, filters.pagina, error, isFetching]);

    const handleResetFilters = () => {
        resetFilters()
        setSearchKeywords("")
    }

    const handleDeleteSuccess = (_data: unknown, saleId: number) => {
        showSuccessToast({
            title: "Venta eliminada",
            description: `La venta #${saleId} se eliminó exitosamente`,
            duration: 5000
        })
    };

    const handleDeleteError = (_error: unknown, saleId: number) => {
        showErrorToast({
            title: "Error al eliminar venta",
            description: `No se pudo eliminar la venta #${saleId}. Por favor, intenta nuevamente`,
            duration: 5000
        })
    };

    const {
        mutate: deleteSale,
        isPending: isDeleting
    } = useDeleteSale()

    const {
        close: handleCloseDeleteAlert,
        confirm: handleConfirmDeleteAlert,
        isOpen: showDeleteAlert,
        open: handleOpenDeleteAlert,
        variables: saleToDelete
    } = useConfirmMutation(deleteSale, handleDeleteSuccess, handleDeleteError)

    useEffect(() => {
        updateFilter("keywords", debouncedSearchKeywords);
    }, [debouncedSearchKeywords, updateFilter]);

    const handleRefetchSales = () => {
        refetchSales();
    }

    const toggleShowFilters = () => {
        setShowFilters(!showFilters)
    }

    return (
        <main className="min-h-screen space-y-2">
            <header className="bg-white rounded-lg p-2 space-y-2 border border-gray-200">
                <h1 className="text-lg font-bold text-gray-900">Ventas</h1>
                <section className="flex items-center justify-between gap-2 md:gap-4 flex-wrap">
                    <div className="flex items-center gap-2 md:gap-4 grow">

                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Buscar por palabras clave..."
                                value={searchKeywords}
                                onChange={(e) => setSearchKeywords(e.target.value)}
                                className="pl-10 w-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="infinite-scroll"
                                checked={isInfiniteScroll}
                                onCheckedChange={(checked) => {
                                    setIsInfiniteScroll(checked)
                                    setPage(1)
                                }}
                            />
                            <Label htmlFor="infinite-scroll">
                                Scroll Infinito
                            </Label>
                        </div>

                        <TooltipButton
                            onClick={handleRefetchSales}
                            buttonProps={{
                                className: 'w-8',
                                disabled: isRefetchingSales || isFetching,
                            }}
                            tooltip={"Recargar ventas"}
                        >
                            <RefreshCcw className={`size-4 ${isRefetchingSales || isFetching ? 'animate-spin' : ''}`} />
                        </TooltipButton>

                        <Button variant="outline" size="sm" onClick={handleResetFilters}>
                            <Filter className="h-4 w-4" />
                            Limpiar Filtros
                        </Button>
                        <Button size={'sm'} onClick={toggleShowFilters}>
                            {
                                showFilters ?
                                    "Ocultar filtros" :
                                    "Mostrar filtros"
                            }
                        </Button>
                    </div>
                </section>
                {/* Búsquedas individuales */}
                {
                    showFilters && (
                        <>
                            <Separator />
                            <SalesFiltersComponent
                                filters={filters}
                                updateFilter={updateFilter}
                            />
                        </>
                    )
                }
            </header>

            <div className="bg-white rounded-lg border border-gray-200 space-y-2">
                <SalesListTable
                    data={salesData || { data: [], meta: null, links: null }}
                    filters={filters}
                    isError={isError}
                    isFetching={isFetching}
                    isInfiniteScroll={isInfiniteScroll}
                    isLoading={isLoading}
                    sales={sales}
                    setPage={setPage}
                    updateFilter={updateFilter}
                    handleDeleteSale={handleOpenDeleteAlert}
                />
            </div>
            <ConfirmationModal
                isOpen={showDeleteAlert}
                title="Eliminar venta"
                message={`¿Estás seguro de que deseas eliminar la venta #${saleToDelete}?`}
                onClose={handleCloseDeleteAlert}
                onConfirm={handleConfirmDeleteAlert}
                isLoading={isDeleting}
            />
        </main>
    );
}

export default SalesListScreen;