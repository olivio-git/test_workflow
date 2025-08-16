import { useBranchStore } from "@/states/branchStore";
import { useSalesPaginated } from "../hooks/useSalesPaginated";
import { useSalesFilters } from "../hooks/useSalesFilters";
import { useEffect } from "react";

const SalesListScreen = () => {
    const { selectedBranchId } = useBranchStore()

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
        console.log(salesData)
    }, [salesData])
    return (
        <main className="min-h-screen">
            <header className="bg-white rounded-lg shadow-sm">
            </header>
        </main>
    );
}

export default SalesListScreen;