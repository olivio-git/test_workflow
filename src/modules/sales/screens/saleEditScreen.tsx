import ErrorDataComponent from "@/components/common/errorDataComponent"
import { useNavigate, useParams } from "react-router"
import { useSaleGetById } from "../hooks/useSaleGetById"
import TooltipButton from "@/components/common/TooltipButton"
import { CornerUpLeft, Loader2, Save, ShoppingCart } from "lucide-react"
import { Kbd } from "@/components/atoms/kbd"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SaleUpdateSchema } from "../schemas/saleUpdate.schema"
import type { SaleUpdate, SaleUpdateDetailWithProduct } from "../types/saleUpdate.type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card"
import { Label } from "@/components/atoms/label"
import { Input } from "@/components/atoms/input"
import { ComboboxSelect } from "@/components/common/SelectCombobox"
import { useEffect, useState } from "react"
import { useDebounce } from "use-debounce"
import { useSaleTypes } from "../hooks/useSaleTypes"
import { useSaleModalities } from "../hooks/useSaleModalities"
import { useSaleResponsibles } from "../hooks/useSaleResponsibles"
import { useSaleCustomers } from "../hooks/useSaleCustomers"
import { PaginatedCombobox } from "@/components/common/paginatedCombobox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { Textarea } from "@/components/atoms/textarea"
import { useBranchStore } from "@/states/branchStore"
import { showErrorToast } from "@/hooks/use-toast-enhanced"
import { format, parse } from "date-fns"
import { useHotkeys } from "react-hotkeys-hook"
import SaleDetailSkeleton from "../components/saleDetail/saleDetailSkeleton"
import ProductSelectorModal from "@/modules/products/components/ProductSelectorModal"
import TableSaleProducts from "../components/saleEdit/saleProductsEditTable"
import type { ProductGet } from "@/modules/products/types/ProductGet"
import type { SaleItemGetById } from "../types/salesGetResponse"

