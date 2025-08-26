import { useBranchStore } from "@/states/branchStore";
import { useEffect, useState } from "react";
import { Filter, RefreshCcw, Search } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { useDebounce } from "use-debounce";
import { Switch } from "@/components/atoms/switch";
import { Label } from "@/components/atoms/label";
import TooltipButton from "@/components/common/TooltipButton";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import ConfirmationModal from "@/components/common/confirmationModal";
import useConfirmMutation from "@/hooks/useConfirmMutation";
import { showErrorToast, showSuccessToast } from "@/hooks/use-toast-enhanced";
import type { QuotationGetAll } from "../types/quotationGet.types";
import { useSalesFilters } from "@/modules/sales/hooks/useSalesFilters";
import { useQuotationsPaginated } from "../hooks/useQuotationsPaginated";
import QuotationsListTable from "../components/quotationList/quotationListTable";
import QuotationsFiltersComponent from "../components/quotationList/quotationFilterComponent";
import { useDeleteQuotation } from "../hooks/useDeleteQuotation";

const QuotationListScreen = () => {
    const { selectedBranchId } = useBranchStore()
    const [searchKeywords, setSearchKeywords] = useState("");
    const [debouncedSearchKeywords] = useDebounce(searchKeywords, 500);
    const [isInfiniteScroll, setIsInfiniteScroll] = useState<boolean>(false)
    const [showFilters, setShowFilters] = useState<boolean>(true)
    const [quotations, setQuotations] = useState<QuotationGetAll[]>([]);

    const {
        filters,
        updateFilter,
        setPage,
        resetFilters,
    } = useSalesFilters(Number(selectedBranchId) || 1)

    const {
        data: quotationData,
        isLoading,
        error,
        isFetching,
        isError,
        refetch: refetchQuotations,
        isRefetching: isRefetchingQuotations,
    } = useQuotationsPaginated(filters)

    useEffect(() => {
        if (!quotationData?.data || error || isFetching) return;

        if (isInfiniteScroll && filters.pagina && filters.pagina > 1) {
            setQuotations((prev) => {
                // Evitar duplicados
                const newQuotations = quotationData.data.filter(
                    newQuotation => !prev.some(existingQuotation => existingQuotation.id === newQuotation.id)
                );
                return [...prev, ...newQuotations];
            });
        } else {
            setQuotations(quotationData.data);
        }
    }, [quotationData?.data, isInfiniteScroll, filters.pagina, error, isFetching]);

    const handleResetFilters = () => {
        resetFilters()
        setSearchKeywords("")
    }

    const handleDeleteSuccess = (_data: unknown, quotationId: number) => {
        showSuccessToast({
            title: "Cotizacion eliminada",
            description: `La cotizacion #${quotationId} se eliminó exitosamente`,
            duration: 5000
        })
    };

    const handleDeleteError = (_error: unknown, quotationId: number) => {
        showErrorToast({
            title: "Error al eliminar cotizacion",
            description: `No se pudo eliminar la cotizacion #${quotationId}. Por favor, intenta nuevamente`,
            duration: 5000
        })
    };

    const {
        mutate: deleteQuotation,
        isPending: isDeleting
    } = useDeleteQuotation()

    const {
        close: handleCloseDeleteAlert,
        confirm: handleConfirmDeleteAlert,
        isOpen: showDeleteAlert,
        open: handleOpenDeleteAlert,
        variables: quotationToDelete
    } = useConfirmMutation(deleteQuotation, handleDeleteSuccess, handleDeleteError)

    useEffect(() => {
        updateFilter("keywords", debouncedSearchKeywords);
    }, [debouncedSearchKeywords, updateFilter]);

    const handleRefetchQuotations = () => {
        refetchQuotations();
    }

    const toggleShowFilters = () => {
        setShowFilters(!showFilters)
    }

    return (
        <main className="min-h-screen space-y-2">
            <header className="bg-white rounded-lg p-2 space-y-2 border border-gray-200">
                <h1 className="text-lg font-bold text-gray-900">Cotizaciones</h1>
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
                            onClick={handleRefetchQuotations}
                            buttonProps={{
                                className: 'w-8',
                                disabled: isRefetchingQuotations || isFetching,
                            }}
                            tooltip={"Recargar cotizaciones"}
                        >
                            <RefreshCcw className={`size-4 ${isRefetchingQuotations || isFetching ? 'animate-spin' : ''}`} />
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
                            <QuotationsFiltersComponent
                                filters={filters}
                                updateFilter={updateFilter}
                            />
                        </>
                    )
                }
            </header>

            <div className="bg-white rounded-lg border border-gray-200 space-y-2">
                <QuotationsListTable
                    data={quotationData || { data: [], meta: null, links: null }}
                    filters={filters}
                    isError={isError}
                    isFetching={isFetching}
                    isInfiniteScroll={isInfiniteScroll}
                    isLoading={isLoading}
                    quotations={quotations}
                    setPage={setPage}
                    updateFilter={updateFilter}
                    handleDeleteSale={handleOpenDeleteAlert}
                />
            </div>
            <ConfirmationModal
                isOpen={showDeleteAlert}
                title="Eliminar cotizacion"
                message={`¿Estás seguro de que deseas eliminar la cotizacion #${quotationToDelete}?`}
                onClose={handleCloseDeleteAlert}
                onConfirm={handleConfirmDeleteAlert}
                isLoading={isDeleting}
            />
        </main>
    );
}

export default QuotationListScreen;