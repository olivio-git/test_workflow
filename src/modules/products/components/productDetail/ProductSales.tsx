import { Badge } from "@/components/atoms/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { TabsContent } from "@/components/atoms/tabs";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import type { ProductSalesItem, ProductSalesStats } from "../../types/ProductSalesStats";
import CustomizableTable from "@/components/common/CustomizableTable";
import { TableCell, TableRow } from "@/components/atoms/table";

interface ProductSalesProps {
    gestion_1: number;
    gestion_2: number;
    productSalesData: ProductSalesStats
}
const ProductSales: React.FC<ProductSalesProps> = ({
    gestion_1,
    gestion_2,
    productSalesData
}) => {
    // Calcular totales y métricas
    const totalVentasActual = productSalesData?.data.reduce((sum, venta) => sum + venta.gestion_2, 0) ?? 0
    const totalVentasAnterior = productSalesData?.data.reduce((sum, venta) => sum + venta.gestion_1, 0) ?? 0
    const diferenciaTotalVentas = (totalVentasActual ?? 0) - (totalVentasAnterior ?? 0) || 0
    const columns: ColumnDef<ProductSalesItem>[] = [
        {
            accessorKey: "mes",
            header: "Mes",
            enableHiding: false,
        },
        {
            accessorKey: "gestion_1",
            header: `Gestion ${gestion_1}`,
        },
        {
            accessorKey: "gestion_2",
            header: `Gestion ${gestion_2}`,
        },
        {
            id: "diferencia",
            header: "Diferencia",
            cell: ({ row }) => {
                const diferencia = row.original.gestion_2 - row.original.gestion_1;
                return (
                    <div className="flex items-center justify-center">
                        {diferencia >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                        ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-600" />
                        )}
                        <Badge variant={diferencia >= 0 ? "default" : "destructive"}>
                            {Math.abs(diferencia)}
                        </Badge>
                    </div>
                )
            }
        },
        {
            id: "porcentaje_cambio",
            header: "% Cambio",
            cell: ({ row }) => {
                const porcentajeCambio = row.original.gestion_1 > 0 ? ((row.original.gestion_2 - row.original.gestion_1) / row.original.gestion_1 * 100) : 0.00;
                return (
                    <div className="flex items-center justify-end gap-1">
                        <Badge
                            variant={porcentajeCambio >= 0 ? "default" : "destructive"}
                            className="font-semibold"
                        >
                            {porcentajeCambio >= 0 ? "+" : ""}
                            {porcentajeCambio.toFixed(2)}%
                        </Badge>
                    </div>
                )
            }
        },
    ];

    const table = useReactTable<ProductSalesItem>({
        data: productSalesData.data,
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
                        <CustomizableTable
                            table={table}
                            renderBottomRow={() => (
                                <TableRow className="bg-gray-50 font-bold">
                                    <TableCell className="font-bold p-1">TOTAL</TableCell>
                                    <TableCell className="font-bold p-1 text-gray-900">
                                        {totalVentasAnterior.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="font-bold p-1  text-gray-600">
                                        {totalVentasActual.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-1 p-1">
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
                                    <TableCell className="text-right p-1">
                                        <Badge variant={diferenciaTotalVentas >= 0 ? "default" : "destructive"} className="font-bold">
                                            {diferenciaTotalVentas >= 0 ? "+" : ""}
                                            {totalVentasAnterior > 0
                                                ? ((diferenciaTotalVentas / totalVentasAnterior) * 100).toFixed(2)
                                                : 0.00}
                                            %
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}

export default ProductSales;