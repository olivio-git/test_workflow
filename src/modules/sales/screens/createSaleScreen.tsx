import { useEffect, useState } from "react";
import { ShoppingCart, CornerUpLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import ProductSelectorModal from "@/modules/products/components/ProductSelectorModal";
import type { ProductGet } from "@/modules/products/types/ProductGet";
import authSDK from "@/services/sdk-simple-auth";
import { useCartWithUtils } from "@/modules/shoppingCart/hooks/useCartWithUtils";
import { useCreateSale } from "../hooks/useCreateSale";
import { FormProvider, useForm, Controller, type FieldErrors } from "react-hook-form";
import { SaleSchema } from "../schemas/sales.schema";
import type { Sale, SaleDetail } from "../types/sale";
import { zodResolver } from "@hookform/resolvers/zod";
import SalesSummary from "../components/salesSummary";
import { Kbd } from "@/components/atoms/kbd";
import { useNavigate } from "react-router";
import { useSaleTypes } from "../hooks/useSaleTypes";
import { useSaleModalities } from "../hooks/useSaleModalities";
import { useSetDefaultSelect } from "../hooks/useSetDefaultSelect";
import { useSaleResponsibles } from "../hooks/useSaleResponsibles";
import { ComboboxSelect } from "@/components/common/SelectCombobox";
import { useSaleCustomers } from "../hooks/useSaleCustomers";
import { PaginatedCombobox } from "@/components/common/paginatedCombobox";
import { useBranchStore } from "@/states/branchStore";
import { useHotkeys } from "react-hotkeys-hook";
import TooltipButton from "@/components/common/TooltipButton";
import { format, parse } from "date-fns";
import { showErrorToast, showSuccessToast } from "@/hooks/use-toast-enhanced";
import TableShoppingCart from "@/modules/shoppingCart/components/tableShoppingCart";
import { useDebounce } from "use-debounce";
import { useErrorHandler } from "@/hooks/useErrorHandler";

const CreateSaleScreen = () => {
    const navigate = useNavigate();
    const user = authSDK.getCurrentUser()
    const { selectedBranchId } = useBranchStore()
    const [customerSearchTerm, setCustomerSearchTerm] = useState<string>("");

    const [debouncedCustomerSearchTerm] = useDebounce<string>(customerSearchTerm, 500)

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

    const {
        mutate: createSale,
        isPending
    } = useCreateSale();

    const { handleError } = useErrorHandler()

    const methods = useForm<Sale>({
        resolver: zodResolver(SaleSchema),
        defaultValues: {
            fecha: format(new Date(), "yyyy-MM-dd"),
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
            id_responsable: Number(user?._id) || undefined,
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

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const {
        items,
        getCartSubtotal,
        getCartTotal,
        discountAmount,
        discountPercent,
        setDiscountAmount,
        setDiscountPercent,
        clearCart,
        addItemToCart,
        addMultipleItems,
        validateCartWithToast
    } = useCartWithUtils(user?.name || '', selectedBranchId ?? '')
    const subtotal = getCartSubtotal();
    const total = getCartTotal();

    useSetDefaultSelect(saleTypesData, "tipo_venta", getValues, setValue);
    useSetDefaultSelect(saleModalitiesData, "forma_venta", getValues, setValue);

    useEffect(() => {
        const detalles: SaleDetail[] = items.map(item => ({
            id_producto: item.product.id,
            cantidad: item.quantity,
            precio: item.customPrice,
            descuento: ((item.customPrice ?? 0) * item.quantity) * ((discountPercent ?? 0) / 100),
            porcentaje_descuento: discountPercent ?? 0
        }));

        if (detalles.length > 0) {
            setValue("detalles", detalles as [SaleDetail, ...SaleDetail[]]);
            clearErrors("detalles");
        } else {
            // setValue("detalles", []);
        }
    }, [items, discountAmount, discountPercent, setValue, clearErrors]);

    const validateBeforeSubmit = (): boolean => {
        let isValid = true;

        if (items.length === 0) {
            setError("detalles", {
                type: "manual",
                message: "Debes agregar al menos un producto para realizar una venta"
            });
            showErrorToast({
                title: "Carrito vacío",
                description: "Debes agregar al menos un producto para realizar una venta",
                duration: 5000
            });
            isValid = false;
        }

        const validation = validateCartWithToast();
        if (!validation.isValid) {
            setError("detalles", {
                type: "manual",
                message: "Hay productos con problemas de stock en el carrito"
            });
            isValid = false;
        }

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

            // Validar que no sea más de X días (ej: 365 días)
            // const maxDays = 365;
            // const maxDate = new Date(today);
            // maxDate.setDate(maxDate.getDate() + maxDays);

            // if (plazoDate > maxDate) {
            //     toast({
            //         title: "Plazo muy extenso",
            //         description: `El plazo no puede ser mayor a ${maxDays} días`,
            //         variant: "destructive"
            //     });
            //     resetField("plazo_pago");
            // }
        }
        if (tipoVenta !== "VC") {
            resetField("plazo_pago");
        }
    }, [watch("tipo_venta"), watch("plazo_pago"), resetField, setError, clearErrors, watch]);

    const handleCheckout = () => {
        clearCart();

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

    const handleAddProductItem = (product: ProductGet) => {
        addItemToCart(product)
    };

    const handleAddMultipleProducts = (products: ProductGet[]) => {
        addMultipleItems(products);
    };

    // FUNCIÓN onSubmit corregida
    const onSubmit = (data: Sale) => {
        if (!validateBeforeSubmit()) {
            return;
        }

        createSale(data, {
            onSuccess: () => {
                // console.log('Venta creada:', response);
                showSuccessToast({
                    title: "Venta Exitosa",
                    description: `Venta realizada con éxito`,
                    duration: 5000
                });
                handleCheckout();
            },
            onError: (error: unknown) => {
                handleError(error, 'Error al realizar la venta');
            }
        });
    };

    const onError = (errors: FieldErrors<Sale>) => {
        if (errors.id_cliente || errors.tipo_venta || errors.forma_venta || errors.id_responsable) {
            showErrorToast({
                title: "Error de validación",
                description: "Revisa los campos obligatorios del formulario",
                duration: 5000
            });
            return;
        }
        const firstErrorKey = Object.keys(errors)[0] as keyof Sale;
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
        navigate('/dashboard/productos')
    }

    useEffect(() => {
        if (!user?._id && saleResponsiblesData && saleResponsiblesData.length > 0) {
            const firstResponsible = saleResponsiblesData[0];
            setValue("id_responsable", firstResponsible.id);
        }
    }, [saleResponsiblesData, setValue, user?._id]);

    useEffect(() => {
        const clientId = getValues("id_cliente");
        if (clientId) return
        if (saleCustomersData?.data && saleCustomersData.data.length > 0) {
            const firstCustomer = saleCustomersData.data[0];
            setValue("id_cliente", firstCustomer.id);
            setValue("cliente_nombre", firstCustomer.nombre);
            setValue("cliente_nit", firstCustomer.nit?.toString() || "");
        }
    }, [saleCustomersData, setValue, getValues]);

    // Shortcuts
    useHotkeys('escape', handleGoBack, {
        scopes: ["esc-key"],
        enabled: true
    });

    return (
        <div className="min-h-screen">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="max-w-7xl mx-auto flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex gap-2 items-center">
                        <TooltipButton
                            tooltipContentProps={{
                                align: 'start'
                            }}
                            onClick={handleGoBack}
                            tooltip={<p className="flex gap-1">Presiona <Kbd>esc</Kbd> para volver a la lista de productos</p>}
                        >
                            <CornerUpLeft />
                        </TooltipButton>
                        <h1 className="text-lg font-bold text-gray-900">Nueva Venta</h1>
                    </div>

                    <div className="grid  gap-3">
                        {/* Formulario de información de venta - Columna izquierda */}
                        <div className="space-y-3">
                            {/* 1. Datos de la Venta */}
                            <Card className="border-0 shadow-sm h-full">

                                <CardContent className="space-y-3 py-4">
                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        <div>
                                            <Label htmlFor="fechaVenta" className="text-sm font-medium text-gray-700 mb-2">Fecha de Venta *</Label>
                                            <Input
                                                id="fechaVenta"
                                                type="date"
                                                {...register("fecha")}
                                                className="w-full"
                                                autoFocus
                                            />
                                            {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="responsable" className="text-sm font-medium text-gray-700 mb-2">Responsable de Venta *</Label>
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
                                            <Label htmlFor="cliente" className="text-sm font-medium text-gray-700 mb-2">Cliente *</Label>
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
                                            <Label htmlFor="altClie" className="text-sm font-medium text-gray-700 mb-2">Alt. Clie</Label>
                                            <Input
                                                id="altClie"
                                                {...register("cliente_nombre")}
                                                placeholder="Cliente alternativo"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="nroComprobante" className="text-sm font-medium text-gray-700 mb-2">N° Comprobante</Label>
                                            <Input
                                                id="nroComprobante"
                                                {...register("nro_comprobante")}
                                                placeholder="Número de comprobante"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="nroComprobanteSecundario" className="text-sm font-medium text-gray-700 mb-2">N° Comprobante Secundario</Label>
                                            <Input
                                                id="nroComprobanteSecundario"
                                                {...register("nro_comprobante2")}
                                                placeholder="Número secundario"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="forma" className="text-sm font-medium text-gray-700 mb-2">Forma de venta *</Label>
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
                                            {errors.forma_venta && <p className="text-red-500 text-sm mt-1">{errors.forma_venta.message}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="tipoVenta" className="text-sm font-medium text-gray-700 mb-2">Tipo de Venta *</Label>
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
                                            <Label htmlFor="fechaPlazo" className="text-sm font-medium text-gray-700 mb-2">Fecha Plazo (Venta Crédito)</Label>
                                            <Input
                                                id="fechaPlazo"
                                                type="date"
                                                {...register("plazo_pago")}
                                                disabled={watch("tipo_venta") !== "VC"}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="vehiculo" className="text-sm font-medium text-gray-700 mb-2">Vehículo</Label>
                                            <Input
                                                id="vehiculo"
                                                {...register("vehiculo")}
                                                placeholder="Modelo del vehículo"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="motor" className="text-sm font-medium text-gray-700 mb-2">Motor</Label>
                                            <Input
                                                id="motor"
                                                {...register("nro_motor")}
                                                placeholder="Tipo de motor"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="comentarios" className="text-sm font-medium text-gray-700 mb-2">Comentarios</Label>
                                            <Input
                                                id="comentarios"
                                                {...register("comentario")}
                                                placeholder="Comentarios adicionales sobre la venta"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">* Campos requeridos</span>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
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
                                {items.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                        <p>No hay productos agregados</p>
                                        <p className="text-sm">Haz clic en "Seleccionar Productos" para agregar</p>
                                    </div>
                                ) :
                                    <TableShoppingCart />
                                }
                            </div>
                        </CardContent>
                    </Card>
                    {/* Resumen de venta - Columna derecha */}
                    <SalesSummary
                        clearCart={clearCart}
                        discountAmount={discountAmount || 0}
                        discountPercent={discountPercent || 0}
                        isPending={isPending}
                        reset={reset}
                        setDiscountAmount={setDiscountAmount}
                        setDiscountPercent={setDiscountPercent}
                        subtotal={subtotal}
                        total={total}
                        hasProducts={items.length > 0}
                    />
                </form>
            </FormProvider>
        </div>
    );
};

export default CreateSaleScreen;