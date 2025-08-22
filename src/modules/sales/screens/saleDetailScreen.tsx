import { useNavigate, useParams } from "react-router";
import { useSaleGetById } from "../hooks/useSaleGetById";
import ErrorDataComponent from "@/components/common/errorDataComponent";
import { useEffect, useMemo } from "react";
import TooltipButton from "@/components/common/TooltipButton";
import { Kbd } from "@/components/atoms/kbd";
import { Building2, Calendar, CornerUpLeft, Edit, FileText, Trash2, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import { formatCurrency, formatDate } from "@/utils/formaters";
import { Badge } from "@/components/atoms/badge";
import { formatCell } from "@/utils/formatCell";
import SaleProductsSection from "../components/saleDetail/SaleProducts";
import { useHotkeys } from "react-hotkeys-hook";

const SaleDetailScreen = () => {
    const navigate = useNavigate()
    const { id: saleId } = useParams()

    if (!(Number(saleId))) {
        return (
            <ErrorDataComponent
                errorMessage="No se pudo cargar la venta."
                showButtonIcon={false}
                buttonText="Ir a lista de ventas"
                onRetry={() => {
                    navigate("/dashboard/sales")
                }}
            />
        )
    }

    const {
        data: saleData,
        isLoading: isLoadingSale
    } = useSaleGetById(Number(saleId))

    useEffect(() => {
        console.log(saleData)
    }, [saleData])

    const getContextColor = (tipo: string) => {
        if (tipo === 'C') return 'warning'; // Credito
        if (tipo === 'P') return 'success'; // Pagado
        return 'secondary';
    };

    const totalVenta = useMemo(() => {
        if (!saleData?.detalles) return 0;

        return saleData.detalles.reduce((total, detalle) => {
            const subtotal = detalle.precio * detalle.cantidad;
            const descuento =
                detalle.porcentaje_descuento != null
                    ? (1 - detalle.porcentaje_descuento / 100)
                    : 1;

            return total + subtotal * descuento;
        }, 0);
    }, [saleData?.detalles]);


    const handleGoBack = () => {
        navigate('/dashboard/sales')
    }

    // Shortcuts
    useHotkeys('escape', handleGoBack, {
        scopes: ["esc-key"],
        enabled: true
    });

    return (
        <main className="flex flex-col items-center">
            <div className="max-w-7xl w-full space-y-2">
                <header className="border-gray-200 border bg-white rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TooltipButton
                                tooltipContentProps={{
                                    align: 'start'
                                }}
                                onClick={handleGoBack}
                                tooltip={<p className="flex gap-1">Presiona <Kbd>esc</Kbd> para volver a la lista de ventas</p>}
                                buttonProps={{
                                    variant: 'default',
                                }}
                            >
                                <CornerUpLeft />
                            </TooltipButton>
                            <div>
                                <h1 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                                    Venta {saleData?.nro}
                                </h1>
                                {saleData && (
                                    <p className="text-sm text-gray-600">
                                        {saleData.cliente ? `${saleData.cliente?.cliente} - ` : ''}
                                        {saleData.cantidad_detalles} {saleData.cantidad_detalles === 1 ? 'producto' : 'productos'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <TooltipButton
                                // onClick={handleEdit}
                                tooltip="Editar venta"
                                buttonProps={{
                                    variant: 'outline',
                                    size: 'sm'
                                }}
                            >
                                <Edit className="h-4 w-4" />
                                Editar
                            </TooltipButton>

                            <TooltipButton
                                // onClick={handleDelete}
                                tooltip="Eliminar venta"
                                buttonProps={{
                                    variant: 'destructive',
                                    size: 'sm'
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                Eliminar
                            </TooltipButton>
                        </div>
                    </div>
                </header>

                <Card className="bg-white border border-gray-200 shadow-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                            <FileText className="h-5 w-5 text-gray-700" />
                            Información General
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-base font-semibold text-gray-900">
                            <div>
                                <Label>Número de venta</Label>
                                <p className="font-bold">{saleData?.nro}</p>
                            </div>
                            <div>
                                <Label>Fecha</Label>
                                <p className="font-semibold flex items-center gap-2">
                                    <Calendar className="size-4 text-gray-600" />
                                    {formatDate(saleData?.fecha ?? '')}
                                </p>
                            </div>
                            <div>
                                <Label>Total</Label>
                                <br />
                                <Badge
                                    className="rounded font-bold text-base"
                                    variant={'success'}>
                                    {formatCurrency(totalVenta)}
                                </Badge>
                            </div>
                            <div>
                                <Label>Tipo de venta</Label>
                                <br />
                                <Badge
                                    variant={getContextColor(saleData?.tipo_venta ?? '')}
                                    className="rounded w-max"
                                >
                                    {saleData?.tipo_venta}
                                </Badge>
                            </div>
                            <div>
                                <Label>Forma de venta</Label>
                                <br />
                                <Badge variant="secondary" className="rounded w-max">
                                    {saleData?.forma_venta}
                                </Badge>
                            </div>
                            <div>
                                <Label>Productos</Label>
                                <br />
                                <p className="text-base">
                                    {saleData?.cantidad_detalles}{' '}
                                    {saleData?.cantidad_detalles === 1 ? 'producto' : 'productos'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-2">
                    <Card className="bg-white border border-gray-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                                <Building2 className="h-5 w-5 text-gray-700" />
                                Información del cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-gray-900 space-y-4">
                                <div>
                                    <Label>Cliente</Label>
                                    <p className="text-base text-blue-600 font-semibold">{saleData?.cliente?.cliente}</p>
                                </div>
                                <div>
                                    <Label>Dirección</Label>
                                    <p>{formatCell(saleData?.cliente?.direccion)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label>Contacto</Label>
                                        <p>{formatCell(saleData?.cliente?.contacto)}</p>
                                    </div>
                                    <div>
                                        <Label>NIT</Label>
                                        <p>{formatCell(saleData?.cliente?.nit)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border border-gray-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                                <User className="h-5 w-5 text-gray-700" />
                                Responsable de venta
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-gray-900 space-y-4">
                                <div>
                                    <Label>Nombre</Label>
                                    <p className="text-base font-semibold">
                                        {[
                                            saleData?.responsable_venta?.nombre,
                                            saleData?.responsable_venta?.apellido_paterno,
                                            saleData?.responsable_venta?.apellido_materno
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label>DNI</Label>
                                        <p>{formatCell(saleData?.responsable_venta?.dni)}</p>
                                    </div>
                                    <div>
                                        <Label>Celular</Label>
                                        <p>{formatCell(saleData?.responsable_venta?.celular)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <SaleProductsSection
                    products={saleData?.detalles ?? []}
                    isLoading={isLoadingSale}
                    totalAmount={totalVenta}
                />
            </div>
        </main>
    );
}

export default SaleDetailScreen;