const SaleEditScreen = () => {
    const navigate = useNavigate()
    const { selectedBranchId } = useBranchStore()
    const { saleId } = useParams()
    const [customerSearchTerm, setCustomerSearchTerm] = useState<string>("");
    const [debouncedCustomerSearchTerm] = useDebounce<string>(customerSearchTerm, 500)
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [saleDetails, setSaleDetails] = useState<SaleUpdateDetailWithProduct[]>([])

    const {
        data: saleTypesData,
    } = useSaleTypes()

    const {
        data: saleModalitiesData,
    } = useSaleModalities()

    const {
        data: saleResponsiblesData,
    } = useSaleResponsibles()

    const {
        data: saleCustomersData,
        isLoading: isSaleCustomersLoading
    } = useSaleCustomers(debouncedCustomerSearchTerm)

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
        isLoading: isLoadingSale,
        isError: isErrorSale
    } = useSaleGetById(Number(saleId))

    const methods = useForm<SaleUpdate>({
        resolver: zodResolver(SaleUpdateSchema),
        defaultValues: {
            fecha: "",
            nro_comprobante: "",
            nro_comprobante2: "",
            id_cliente: undefined,
            tipo_venta: "",
            forma_venta: "",
            comentario: "",
            plazo_pago: "",
            vehiculo: "",
            nro_motor: "",
            cliente_nombre: "",
            cliente_nit: "",
            usuario: 1,
            sucursal: Number(selectedBranchId) || 1,
            id_responsable: undefined,
            detalles: []
        }
    });

    const {
        register,
        watch,
        reset,
        resetField,
        control,
        handleSubmit,
        setValue,
        getValues,
        setError,
        clearErrors,
        formState: { errors }
    } = methods

    useEffect(() => {
        console.log(saleData)

        if (saleData && saleTypesData && saleModalitiesData) {
            reset({
                fecha: saleData.fecha?.slice(0, 10) ?? "", // adaptar formato yyyy-MM-dd
                nro_comprobante2: saleData.comprobante2 ?? "",
                nro_comprobante: saleData.comprobante ?? "",
                id_cliente: saleData.cliente?.id ?? undefined,
                tipo_venta: saleData.tipo_venta.toString(),
                forma_venta: saleData.forma_venta.toString(),
                comentario: saleData.comentarios ?? "",
                plazo_pago: saleData.plazo_pago ?? "",
                vehiculo: saleData.vehiculo ?? "",
                nro_motor: saleData.nmotor ?? "",
                cliente_nombre: saleData.cliente?.cliente ?? "",
                cliente_nit: saleData.cliente?.nit?.toString() ?? "",
                // usuario: saleData.usuario_id ?? 1,
                // sucursal: saleData.sucursal_id ?? 1,
                id_responsable: saleData.responsable_venta?.id ?? undefined,
                detalles: saleData.detalles ?? []
            });
            setSaleDetails(saleData.detalles)
        }
    }, [saleData, saleTypesData, saleModalitiesData, reset]);


    const validateBeforeSubmit = (): boolean => {
        let isValid = true;

        if (saleData?.detalles.length === 0) {
            setError("detalles", {
                type: "manual",
                message: "Debes agregar al menos un producto para realizar una venta"
            });
            showErrorToast({
                title: "No hay productos seleccionados",
                description: "Debes agregar al menos un producto para realizar una venta",
                duration: 5000
            });
            isValid = false;
        }

        // const validation = validateCartWithToast();
        // if (!validation.isValid) {
        //     setError("detalles", {
        //         type: "manual",
        //         message: "Hay productos con problemas de stock en el carrito"
        //     });
        //     isValid = false;
        // }

        const formData = getValues();

        if (!formData.id_cliente) {
            setError("id_cliente", {
                type: "manual",
                message: "Debes seleccionar un cliente"
            });
            showErrorToast({
                title: "Cliente requerido",
                description: "Debes seleccionar un cliente para la venta",
                duration: 5000
            });
            isValid = false;
        }

        if (!formData.tipo_venta) {
            setError("tipo_venta", {
                type: "manual",
                message: "Debes seleccionar un tipo de venta"
            });
            isValid = false;
        }

        if (!formData.forma_venta) {
            setError("forma_venta", {
                type: "manual",
                message: "Debes seleccionar una forma de venta"
            });
            isValid = false;
        }

        if (formData.tipo_venta === "VC" && !formData.plazo_pago) {
            setError("plazo_pago", {
                type: "manual",
                message: "Debes especificar la fecha de plazo para venta a crédito"
            });
            showErrorToast({
                title: "Plazo requerido",
                description: "Las ventas a crédito requieren una fecha de plazo",
                duration: 5000
            });
            isValid = false;
        }

        return isValid;
    };

    // VALIDACIÓN DE FECHA DE PLAZO
    useEffect(() => {
        const tipoVenta = watch("tipo_venta");
        const plazoPago = watch("plazo_pago");

        if (tipoVenta === "VC" && plazoPago) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const plazoDate = parse(plazoPago, "yyyy-MM-dd", new Date());
            plazoDate.setHours(0, 0, 0, 0);

            if (plazoDate <= today) {
                setError("plazo_pago", {
                    type: "manual",
                    message: "La fecha de plazo debe ser posterior a hoy"
                });
                showErrorToast({
                    title: "Fecha inválida",
                    description: "La fecha de plazo debe ser posterior a hoy",
                    duration: 5000
                });
                resetField("plazo_pago");
            } else {
                clearErrors("plazo_pago");
            }
        }
        if (tipoVenta !== "VC") {
            resetField("plazo_pago");
        }
    }, [watch("tipo_venta"), watch("plazo_pago"), resetField]);

    const handleCheckout = () => {
        const currentValues = getValues();
        reset({
            fecha: format(new Date(), "yyyy-MM-dd"),
            nro_comprobante: "",
            nro_comprobante2: "",
            id_cliente: currentValues.id_cliente,
            tipo_venta: currentValues.tipo_venta,
            forma_venta: currentValues.forma_venta,
            comentario: "",
            plazo_pago: "",
            vehiculo: "",
            nro_motor: "",
            cliente_nombre: currentValues.cliente_nombre,
            cliente_nit: currentValues.cliente_nit,
            usuario: currentValues.usuario,
            sucursal: currentValues.sucursal,
            id_responsable: currentValues.id_responsable,
            detalles: []
        });
    };

    // const handleAddProductItem = (product: ProductGet) => {
    //     addItemToCart(product)
    // };

    // const handleAddMultipleProducts = (products: ProductGet[]) => {
    //     addMultipleItems(products);
    // };

    const onSubmit = (data: SaleUpdate) => {
        console.log(data)
        if (!validateBeforeSubmit()) {
            return;
        }

        // createSale(data, {
        //     onSuccess: () => {
        //         // console.log('Venta creada:', response);
        //         showSuccessToast({
        //             title: "Venta Exitosa",
        //             description: `Venta realizada con éxito`,
        //             duration: 5000
        //         });
        //         handleCheckout();

        //         queryClient.invalidateQueries({ queryKey: ["sales"] });
        //         queryClient.invalidateQueries({ queryKey: ["products"] });
        //     },
        //     onError: (error: any) => {
        //         showErrorToast({
        //             title: "Error en la venta",
        //             description: error.message || "No se pudo procesar la venta. Intenta nuevamente.",
        //             duration: 5000
        //         });
        //     }
        // });
    };

    const onError = (errors: any) => {
        if (errors.id_cliente || errors.tipo_venta || errors.forma_venta || errors.id_responsable) {
            showErrorToast({
                title: "Error de validación",
                description: "Revisa los campos obligatorios del formulario",
                duration: 5000
            });
            return;
        }
        const firstErrorKey = Object.keys(errors)[0];
        const firstError = errors[firstErrorKey];

        if (firstError?.message) {
            showErrorToast({
                title: "Error en formulario",
                description: firstError.message,
                duration: 5000
            });
        }

        if (errors.detalles) {
            validateBeforeSubmit();
        }
    };

    const handleGoBack = () => {
        navigate('/dashboard/sales')
    }

    const handleAddProductItem = (product: ProductGet) => {

    }

    const handleAddMultipleProducts = (products: ProductGet[]) => {

    }

    // Shortcuts
    useHotkeys('escape', handleGoBack, {
        scopes: ["esc-key"],
        enabled: true
    });

    if (isLoadingSale) {
        return <SaleDetailSkeleton />;
    }

    if (isErrorSale) {
        return <ErrorDataComponent
            errorMessage="No se pudo cargar la venta."
            showButtonIcon={false}
            buttonText="Ir a lista de ventas"
            onRetry={() => {
                navigate("/dashboard/sales")
            }}
        />
    }

    return (
        <main className="flex flex-col items-center">
            <div className="max-w-7xl w-full space-y-2">
                <FormProvider {...methods}>
                    <form
                        className="space-y-2"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <header className="border-gray-200 border bg-white rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <TooltipButton
                                        tooltipContentProps={{
                                            align: 'start'
                                        }}
                                        // onClick={handleGoBack}
                                        tooltip={<p className="flex gap-1">Presiona <Kbd>esc</Kbd> para volver a la lista de ventas</p>}
                                        buttonProps={{
                                            variant: 'default',
                                            type: 'button'
                                        }}
                                    >
                                        <CornerUpLeft />
                                    </TooltipButton>
                                    <div>
                                        <h1 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                                            Editar venta #{saleData?.nro}
                                        </h1>
                                        {saleData && (
                                            <p className="text-sm text-gray-600">
                                                {saleData.cliente ? `${saleData.cliente?.cliente} - ` : ''}
                                                {saleData.cantidad_detalles} {saleData.cantidad_detalles === 1 ? 'producto' : 'productos'}
                                            </p>
                                        )}
                                    </div>
                                </div >

                                {/* Action Buttons */}
                                < div className="flex items-center gap-2" >
                                    <TooltipButton
                                        // onClick={handleUpdateSale}
                                        onClick={() => {
                                            const d = getValues()
                                            console.log(d)
                                        }}
                                        tooltip="Cancelar Edicion"
                                        buttonProps={{
                                            variant: 'outline',
                                            size: 'sm',
                                            type: 'button'
                                        }}
                                    >
                                        Cancelar
                                    </TooltipButton>

                                    <TooltipButton
                                        // onClick={() => handleOpenDeleteAlert(saleData?.id)}
                                        tooltip="Guardar cambios"
                                        buttonProps={{
                                            variant: 'default',
                                            size: 'sm',
                                            type: 'submit'
                                            // disabled: isDeleting
                                        }}
                                    >
                                        {
                                            2 > 1 ? (
                                                <>
                                                    <Save className="h-4 w-4" />
                                                    Guardar Cambios
                                                </>
                                            ) : (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Guardando...
                                                </>
                                            )
                                        }
                                    </TooltipButton>
                                </div >
                            </div >
                        </header >

                        {/* 1. Datos de la Venta */}
                        <Card className="border-gray-200 shadow-none pt-4">
                            <CardContent className="">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="fechaVenta">Fecha de Venta *</Label>
                                        <Input
                                            id="fechaVenta"
                                            type="date"
                                            {...register("fecha")}
                                            className="w-full"
                                            autoFocus
                                        />
                                        {errors.fecha && <p className="text-red-500 text-sm mt-1">El campo es requerido</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="responsable">Responsable de Venta *</Label>
                                        <Controller
                                            name="id_responsable"
                                            control={control}
                                            render={({ field }) => (
                                                <ComboboxSelect
                                                    value={field.value}
                                                    onChange={(value) => {
                                                        field.onChange(Number(value));
                                                    }}
                                                    options={saleResponsiblesData || []}
                                                    optionTag={"nombre"}
                                                />
                                            )}
                                        />
                                        {errors.id_responsable && <p className="text-red-500 text-sm mt-1">El campo es requerido</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="cliente">Cliente *</Label>
                                        <Controller
                                            name="id_cliente"
                                            control={control}
                                            render={({ field }) => (
                                                <PaginatedCombobox
                                                    value={field.value}
                                                    onChange={(value) => {
                                                        field.onChange(Number(value));
                                                        const selected = saleCustomersData?.data.find((c) => c.id.toString() === value);
                                                        if (selected) {
                                                            setValue("cliente_nombre", selected.nombre);
                                                            setValue("cliente_nit", selected.nit?.toString() || "");
                                                        }
                                                    }}
                                                    optionsData={saleCustomersData?.data || []}
                                                    displayField="nombre"
                                                    isLoading={isSaleCustomersLoading}
                                                    updatePage={(page) => { console.log("Update page:", page) }}
                                                    updateSearch={setCustomerSearchTerm}
                                                    metaData={
                                                        {
                                                            current_page: saleCustomersData?.meta.current_page || 1,
                                                            last_page: saleCustomersData?.meta.last_page || 1,
                                                            total: saleCustomersData?.meta.total || 0,
                                                            per_page: saleCustomersData?.meta.per_page || 10,
                                                        }
                                                    }
                                                />
                                            )}
                                        />
                                        {errors.id_cliente && <p className="text-red-500 text-sm mt-1">El campo es requerido</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="altClie">Alt. Clie</Label>
                                        <Input
                                            id="altClie"
                                            {...register("cliente_nombre")}
                                            placeholder="Cliente alternativo"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="nroComprobante">N° Comprobante</Label>
                                        <Input
                                            id="nroComprobante"
                                            {...register("nro_comprobante")}
                                            placeholder="Número de comprobante"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="nroComprobanteSecundario">N° Comprobante Secundario</Label>
                                        <Input
                                            id="nroComprobanteSecundario"
                                            {...register("nro_comprobante2")}
                                            placeholder="Número secundario"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="forma_venta">Forma de venta *</Label>
                                        <Controller
                                            name="forma_venta"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una forma" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            saleModalitiesData && Object.entries(saleModalitiesData || {}).map(([code, description]) => (
                                                                <SelectItem key={code} value={code}>
                                                                    {description}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.forma_venta && <p className="text-red-500 text-sm mt-1">El campo es requerido</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="tipo_venta">Tipo de Venta *</Label>
                                        <Controller
                                            name="tipo_venta"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            saleTypesData && Object.entries(saleTypesData).map(([code, description]) => (
                                                                <SelectItem key={code} value={code}>
                                                                    {description}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.tipo_venta && <p className="text-red-500 text-sm mt-1">El campo es requerido</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="fechaPlazo">Fecha Plazo (Venta Crédito)</Label>
                                        <Input
                                            id="fechaPlazo"
                                            type="date"
                                            {...register("plazo_pago")}
                                            disabled={watch("tipo_venta") !== "VC"}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="vehiculo">Vehículo</Label>
                                        <Input
                                            id="vehiculo"
                                            {...register("vehiculo")}
                                            placeholder="Modelo del vehículo"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="motor">Motor</Label>
                                        <Input
                                            id="motor"
                                            {...register("nro_motor")}
                                            placeholder="Tipo de motor"
                                        />
                                    </div>
                                    <div className="col-span-full">
                                        <Label htmlFor="comentarios">Comentarios</Label>
                                        <Textarea
                                            id="comentarios"
                                            {...register("comentario")}
                                            placeholder="Comentarios adicionales sobre la venta"
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">* Campos requeridos</span>
                            </CardContent>
                        </Card>

                    </form>
                </FormProvider>

                {/* 2. Productos */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle>
                            <ProductSelectorModal
                                isSearchOpen={isSearchOpen}
                                setIsSearchOpen={setIsSearchOpen}
                                addItem={handleAddProductItem}
                                onlyWithStock={true}
                                addMultipleItem={handleAddMultipleProducts}
                            />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {saleData?.detalles.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>No hay productos agregados</p>
                                    <p className="text-sm">Haz clic en "Seleccionar Productos" para agregar</p>
                                </div>
                            ) :
                                <TableSaleProducts
                                    products={saleData?.detalles ?? []}
                                />
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

export default SaleEditScreen;