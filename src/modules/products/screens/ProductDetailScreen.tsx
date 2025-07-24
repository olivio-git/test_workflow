import { useEffect, useState } from "react"
import {
    Package,
    Truck,
    BarChart3,
    MapPin,
    Box,
    Activity,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/atoms/tabs"
import { Button } from "@/components/atoms/button"
import { useParams } from "react-router"
import { useProductById } from "../hooks/useProductById"
import { useProductSalesStats } from "../hooks/useProductSalesStats"
import { useBranchStore } from "@/states/branchStore"
import { useProductStock } from "../hooks/useProductStock"
import ProductSales from "../components/productDetail/ProductSales"
import ProductOverview from "../components/productDetail/ProductOverview"
import ProductInventory from "../components/productDetail/ProductInventory"
import ProductLogistics from "../components/productDetail/ProductLogistics"
import { useProductProviderOrders } from "../hooks/useProductProviderOrders"
import ProductDetailSkeleton from "../components/productDetail/ProductDetailSkeleton"

const ProductDetailScreen = () => {
    const { id } = useParams()
    const { selectedBranchId } = useBranchStore()

    const [gestiones, setGestiones] = useState<{ gestion_1: number; gestion_2: number }>({
        gestion_1: new Date().getFullYear() - 1,
        gestion_2: new Date().getFullYear(),
    })
    const {
        data: product,
        isLoading: isLoadingProduct,
        // isError: isErrorProduct,
        // isFetching: isFetchingProduct
    } = useProductById(Number(id))

    const {
        data: twoYearSalesData,
        isLoading: isLoadingTwoYearSalesData,
        isError: isErrorTwoYearSalesData,
        isFetching: isFetchingTwoYearSalesData
    } = useProductSalesStats({
        producto: Number(id),
        sucursal: selectedBranchId ? Number(selectedBranchId) : 0,
        gestion_1: gestiones.gestion_1,
        gestion_2: gestiones.gestion_2,
    })

    const {
        data: productStockLocalData,
        isError: isErrorStockLocalData,
        isFetching: isFetchingStockLocalData,
        isLoading: isLoadingStockLocalData
    } = useProductStock({
        producto: Number(id),
        sucursal: selectedBranchId ? Number(selectedBranchId) : 0,
        resto_only: 0
    })

    const {
        data: productStockSucursalesData,
        isError: isErrorStockSucursalesData,
        isLoading: isLoadingStockSucursalesData,
    } = useProductStock({
        producto: Number(id),
        sucursal: selectedBranchId ? Number(selectedBranchId) : 0,
        resto_only: 1
    })

    const {
        data: productProviderOrders,
        isError: isErrorProviderOrders,
        isLoading: isLoadingProviderOrders,
    } = useProductProviderOrders({
        producto: Number(id),
        sucursal: selectedBranchId ? Number(selectedBranchId) : 0,
    })

    const [sucursalActiva, setSucursalActiva] = useState("T01")
    useEffect(() => {
        // console.log("Product data loaded:", product)
        console.log("Stovk Data:", twoYearSalesData)
    }, [twoYearSalesData, product])

    const handleChangeGestion1 = (value: string) => {
        setGestiones(prev => ({
            ...prev,
            gestion_1: parseInt(value)
        }))
    }
    const handleChangeGestion2 = (value: string) => {
        setGestiones(prev => ({
            ...prev,
            gestion_2: parseInt(value)
        }))
    }
    //     components/
    // │   └── detail/
    // │       ├── ProductOverview.tsx
    // │       ├── ProductInventory.tsx
    // │       ├── ProductSales.tsx
    // │       ├── ProductLogistics.tsx
    // │       ├── ProductHeader.tsx
    // │       └── ProductBranchSelector.tsx
    return (
        <>
            {
                isLoadingProduct ?
                    <ProductDetailSkeleton /> :
                    <div className="min-h-screen">
                        <div className="max-w-7xl mx-auto space-y-4">
                            {/* Header Simple - Solo nombre del producto */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center gap-6">
                                    <div className="p-2 bg-gray-900 rounded-lg">
                                        <Package className="size-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{product?.descripcion}</h1>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <Tabs defaultValue="overview" className="space-y-4">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                                    <TabsList className="bg-white border border-gray-200 gap-2">
                                        <TabsTrigger
                                            value="overview"
                                            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-lg px-6 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Activity className="h-4 w-4 mr-2" />
                                            Resumen
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="inventory"
                                            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-lg px-6 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Box className="h-4 w-4 mr-2" />
                                            Inventario
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="sales"
                                            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-lg px-6 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <BarChart3 className="h-4 w-4 mr-2" />
                                            Ventas
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="logistics"
                                            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-lg px-6 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Truck className="h-4 w-4 mr-2" />
                                            Logística
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Branch Selector */}
                                    <div className="flex items-center gap-2 bg-white rounded-md px-1 border border-gray-200">
                                        <MapPin className="h-4 w-4 text-gray-500 ml-2" />
                                        <span className="text-sm font-medium text-gray-700">Sucursal:</span>
                                        {["T01", "T02", "T03"].map((sucursal) => (
                                            <Button
                                                key={sucursal}
                                                variant={sucursalActiva === sucursal ? "default" : "ghost"}
                                                size="sm"
                                                className={`rounded-lg transition-all ${sucursalActiva === sucursal
                                                    ? "bg-gray-900 hover:bg-gray-800 text-white"
                                                    : "hover:bg-gray-100 text-gray-700"
                                                    }`}
                                                onClick={() => setSucursalActiva(sucursal)}
                                            >
                                                {sucursal}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Overview Tab */}
                                <ProductOverview
                                    productStockData={productStockLocalData ?? []}
                                    isError={isErrorStockLocalData}
                                    isFetching={isFetchingStockLocalData}
                                    isLoading={isLoadingStockLocalData}
                                />

                                {/* Inventory Tab */}
                                <ProductInventory
                                    productStockData={productStockSucursalesData ?? []}
                                    isErrorData={isErrorStockSucursalesData}
                                    isLoadingData={isLoadingStockSucursalesData}
                                />

                                {/* Sales Tab */}
                                {
                                    twoYearSalesData && (
                                        <ProductSales
                                            isLoadingData={isLoadingTwoYearSalesData}
                                            gestion_1={gestiones.gestion_1}
                                            gestion_2={gestiones.gestion_2}
                                            handleChangeGestion1={handleChangeGestion1}
                                            handleChangeGestion2={handleChangeGestion2}
                                            productSalesData={twoYearSalesData}
                                            isErrorData={isErrorTwoYearSalesData}
                                            isFetchingData={isFetchingTwoYearSalesData}
                                        />
                                    )
                                }

                                {/* Logistics Tab */}
                                <ProductLogistics
                                    ProductProviderOrders={productProviderOrders ?? []}
                                    isErrorData={isErrorProviderOrders}
                                    isLoadingData={isLoadingProviderOrders}
                                />
                            </Tabs>
                        </div>
                    </div>
            }
        </>
    )
}

export default ProductDetailScreen;