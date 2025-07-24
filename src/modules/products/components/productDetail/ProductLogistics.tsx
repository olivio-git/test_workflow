import { Badge } from "@/components/atoms/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { TabsContent } from "@/components/atoms/tabs";
import { Truck } from "lucide-react";
import type { ProductProviderOrder } from "../../types/ProductProviderOrder";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import CustomizableTable from "@/components/common/CustomizableTable";

interface ProductLogisticsProps {
    ProductProviderOrders: ProductProviderOrder[]
    isLoadingData: boolean
    isErrorData: boolean
}
const ProductLogistics: React.FC<ProductLogisticsProps> = ({
    ProductProviderOrders,
    isErrorData,
    isLoadingData
}) => {
    const columns: ColumnDef<ProductProviderOrder>[] = [
        {
            accessorKey: "fecha_llegada",
            header: "Fecha de Llegada",
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
            accessorKey: "cantidad",
            header: `Cantidad`,
        },
        {
            accessorKey: "costo",
            header: `Costo`,
        },
        {
            accessorKey: "nro_pedido",
            header: "Nro Pedido",
            cell: ({ getValue }) => (
                <div className="flex items-center justify-center">
                    <Badge
                        variant={"outline"}
                        className="font-mono font-medium"
                    >
                        {getValue<string>()}
                    </Badge>
                </div>
            )
        },
    ];

    const table = useReactTable<ProductProviderOrder>({
        data: ProductProviderOrders,
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
        <TabsContent value="logistics" className="space-y-8">
            <Card className="bg-white border border-gray-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                        <Truck className="h-5 w-5 text-gray-700" />
                        Productos en Tránsito
                        <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-700">
                            {ProductProviderOrders.length} pedidos activos
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <CustomizableTable
                            table={table}
                            isLoading={isLoadingData}
                            isError={isErrorData}
                        />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}

export default ProductLogistics;