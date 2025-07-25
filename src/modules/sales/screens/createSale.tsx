import { useEffect, useState } from "react";
import { ShoppingCart, Edit3, Save, Trash2, CornerUpLeft } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import { Badge } from "@/components/atoms/badge";
import { toast } from "@/hooks/use-toast";
import ProductSelectorModal from "@/modules/products/components/ProductSelectorModal";
import type { ProductGet } from "@/modules/products/types/ProductGet";
import authSDK from "@/services/sdk-simple-auth";
import { useCartWithUtils } from "@/modules/shoppingCart/hooks/useCartWithUtils";
import { useCreateSale } from "../hooks/useCreateSale";
import { FormProvider, useForm, useWatch, Controller } from "react-hook-form";
import { SaleSchema } from "../schemas/sales.schema";
import type { Sale, SaleDetail } from "../types/sale";
import { zodResolver } from "@hookform/resolvers/zod";
import SalesSummary from "../components/salesSummary";
import { Kbd } from "@/components/atoms/kbd";

export interface Product {
    id: string;
    codigo: string;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    marca: string;
}

const CreateSale = () => {
    const user = authSDK.getCurrentUser()
    const { mutate: createSale, isPending } = useCreateSale();

    const methods = useForm<Sale>({
        resolver: zodResolver(SaleSchema),
        defaultValues: {
            fecha: new Date().toISOString().slice(0, 10),
            nro_comprobante: "",
            nro_comprobante2: "",
            id_cliente: 0,
            tipo_venta: "VC",
            forma_venta: "MY",
            comentario: "",
            plazo_pago: "",
            vehiculo: "",
            nro_motor: "",
            cliente_nombre: "",
            cliente_nit: "",
            usuario: 1,
            sucursal: 1,
            id_responsable: 1,
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
        formState: { errors }
    } = methods

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const {
        items,
        getCartSubtotal,
        getCartTotal,
        discountAmount,
        discountPercent,
        updateQuantity,
        removeItem,
        updateCustomPrice,
        updateCustomSubtotal,
        setDiscountAmount,
        setDiscountPercent,
        clearCart,
        addItem
    } = useCartWithUtils(user?.name || '')
    const subtotal = getCartSubtotal();
    const total = getCartTotal();
    const [editingGlobalAmount, setEditingGlobalAmount] = useState(false);
    const [editingGlobalPercent, setEditingGlobalPercent] = useState(false);
    const [editingPrice, setEditingPrice] = useState<number | null>(null);
    const [editingSubtotal, setEditingSubtotal] = useState<number | null>(null);
    const [editingQuantity, setEditingQuantity] = useState<number | null>(null);

    useEffect(() => {
        const detalles: SaleDetail[] = items.map(item => ({
            id_producto: item.product.id,
            cantidad: item.quantity,
            precio: item.customPrice,
            descuento: (item.customPrice ?? 0) * ((discountPercent ?? 0) / 100),
            porcentaje_descuento: discountPercent ?? 0
        }));

        if (detalles.length > 0) {
            setValue("detalles", detalles as [SaleDetail, ...SaleDetail[]]);
        }
    }, [items, discountAmount, discountPercent, setValue]);

    const handleGlobalAmountSubmit = (value: string) => {
        const amount = parseFloat(value);
        setDiscountAmount(isNaN(amount) ? 0 : amount);
        setEditingGlobalAmount(false);
    };

    const handleGlobalPercentSubmit = (value: string) => {
        const percent = parseFloat(value);
        setDiscountPercent(isNaN(percent) ? 0 : percent);
        setEditingGlobalPercent(false);
    };

    const handleCheckout = () => {
        toast({
            title: "Venta Existosa",
            description: `Venta realizada con exito`,
            className: "border border-gray-200"
        });
        clearCart()
        reset({
            fecha: new Date().toISOString().slice(0, 10),
        })
    };

    const tipoVenta = useWatch({
        control,
        name: "tipo_venta",
    });

    // Limpiar plazo_pago si el tipo de venta no es a crédito
    useEffect(() => {
        if (tipoVenta !== "VENTA A CREDITO") {
            resetField("plazo_pago");
        }
    }, [tipoVenta, resetField]);

    const handleAddProductItem = (product: ProductGet) => {
        console.log('Agregando producto:', product);

        addItem(product);

        // Opcional: Mostrar toast de confirmación
        toast({
            title: "Producto agregado",
            description: `${product.descripcion} agregado al carrito`,
            className: "border border-green-200 bg-green-50"
        });
    }

    // FUNCIÓN onSubmit corregida
    const onSubmit = (data: Sale) => {
        createSale(data);

        // Mostrar toast de éxito
        handleCheckout();
        console.log(data)
    };

    // FUNCIÓN para manejar errores del formulario
    const onError = (errors: any) => {
        const values = getValues()
        console.log(values)
        if (values.detalles && values.detalles.length <= 0) {
            toast({
                title: "Ha ocurrido un error",
                description: `Para realizar una venta debes agregar al menos un producto`,
                className: "border border-red-200"
            });
        }
        console.log("Errores del formulario:", errors);
        console.log(values)
    };

    const onSearchChange=(value:string)=>{
        console.log(value)
    }
    return (
        <div className="min-h-screen">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="max-w-7xl mx-auto p-2">
                    {/* Header */}
                    <div className="flex gap-2 items-center mb-2">
                        <Button
                            type="button"
                            size={'sm'}
                            variant={'outline'}
                            className="cursor-pointer"
                        >
                            <CornerUpLeft />
                            <Kbd>esc</Kbd>
                            {/* Atras */}
                        </Button>
                        <h1 className="text-lg font-bold text-gray-900">Nueva Venta</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Formulario de información de venta - Columna izquierda */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* 1. Datos de la Venta */}
                            <Card className="border-0 shadow-sm">

                                <CardContent className="space-y-3 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <Label htmlFor="fechaVenta" className="text-sm font-medium text-gray-700 mb-2">Fecha de Venta *</Label>
                                            <Input
                                                id="fechaVenta"
                                                type="date"
                                                {...register("fecha")}
                                                className="w-full"
                                            />
                                            {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha.message}</p>}
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
                                                            <SelectItem value="MY">VENTA MAYOR</SelectItem>
                                                            <SelectItem value="M">VENTA MENOR</SelectItem>
                                                            <SelectItem value="Y">VENTA ESPECIAL</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.forma_venta && <p className="text-red-500 text-sm mt-1">{errors.forma_venta.message}</p>}
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
                                            <Label htmlFor="responsable" className="text-sm font-medium text-gray-700 mb-2">Responsable de Venta *</Label>
                                            <Controller
                                                name="id_responsable"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona un responsable" />
                                                        </SelectTrigger>
                                                        <SelectContent showSearch={true} onSearchChange={onSearchChange}>
                                                            <SelectItem value="1">VARGAS MADELEN</SelectItem>
                                                            <SelectItem value="2">GARCIA LUIS</SelectItem>
                                                            <SelectItem value="3">RODRIGUEZ ANA</SelectItem>
                                                            <SelectItem value="4">ROMRIGUEZ ANA</SelectItem>
                                                        </SelectContent>
                                                    </Select>
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
                                                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona un cliente" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="67">A TODOMOTOR</SelectItem>
                                                            <SelectItem value="6">REPUESTOS GARCÍA</SelectItem>
                                                            <SelectItem value="7">AUTOMOTRIZ CENTRAL</SelectItem>
                                                        </SelectContent>
                                                    </Select>
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
                                                            <SelectItem value="VC">VENTA AL CONTADO</SelectItem>
                                                            <SelectItem value="C">VENTA A CREDITO</SelectItem>
                                                            <SelectItem value="V">VENTA MIXTA</SelectItem>
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
                                                disabled={watch("tipo_venta") !== "VENTA A CREDITO"}
                                                className={watch("tipo_venta") !== "VENTA A CREDITO" ? "bg-gray-100" : ""}
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
                                    </div>
                                    <div>
                                        <Label htmlFor="comentarios" className="text-sm font-medium text-gray-700 mb-2">Comentarios</Label>
                                        <Textarea
                                            id="comentarios"
                                            {...register("comentario")}
                                            placeholder="Comentarios adicionales sobre la venta"
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">* Campos requeridos</span>
                                </CardContent>
                            </Card>

                            {/* 2. Productos */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle>
                                        <ProductSelectorModal
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            isSearchOpen={isSearchOpen}
                                            setIsSearchOpen={setIsSearchOpen}
                                            addItem={handleAddProductItem}
                                        />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {items.map((product) => {
                                            const basePrice = product.customPrice
                                            const itemSubtotal = product.customSubtotal
                                            return (
                                                <div key={product.product.id} className="border-gray-200 rounded-lg p-3 border">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {product.product.id}
                                                                </Badge>
                                                                <span className="text-xs text-gray-500">{product.product.marca}</span>
                                                            </div>
                                                            <h4 className="text-sm font-medium text-gray-900 mb-1">{product.product.descripcion}</h4>

                                                            <div className="grid grid-cols-3 gap-3">
                                                                <div>
                                                                    <Label className="text-xs text-gray-600 mb-1">Cantidad</Label>
                                                                    {editingQuantity === product.product.id ? (
                                                                        <Input
                                                                            type="number"
                                                                            step="1"
                                                                            defaultValue={product.quantity}
                                                                            className="h-8 text-sm"
                                                                            onBlur={(e) => {
                                                                                updateQuantity(product.product.id, parseInt(e.target.value) || product.quantity)
                                                                                setEditingQuantity(null)
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === "Enter") {
                                                                                    updateQuantity(product.product.id, parseInt((e.target as HTMLInputElement).value) || product.quantity)
                                                                                    setEditingQuantity(null)
                                                                                }
                                                                            }}
                                                                            autoFocus
                                                                        />
                                                                    ) : (
                                                                        <Button
                                                                            variant={"ghost"}
                                                                            size={"sm"}
                                                                            className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 p-1 rounded h-8 w-full justify-start"
                                                                            onClick={() => setEditingQuantity(product.product.id)}
                                                                        >
                                                                            <span className="text-sm font-medium">{product.quantity}</span>
                                                                            <Edit3 className="h-3 w-3 text-gray-400" />
                                                                        </Button>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <Label className="text-xs text-gray-600 mb-1">Precio Unit.</Label>
                                                                    {editingPrice === product.product.id ? (
                                                                        <Input
                                                                            type="number"
                                                                            step="0.01"
                                                                            defaultValue={basePrice}
                                                                            className="h-8 text-sm"
                                                                            onBlur={(e) => {
                                                                                updateCustomPrice(product.product.id, parseFloat(e.target.value) || basePrice)
                                                                                setEditingPrice(null)
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === "Enter") {
                                                                                    updateCustomPrice(product.product.id, parseFloat((e.target as HTMLInputElement).value) || basePrice)
                                                                                    setEditingPrice(null)
                                                                                }
                                                                            }}
                                                                            autoFocus
                                                                        />
                                                                    ) : (
                                                                        <Button
                                                                            variant={"ghost"}
                                                                            size={"sm"}
                                                                            className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 p-1 rounded h-8 w-full justify-start"
                                                                            onClick={() => setEditingPrice(product.product.id)}
                                                                        >
                                                                            <span className="text-sm font-medium">${basePrice.toFixed(2)}</span>
                                                                            <Edit3 className="h-3 w-3 text-gray-400" />
                                                                        </Button>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <Label className="text-xs text-gray-600 mb-1">Subtotal</Label>
                                                                    {editingSubtotal === product.product.id ? (
                                                                        <Input
                                                                            type="number"
                                                                            step="0.1"
                                                                            min="0"
                                                                            max="100"
                                                                            defaultValue={itemSubtotal}
                                                                            className="h-8 text-sm"
                                                                            onBlur={(e) => {
                                                                                updateCustomSubtotal(product.product.id, parseFloat(e.target.value) || itemSubtotal)
                                                                                setEditingSubtotal(null)
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === "Enter") {
                                                                                    updateCustomSubtotal(product.product.id, parseFloat((e.target as HTMLInputElement).value) || itemSubtotal)
                                                                                    setEditingSubtotal(null)
                                                                                }
                                                                            }}
                                                                            autoFocus
                                                                        />
                                                                    ) : (
                                                                        <Button
                                                                            variant={"ghost"}
                                                                            size={"sm"}
                                                                            className="flex items-center gap-1 cursor-pointer hover:bg-green-50 p-1 rounded  h-8 w-full justify-start"
                                                                            onClick={() => setEditingSubtotal(product.product.id)}
                                                                        >
                                                                            <span className="text-sm font-medium text-green-600">${itemSubtotal.toFixed(2)}</span>
                                                                            <Edit3 className="h-3 w-3 text-gray-400" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeItem(product.product.id)}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        {items.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                                <p>No hay productos agregados</p>
                                                <p className="text-sm">Haz clic en "Seleccionar Productos" para agregar</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Resumen del pedido - Columna derecha */}
                        <div className="space-y-6">
                            <SalesSummary
                                clearCart={clearCart}
                                discountAmount={discountAmount || 0}
                                discountPercent={discountPercent || 0}
                                editingGlobalAmount={editingGlobalAmount}
                                editingGlobalPercent={editingGlobalPercent}
                                handleGlobalAmountSubmit={handleGlobalAmountSubmit}
                                handleGlobalPercentSubmit={handleGlobalPercentSubmit}
                                isPending={isPending}
                                reset={reset}
                                setDiscountAmount={setDiscountAmount}
                                setDiscountPercent={setDiscountPercent}
                                setEditingGlobalAmount={setEditingGlobalAmount}
                                setEditingGlobalPercent={setEditingGlobalPercent}
                                subtotal={subtotal}
                                total={total}
                                watch={watch}
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default CreateSale;