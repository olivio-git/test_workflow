import { useState } from "react";
import { ArrowLeft, Plus, ShoppingCart, X, Edit3 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import { Badge } from "@/components/atoms/badge";
import DialogSearchDetails from "@/modules/purchases/components/DialogSearchDetails";
import { useCartStore } from "@/modules/shoppingCart/store/cartStore";
import { toast } from "@/hooks/use-toast";

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
    const [saleInfo, setSaleInfo] = useState({
        fechaVenta: "08/07/2025",
        forma: "VENTA MAYOR",
        nroComprobante: "",
        nroComprobanteSecundario: "",
        responsable: "VARGAS MADELEN",
        cliente: "A TODOMOTOR",
        altClie: "",
        tipoVenta: "VENTA AL CONTADO",
        fechaPlazo: "",
        vehiculo: "",
        motor: "",
        comentarios: ""
    });

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
        clearCart
    } = useCartStore();
    const subtotal = getCartSubtotal();
    const total = getCartTotal();
    const [editingGlobalAmount, setEditingGlobalAmount] = useState(false);
    const [editingGlobalPercent, setEditingGlobalPercent] = useState(false);
    const [editingPrice, setEditingPrice] = useState<number | null>(null);
    const [editingSubtotal, setEditingSubtotal] = useState<number | null>(null);
    const [editingQuantity, setEditingQuantity] = useState<number | null>(null);

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
        });
        clearCart()
        setSaleInfo(
            {
                fechaVenta: "",
                forma: "",
                nroComprobante: "",
                nroComprobanteSecundario: "",
                responsable: "",
                cliente: "",
                altClie: "",
                tipoVenta: "",
                fechaPlazo: "",
                vehiculo: "",
                motor: "",
                comentarios: ""
            }
        )
    };
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center mb-8">
                    {/* <Button variant="ghost" size="sm" className="mr-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button> */}
                    <h1 className="text-2xl font-semibold text-gray-900">Nueva Venta</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario de información de venta - Columna izquierda */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 1. Datos de la Venta */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-medium flex items-center">
                                    Datos de la Venta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="fechaVenta" className="text-sm font-medium text-gray-700 mb-2">Fecha de Venta</Label>
                                        <Input
                                            id="fechaVenta"
                                            type="date"
                                            value={saleInfo.fechaVenta}
                                            onChange={(e) => setSaleInfo({ ...saleInfo, fechaVenta: e.target.value })}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="forma" className="text-sm font-medium text-gray-700 mb-2">Forma</Label>
                                        <Select value={saleInfo.forma} onValueChange={(value) => setSaleInfo({ ...saleInfo, forma: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="VENTA MAYOR">VENTA MAYOR</SelectItem>
                                                <SelectItem value="VENTA MENOR">VENTA MENOR</SelectItem>
                                                <SelectItem value="VENTA ESPECIAL">VENTA ESPECIAL</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="nroComprobante" className="text-sm font-medium text-gray-700 mb-2">N° Comprobante</Label>
                                        <Input
                                            id="nroComprobante"
                                            value={saleInfo.nroComprobante}
                                            onChange={(e) => setSaleInfo({ ...saleInfo, nroComprobante: e.target.value })}
                                            placeholder="Número de comprobante"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="nroComprobanteSecundario" className="text-sm font-medium text-gray-700 mb-2">N° Comprobante Secundario</Label>
                                        <Input
                                            id="nroComprobanteSecundario"
                                            value={saleInfo.nroComprobanteSecundario}
                                            onChange={(e) => setSaleInfo({ ...saleInfo, nroComprobanteSecundario: e.target.value })}
                                            placeholder="Número secundario"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="responsable" className="text-sm font-medium text-gray-700 mb-2">Responsable de Venta</Label>
                                        <Select value={saleInfo.responsable} onValueChange={(value) => setSaleInfo({ ...saleInfo, responsable: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="VARGAS MADELEN">VARGAS MADELEN</SelectItem>
                                                <SelectItem value="GARCIA LUIS">GARCIA LUIS</SelectItem>
                                                <SelectItem value="RODRIGUEZ ANA">RODRIGUEZ ANA</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="cliente" className="text-sm font-medium text-gray-700 mb-2">Cliente</Label>
                                        <Select value={saleInfo.cliente} onValueChange={(value) => setSaleInfo({ ...saleInfo, cliente: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="A TODOMOTOR">A TODOMOTOR</SelectItem>
                                                <SelectItem value="REPUESTOS GARCÍA">REPUESTOS GARCÍA</SelectItem>
                                                <SelectItem value="AUTOMOTRIZ CENTRAL">AUTOMOTRIZ CENTRAL</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="altClie" className="text-sm font-medium text-gray-700 mb-2">Alt. Clie</Label>
                                        <Input
                                            id="altClie"
                                            value={saleInfo.altClie}
                                            onChange={(e) => setSaleInfo({ ...saleInfo, altClie: e.target.value })}
                                            placeholder="Cliente alternativo"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="tipoVenta" className="text-sm font-medium text-gray-700 mb-2">Tipo de Venta</Label>
                                        <Select value={saleInfo.tipoVenta} onValueChange={(value) => setSaleInfo({ ...saleInfo, tipoVenta: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="VENTA AL CONTADO">VENTA AL CONTADO</SelectItem>
                                                <SelectItem value="VENTA A CREDITO">VENTA A CREDITO</SelectItem>
                                                <SelectItem value="VENTA MIXTA">VENTA MIXTA</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="fechaPlazo" className="text-sm font-medium text-gray-700 mb-2">Fecha Plazo (Venta Crédito)</Label>
                                        <Input
                                            id="fechaPlazo"
                                            type="date"
                                            value={saleInfo.fechaPlazo}
                                            onChange={(e) => setSaleInfo({ ...saleInfo, fechaPlazo: e.target.value })}
                                            disabled={saleInfo.tipoVenta !== "VENTA A CREDITO"}
                                            className={saleInfo.tipoVenta !== "VENTA A CREDITO" ? "bg-gray-100" : ""}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="vehiculo" className="text-sm font-medium text-gray-700 mb-2">Vehículo</Label>
                                        <Input
                                            id="vehiculo"
                                            value={saleInfo.vehiculo}
                                            onChange={(e) => setSaleInfo({ ...saleInfo, vehiculo: e.target.value })}
                                            placeholder="Modelo del vehículo"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="motor" className="text-sm font-medium text-gray-700 mb-2">Motor</Label>
                                        <Input
                                            id="motor"
                                            value={saleInfo.motor}
                                            onChange={(e) => setSaleInfo({ ...saleInfo, motor: e.target.value })}
                                            placeholder="Tipo de motor"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="comentarios" className="text-sm font-medium text-gray-700 mb-2">Comentarios</Label>
                                    <Textarea
                                        id="comentarios"
                                        value={saleInfo.comentarios}
                                        onChange={(e) => setSaleInfo({ ...saleInfo, comentarios: e.target.value })}
                                        placeholder="Comentarios adicionales sobre la venta"
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Productos */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-medium flex items-center justify-between">
                                    <div className="flex items-center">
                                        Productos a Vender
                                    </div>
                                    <Button
                                        // onClick={() => setIsAddProductOpen(true)}
                                        className="bg-black hover:bg-gray-800 text-white"
                                        size="sm"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Seleccionar Productos
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {items.map((product) => {
                                        const basePrice = product.customPrice ?? parseFloat(product.product.precio_venta);
                                        const itemSubtotal = product.customSubtotal ?? basePrice * product.quantity;
                                        return (
                                            <div key={product.product.id} className="border-gray-200 rounded-lg p-4 border">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {product.product.id}
                                                            </Badge>
                                                            <span className="text-xs text-gray-500">{product.product.marca}</span>
                                                        </div>
                                                        <h4 className="font-medium text-gray-900 mb-3">{product.product.descripcion}</h4>

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
                                                                    <div
                                                                        className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                                                                        onClick={() => setEditingQuantity(product.product.id)}
                                                                    >
                                                                        <span className="text-sm font-medium">{product.quantity}</span>
                                                                        <Edit3 className="h-3 w-3 text-gray-400" />
                                                                    </div>
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
                                                                    <div
                                                                        className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                                                                        onClick={() => setEditingPrice(product.product.id)}
                                                                    >
                                                                        <span className="text-sm font-medium">${basePrice.toFixed(2)}</span>
                                                                        <Edit3 className="h-3 w-3 text-gray-400" />
                                                                    </div>
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
                                                                    <div
                                                                        className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                                                                        onClick={() => setEditingSubtotal(product.product.id)}
                                                                    >
                                                                        <span className="text-sm font-medium text-green-600">${itemSubtotal.toFixed(2)}</span>
                                                                        <Edit3 className="h-3 w-3 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeItem(product.product.id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <X className="h-4 w-4" />
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
                        <Card className="border-0 shadow-sm sticky top-6">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-medium flex items-center">
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    Resumen de Venta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Cliente:</span>
                                    <Badge className="bg-gray-100 text-gray-800">{saleInfo.cliente}</Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Responsable:</span>
                                    <span className="text-sm font-medium">{saleInfo.responsable}</span>
                                </div>

                                <div className="space-y-3 py-4 border-t border-b">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Subtotal:</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Descuento ({discountPercent?.toFixed(2)}%):</span>
                                        <span className="font-medium text-orange-600">-${discountAmount?.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-2">
                                    <span className="text-lg font-semibold">TOTAL:</span>
                                    <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={handleCheckout}
                                        className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base font-medium cursor-pointer">
                                        Guardar Venta
                                    </Button>

                                    <Button variant="outline" className="w-full py-3 text-base font-medium cursor-pointer">
                                        Nueva Venta
                                    </Button>

                                    <Button disabled variant="ghost" className="w-full py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
                                        Eliminar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                {/* seleccionar productos */}
                {/* <DialogSearchDetails
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    details={detalles}
                    setDetails={setDetalles}
                    isSearchOpen={isSearchOpen}
                    setIsSearchOpen={setIsSearchOpen}
                /> */}
            </div>
        </div>
    );
};
export default CreateSale