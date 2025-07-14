import { useState } from "react"
import {
    Package,
    Building2,
    ShoppingCart,
    TrendingUp,
    Truck,
    Calendar,
    BarChart3,
    ImageIcon,
    MapPin,
    ArrowUpRight,
    ArrowDownRight,
    Box,
    Activity,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs"
import { Button } from "@/components/atoms/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/table"
import { Badge } from "@/components/atoms/badge"

// Interfaces TypeScript
interface CompraDisponible {
    fechaEntrada: string
    cantidad: number
    costo: number
    precioVentaF: number
    precioVentaAlt: number
    stock: number
    tipo: string
    fechaModPrecio: string
}

interface DetalleSucursal {
    fecha: string
    stock: number
    costo: number
    precioVenta: number
    precioVentaAlt: number
    sucursal: string
}

interface CompraReciente {
    cantidad: number
    fecha: string
    costoCompra: number
    precioVentaF: number
    precioVentaSF: number
    fechaActualizacion: string
}

interface VentaAnual {
    mes: string
    anoActual: number
    anoAnterior: number
}

interface EnTransito {
    fechaLlegada: string
    cantidad: number
    costo: number
    nroPedido: string
}

interface ProductDetailsPanelProps {
    nombreProducto?: string
    comprasDisponibles?: CompraDisponible[]
    detallesSucursales?: DetalleSucursal[]
    compraReciente?: CompraReciente
    ventasAnuales?: VentaAnual[]
    enTransito?: EnTransito[]
    imagenProducto?: string
}

// Datos de ejemplo
const datosEjemplo: Required<Omit<ProductDetailsPanelProps, "nombreProducto" | "imagenProducto">> = {
    comprasDisponibles: [
        {
            fechaEntrada: "2024-01-15",
            cantidad: 50,
            costo: 25.5,
            precioVentaF: 35.0,
            precioVentaAlt: 32.0,
            stock: 45,
            tipo: "Compra Directa",
            fechaModPrecio: "2024-01-20",
        },
        {
            fechaEntrada: "2024-02-10",
            cantidad: 30,
            costo: 26.0,
            precioVentaF: 36.0,
            precioVentaAlt: 33.0,
            stock: 28,
            tipo: "Importación",
            fechaModPrecio: "2024-02-15",
        },
        {
            fechaEntrada: "2024-03-05",
            cantidad: 75,
            costo: 24.8,
            precioVentaF: 34.5,
            precioVentaAlt: 31.5,
            stock: 68,
            tipo: "Compra Directa",
            fechaModPrecio: "2024-03-10",
        },
    ],
    detallesSucursales: [
        {
            fecha: "2024-03-01",
            stock: 15,
            costo: 25.5,
            precioVenta: 35.0,
            precioVentaAlt: 32.0,
            sucursal: "T01",
        },
        {
            fecha: "2024-03-01",
            stock: 22,
            costo: 25.5,
            precioVenta: 35.0,
            precioVentaAlt: 32.0,
            sucursal: "T02",
        },
        {
            fecha: "2024-03-01",
            stock: 8,
            costo: 25.5,
            precioVenta: 35.0,
            precioVentaAlt: 32.0,
            sucursal: "T03",
        },
    ],
    compraReciente: {
        cantidad: 75,
        fecha: "2024-03-05",
        costoCompra: 24.8,
        precioVentaF: 34.5,
        precioVentaSF: 31.5,
        fechaActualizacion: "2024-03-10",
    },
    ventasAnuales: [
        { mes: "ENERO", anoActual: 120, anoAnterior: 95 },
        { mes: "FEBRERO", anoActual: 135, anoAnterior: 110 },
        { mes: "MARZO", anoActual: 98, anoAnterior: 88 },
        { mes: "ABRIL", anoActual: 156, anoAnterior: 142 },
        { mes: "MAYO", anoActual: 178, anoAnterior: 165 },
        { mes: "JUNIO", anoActual: 145, anoAnterior: 132 },
        { mes: "JULIO", anoActual: 167, anoAnterior: 155 },
        { mes: "AGOSTO", anoActual: 189, anoAnterior: 178 },
        { mes: "SEPTIEMBRE", anoActual: 134, anoAnterior: 125 },
        { mes: "OCTUBRE", anoActual: 156, anoAnterior: 148 },
        { mes: "NOVIEMBRE", anoActual: 178, anoAnterior: 165 },
        { mes: "DICIEMBRE", anoActual: 198, anoAnterior: 185 },
    ],
    enTransito: [
        {
            fechaLlegada: "2024-03-25",
            cantidad: 40,
            costo: 25.2,
            nroPedido: "PED-2024-001",
        },
        {
            fechaLlegada: "2024-04-10",
            cantidad: 60,
            costo: 24.9,
            nroPedido: "PED-2024-002",
        },
    ],
}

const ProductDetailScreen: React.FC<ProductDetailsPanelProps> = ({
    nombreProducto = "VÁLVULA DE ESCAPE TOYOTA 3K/4K/5K/7K 29X8X100",
    comprasDisponibles = datosEjemplo.comprasDisponibles,
    detallesSucursales = datosEjemplo.detallesSucursales,
    compraReciente = datosEjemplo.compraReciente,
    ventasAnuales = datosEjemplo.ventasAnuales,
    enTransito = datosEjemplo.enTransito,
    imagenProducto,
}) => {
    const [sucursalActiva, setSucursalActiva] = useState("T01")

    // Calcular totales y métricas
    const totalVentasActual = ventasAnuales.reduce((sum, venta) => sum + venta.anoActual, 0)
    const totalVentasAnterior = ventasAnuales.reduce((sum, venta) => sum + venta.anoAnterior, 0)
    const diferenciaTotalVentas = totalVentasActual - totalVentasAnterior
    const stockTotal = comprasDisponibles.reduce((sum, compra) => sum + compra.stock, 0)

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Simple - Solo nombre del producto */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-6">
                        <div className="p-2 bg-gray-900 rounded-lg">
                            <Package className="size-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{nombreProducto}</h1>
                            <p className="text-gray-600 text-base">Información completa del producto</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <Tabs defaultValue="overview" className="space-y-8">
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
                    <TabsContent value="overview" className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Compra más reciente - Diseño simple */}
                                <Card className="bg-white border border-gray-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                                            <Calendar className="h-5 w-5 text-gray-700" />
                                            Compra Más Reciente (con saldo)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Cantidad</label>
                                                <p className="text-2xl font-semibold text-gray-900">{compraReciente.cantidad}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Fecha</label>
                                                <p className="text-lg font-semibold text-gray-900">{compraReciente.fecha}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Costo de Compra</label>
                                                <p className="text-xl font-semibold text-gray-900">${compraReciente.costoCompra.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Precio de Venta F.</label>
                                                <p className="text-xl font-semibold text-gray-900">${compraReciente.precioVentaF.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Precio de Venta S.F.</label>
                                                <p className="text-xl font-semibold text-gray-900">
                                                    ${compraReciente.precioVentaSF.toFixed(2)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Fecha Actualización</label>
                                                <p className="text-lg font-semibold text-gray-900">{compraReciente.fechaActualizacion}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Stock por Sucursal - Con todos los datos */}
                                <Card className="bg-white border border-gray-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                                            <Building2 className="h-5 w-5 text-gray-700" />
                                            Detalle disponibles en otras sucursales
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <Table className="w-full table-auto">
                                                <TableHeader>
                                                    <TableRow className="border-gray-200">
                                                        <TableHead className="font-semibold text-gray-700">Fecha</TableHead>
                                                        <TableHead className="font-semibold text-gray-700">Stock</TableHead>
                                                        <TableHead className="font-semibold text-gray-700">Costo</TableHead>
                                                        <TableHead className="font-semibold text-gray-700">Precio Venta</TableHead>
                                                        <TableHead className="font-semibold text-gray-700">Precio Venta Alt</TableHead>
                                                        <TableHead className="font-semibold text-gray-700">Sucursal</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {detallesSucursales.map((detalle, index) => (
                                                        <TableRow key={index} className="hover:bg-gray-50 transition-colors border-gray-200">
                                                            <TableCell className="font-medium">{detalle.fecha}</TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant={
                                                                        detalle.stock > 15 ? "default" : detalle.stock > 5 ? "secondary" : "destructive"
                                                                    }
                                                                    className="font-semibold"
                                                                >
                                                                    {detalle.stock}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="font-semibold text-gray-900">${detalle.costo.toFixed(2)}</TableCell>
                                                            <TableCell className="font-semibold text-gray-900">
                                                                ${detalle.precioVenta.toFixed(2)}
                                                            </TableCell>
                                                            <TableCell className="font-semibold text-gray-900">
                                                                ${detalle.precioVentaAlt.toFixed(2)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant={detalle.sucursal === sucursalActiva ? "default" : "outline"}
                                                                    className="font-semibold"
                                                                >
                                                                    {detalle.sucursal}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">
                                {/* Product Image */}
                                <Card className="bg-white border border-gray-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-lg">
                                            <ImageIcon className="h-5 w-5 text-gray-700" />
                                            Imagen del Producto
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                            {imagenProducto ? (
                                                <img
                                                    src={imagenProducto || "/placeholder.svg"}
                                                    alt="Producto"
                                                    className="max-w-full max-h-full object-contain rounded-lg"
                                                />
                                            ) : (
                                                <div className="text-center p-8">
                                                    <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                    <p className="text-gray-500 font-medium">Sin imagen</p>
                                                    <p className="text-sm text-gray-400 mt-1">Disponible próximamente</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Inventory Tab */}
                    <TabsContent value="inventory" className="space-y-8">
                        <Card className="bg-white border border-gray-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                                    <ShoppingCart className="h-5 w-5 text-gray-700" />
                                    Compras Disponibles
                                    <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-700">
                                        Stock Total: {stockTotal}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-200">
                                                <TableHead className="font-semibold text-gray-700">Fecha Entrada</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Cantidad</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Costo</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Precio Venta F.</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Precio Venta Alt.</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Stock</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Fecha Mod Precio</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {comprasDisponibles.map((compra, index) => (
                                                <TableRow key={index} className="hover:bg-gray-50 transition-colors border-gray-200">
                                                    <TableCell className="font-medium">{compra.fechaEntrada}</TableCell>
                                                    <TableCell className="font-semibold">{compra.cantidad}</TableCell>
                                                    <TableCell className="font-semibold text-gray-900">${compra.costo.toFixed(2)}</TableCell>
                                                    <TableCell className="font-semibold text-gray-900">
                                                        ${compra.precioVentaF.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-gray-900">
                                                        ${compra.precioVentaAlt.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={compra.stock > 30 ? "default" : compra.stock > 10 ? "secondary" : "destructive"}
                                                            className="font-semibold"
                                                        >
                                                            {compra.stock}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                                                            {compra.tipo}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-600">{compra.fechaModPrecio}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Sales Tab */}
                    <TabsContent value="sales" className="space-y-8">
                        <Card className="bg-white border border-gray-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                                    <TrendingUp className="h-5 w-5 text-gray-700" />
                                    Análisis de Ventas Anuales
                                    <Badge variant={diferenciaTotalVentas >= 0 ? "default" : "destructive"} className="ml-auto">
                                        {diferenciaTotalVentas >= 0 ? "+" : ""}
                                        {diferenciaTotalVentas} vs año anterior
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-200">
                                                <TableHead className="font-semibold text-gray-700">Mes</TableHead>
                                                <TableHead className="text-right font-semibold text-gray-700">Año Actual</TableHead>
                                                <TableHead className="text-right font-semibold text-gray-700">Año Anterior</TableHead>
                                                <TableHead className="text-right font-semibold text-gray-700">Diferencia</TableHead>
                                                <TableHead className="text-right font-semibold text-gray-700">% Cambio</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ventasAnuales.map((venta, index) => {
                                                const diferencia = venta.anoActual - venta.anoAnterior
                                                const porcentajeCambio =
                                                    venta.anoAnterior > 0 ? ((diferencia / venta.anoAnterior) * 100).toFixed(1) : "0.0"

                                                return (
                                                    <TableRow key={index} className="hover:bg-gray-50 transition-colors border-gray-200">
                                                        <TableCell className="font-medium">{venta.mes}</TableCell>
                                                        <TableCell className="text-right font-semibold text-gray-900">
                                                            {venta.anoActual.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold text-gray-600">
                                                            {venta.anoAnterior.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                {diferencia >= 0 ? (
                                                                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                                                                ) : (
                                                                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                                                                )}
                                                                <Badge variant={diferencia >= 0 ? "default" : "destructive"}>
                                                                    {Math.abs(diferencia)}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge
                                                                variant={Number.parseFloat(porcentajeCambio) >= 0 ? "default" : "destructive"}
                                                                className="font-semibold"
                                                            >
                                                                {Number.parseFloat(porcentajeCambio) >= 0 ? "+" : ""}
                                                                {porcentajeCambio}%
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                            <TableRow className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                                                <TableCell className="font-bold text-lg">TOTAL</TableCell>
                                                <TableCell className="text-right font-bold text-lg text-gray-900">
                                                    {totalVentasActual.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-lg text-gray-600">
                                                    {totalVentasAnterior.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {diferenciaTotalVentas >= 0 ? (
                                                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                                                        )}
                                                        <Badge
                                                            variant={diferenciaTotalVentas >= 0 ? "default" : "destructive"}
                                                            className="font-bold"
                                                        >
                                                            {Math.abs(diferenciaTotalVentas)}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={diferenciaTotalVentas >= 0 ? "default" : "destructive"} className="font-bold">
                                                        {diferenciaTotalVentas >= 0 ? "+" : ""}
                                                        {totalVentasAnterior > 0
                                                            ? ((diferenciaTotalVentas / totalVentasAnterior) * 100).toFixed(1)
                                                            : "0.0"}
                                                        %
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Logistics Tab */}
                    <TabsContent value="logistics" className="space-y-8">
                        <Card className="bg-white border border-gray-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                                    <Truck className="h-5 w-5 text-gray-700" />
                                    Productos en Tránsito
                                    <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-700">
                                        {enTransito.length} pedidos activos
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-200">
                                                <TableHead className="font-semibold text-gray-700">Fecha de Llegada</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Cantidad</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Costo</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Nro Pedido</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {enTransito.map((item, index) => {
                                                const fechaLlegada = new Date(item.fechaLlegada)
                                                const hoy = new Date()
                                                const diasRestantes = Math.ceil((fechaLlegada.getTime() - hoy.getTime()) / (1000 * 3600 * 24))

                                                return (
                                                    <TableRow key={index} className="hover:bg-gray-50 transition-colors border-gray-200">
                                                        <TableCell className="font-medium">{item.fechaLlegada}</TableCell>
                                                        <TableCell className="font-semibold">{item.cantidad}</TableCell>
                                                        <TableCell className="font-semibold text-gray-900">${item.costo.toFixed(2)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="font-mono">
                                                                {item.nroPedido}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    diasRestantes > 7 ? "secondary" : diasRestantes > 0 ? "default" : "destructive"
                                                                }
                                                            >
                                                                {diasRestantes > 0 ? `${diasRestantes} días` : "Atrasado"}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default ProductDetailScreen;