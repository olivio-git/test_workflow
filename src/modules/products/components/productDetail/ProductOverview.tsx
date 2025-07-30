import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { TabsContent } from "@/components/atoms/tabs";
import { Calendar, ImageIcon, ShoppingCart } from "lucide-react";
import type { ProductStock } from "../../types/productStock";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/atoms/badge";
import CustomizableTable from "@/components/common/CustomizableTable";
import { format } from "date-fns";

interface ProductOverviewProps {
    productStockData: ProductStock[],
    isLoading: boolean;
    isFetching: boolean
    isError: boolean,
}
const ProductOverview: React.FC<ProductOverviewProps> = ({
    productStockData,
    isError,
    isFetching,
    isLoading,
}) => {
    const imagenProducto = null
    const compraReciente = productStockData.length > 0
        ? productStockData.reduce((latest, current) => {
            const fechaActual = new Date(current.fecha_adquisicion);
            const fechaLatest = new Date(latest.fecha_adquisicion);
            return fechaActual > fechaLatest ? current : latest;
        })
        : undefined;

    const stockTotal = productStockData.reduce((total, item) => {
        return total + item.saldo;
    }, 0);

    const columns: ColumnDef<ProductStock>[] = [
        {
            accessorKey: "fecha_adquisicion",
            header: "Fecha Entrada",
            enableHiding: false,
            cell: ({ getValue }) => {
                const rawFecha = getValue() as string;

                if (!rawFecha) return <span className="text-gray-400">Sin fecha</span>;

                const fecha = new Date(rawFecha);
                const fechaFormatted = format(fecha, "dd-MM-yyyy");

                return (
                    <div className="flex flex-col gap-1">
                        <span className="font-medium">{fechaFormatted}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "costo",
            header: `Costo`,
            cell: ({ getValue }) => {
                const value = getValue<number>();
                return (
                    <div className="text-end">
                        ${value.toFixed(2)}
                    </div>
                );
            }
        },
        {
            accessorKey: "cantidad",
            header: `Cantidad`,
            cell: ({ getValue }) => {
                const value = getValue<number>();
                return (
                    <div className="text-end">
                        {value}
                    </div>
                );
            }
        },
        {
            accessorKey: "precio_venta",
            header: `Precio Venta F.`,
            cell: ({ getValue }) => {
                const value = getValue<number>();
                return (
                    <div className="text-end">
                        ${value.toFixed(2)}
                    </div>
                );
            }
        },
        {
            accessorKey: "precio_venta_alt",
            header: `Precio Venta Alt.`,
            cell: ({ getValue }) => {
                const value = getValue<number>();
                return (
                    <div className="text-end">
                        ${value.toFixed(2)}
                    </div>
                );
            }
        },
        {
            accessorKey: "saldo",
            header: "Stock",
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Badge
                        variant={
                            row.original.saldo > 30 ? "default" : row.original.saldo > 10 ? "secondary" : "destructive"
                        }
                        className="font-semibold"
                    >
                        {row.original.saldo}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "tipo",
            header: "Tipo",
            cell: ({ getValue }) => (
                <div className="flex items-center justify-center">
                    <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                        {getValue<number>()}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "fecha_actualizacion",
            header: "Fecha Mod Precio",
            cell: ({ getValue }) => {
                const rawFecha = getValue() as string;

                if (!rawFecha) return <span className="text-gray-400">Sin fecha</span>;

                const fecha = new Date(rawFecha);
                const fechaFormatted = format(fecha, "dd-MM-yyyy");

                return (
                    <span className="text-gray-400">{fechaFormatted}</span>
                );
            },
        },
    ];

    const table = useReactTable<ProductStock>({
        data: productStockData,
        columns,
        state: {
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
        enableColumnResizing: true,
        enableRowSelection: true,
    })
    return (
        <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Content */}
                <div className={`lg:${compraReciente ? 'col-span-3' : 'col-span-2'} space-y-4`}>
                    <div className={`grid grid-cols-1 ${compraReciente ? 'md:grid-cols-5' : ''} gap-4`}>
                        {/* Compra más reciente - Diseño simple */}
                        {
                            compraReciente && (
                                <>
                                    <Card className="bg-white border border-gray-200 col-span-3 xl:col-span-4">
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
                                                    <p className="text-lg font-semibold text-gray-900">{compraReciente.cantidad}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Fecha</label>

                                                    <p className="text-lg font-semibold text-gray-900">{compraReciente.fecha_adquisicion ? format(compraReciente.fecha_adquisicion, "dd-MM-yyyy") : 'Sin fecha'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Costo</label>
                                                    <p className="text-lg font-semibold text-gray-900">${compraReciente.costo.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Precio de Venta F.</label>
                                                    <p className="text-lg font-semibold text-gray-900">${compraReciente.precio_venta.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Precio de Venta S.F.</label>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        ${compraReciente.precio_venta_alt.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Fecha Actualización</label>
                                                    <p className={` ${compraReciente.fecha_actualizacion ? 'text-lg font-semibold text-gray-900' : 'italic text-sm text-gray-500'}`}>{compraReciente.fecha_actualizacion ? format(compraReciente.fecha_actualizacion, "dd-MM-yyyy") : 'Sin fecha'}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <div className="aspect-square xl:aspect-auto bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 h-full col-span-2 xl:col-span-1">
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
                                </>
                            )
                        }
                    </div>


                    {/* Stock Sucursal actual - Con todos los datos */}
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
                                <CustomizableTable
                                    table={table}
                                    isError={isError}
                                    isFetching={isFetching}
                                    isLoading={isLoading}
                                    errorMessage="Ocurrió un error al cargar los productos"
                                    noDataMessage="No se encontraron productos"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                {
                    !compraReciente && (
                        <div className="space-y-4">
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
                    )
                }
            </div>
        </TabsContent>
    );
}

export default ProductOverview;