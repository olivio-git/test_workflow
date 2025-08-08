import { useEffect, useState } from "react"
import {
    Truck,
    BarChart3,
    MapPin,
    Box,
    Activity,
    ShoppingCart,
    CornerUpLeft,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/atoms/tabs"
import { Button } from "@/components/atoms/button"
import { useNavigate, useParams } from "react-router"
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
import ErrorDataComponent from "@/components/common/errorDataComponent"
import authSDK from "@/services/sdk-simple-auth"
import { useCartWithUtils } from "@/modules/shoppingCart/hooks/useCartWithUtils"
import { CartProductSchema } from "@/modules/shoppingCart/schemas/cartProduct.schema"
import { useProductsPaginated } from "../hooks/useProductsPaginated"
import TooltipButton from "@/components/common/TooltipButton"
import { Kbd } from "@/components/atoms/kbd"
import { useHotkeys } from "react-hotkeys-hook"

const ProductDetailScreen = () => {
    const navigate = useNavigate()
    const { id: productId } = useParams()
    const { selectedBranchId } = useBranchStore()
    const user = authSDK.getCurrentUser()

    const {
        addItemToCart
    } = useCartWithUtils(user?.name || '')

    const [gestiones, setGestiones] = useState<{ gestion_1: number; gestion_2: number }>({
        gestion_1: new Date().getFullYear() - 1,
        gestion_2: new Date().getFullYear(),
    })

    const {
        data: productForCart,
        // isLoading,
        // error,
        // isFetching,
        // isError,
    } = useProductsPaginated({
        producto: Number(productId),
        sucursal: Number(selectedBranchId),
        pagina_registros: 1,
        pagina: 1
    });

    const {
        data: product,
        isLoading: isLoadingProduct,
        isError: isErrorProduct,
        refetch: refetchProduct,
        // isFetching: isFetchingProduct
    } = useProductById(Number(productId))

    const {
        data: twoYearSalesData,
        isLoading: isLoadingTwoYearSalesData,
        isError: isErrorTwoYearSalesData,
        isFetching: isFetchingTwoYearSalesData
    } = useProductSalesStats({
        producto: Number(productId),
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
        producto: Number(productId),
        sucursal: selectedBranchId ? Number(selectedBranchId) : 0,
        resto_only: 0
    })

    const {
        data: productStockSucursalesData,
        isError: isErrorStockSucursalesData,
        isLoading: isLoadingStockSucursalesData,
    } = useProductStock({
        producto: Number(productId),
        sucursal: selectedBranchId ? Number(selectedBranchId) : 0,
        resto_only: 1
    })

    const {
        data: productProviderOrders,
        isError: isErrorProviderOrders,
        isLoading: isLoadingProviderOrders,
    } = useProductProviderOrders({
        producto: Number(productId),
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

    const handleAddItemCart = () => {
        const productTransform = CartProductSchema.parse(productForCart?.data[0])
        addItemToCart(productTransform);
    }

    const handleRetry = () => {
        refetchProduct()
    }

    const handleGoBack = () => {
        navigate('/dashboard/productos')
    }

    // Shortcuts
    useHotkeys('escape', handleGoBack, {
        scopes: ["esc-key"],
        enabled: true
    });
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
                                <div className="flex items-center gap-3">
                                    <TooltipButton
                                        onClick={handleGoBack}
                                        tooltip={<p>Presiona <Kbd>esc</Kbd> para volver a la lista de productos</p>}
                                        buttonProps={{
                                            variant: 'default',
                                        }}
                                    >
                                        <CornerUpLeft />
                                    </TooltipButton>
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
                                            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Activity className="h-4 w-4 mr-2" />
                                            Resumen
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="inventory"
                                            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Box className="h-4 w-4 mr-2" />
                                            Inventario
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="sales"
                                            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <BarChart3 className="h-4 w-4 mr-2" />
                                            Ventas
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="logistics"
                                            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Truck className="h-4 w-4 mr-2" />
                                            Logística
                                        </TabsTrigger>
                                    </TabsList>

                                    <div className="flex items-center gap-2">
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
                                        <Button
                                            size={'sm'}
                                            className="cursor-pointer"
                                            onClick={handleAddItemCart}
                                            autoFocus
                                        >
                                            <ShoppingCart className="size-4" />
                                            Agregar al carrito
                                        </Button>
                                    </div>
                                </div>

                                {
                                    isErrorProduct ? (
                                        <ErrorDataComponent
                                            errorMessage="No se pudo cargar el producto. Por favor, inténtalo de nuevo más tarde."
                                            onRetry={handleRetry}
                                        />
                                    ) : (
                                        <>
                                            {/* Overview Tab */}
                                            < ProductOverview
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
                                            <ProductSales
                                                isLoadingData={isLoadingTwoYearSalesData}
                                                gestion_1={gestiones.gestion_1}
                                                gestion_2={gestiones.gestion_2}
                                                handleChangeGestion1={handleChangeGestion1}
                                                handleChangeGestion2={handleChangeGestion2}
                                                productSalesData={twoYearSalesData ?? { meta: { getion_1: "", getion_2: "" }, data: [] }}
                                                isErrorData={isErrorTwoYearSalesData}
                                                isFetchingData={isFetchingTwoYearSalesData}
                                            />

                                            {/* Logistics Tab */}
                                            <ProductLogistics
                                                ProductProviderOrders={productProviderOrders ?? []}
                                                isErrorData={isErrorProviderOrders}
                                                isLoadingData={isLoadingProviderOrders}
                                            />
                                        </>
                                    )
                                }

                            </Tabs>
                        </div>
                    </div>
            }
        </>
    )
}

export default ProductDetailScreen;