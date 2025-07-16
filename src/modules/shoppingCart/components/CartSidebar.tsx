import { useState } from "react"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Separator } from "@/components/atoms/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/atoms/sheet"
import { Textarea } from "@/components/atoms/textarea"
import { cn } from "@/lib/utils"
import { CreditCard, Edit3, Maximize2, Minus, Plus, Receipt, ShoppingCart, Trash2 } from "lucide-react"
import { useCartStore } from "../store/cartStore"

const CartSidebar = ({
    open,
    onOpenChange
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) => {
    const [editingPrice, setEditingPrice] = useState<number | null>(null)
    const [editingDiscount, setEditingDiscount] = useState<number | null>(null)
    const [expandedView, setExpandedView] = useState(false)

    const {
        items: cart,
        updateQuantity,
        updatePrice,
        updateDiscount,
        updateNotes,
        removeItem,
        clear
    } = useCartStore()

    const subtotal = cart.reduce((sum, item) => {
        const price = item.customPrice ?? Number(item.product.precio_venta)
        return sum + price * item.quantity
    }, 0)

    const totalDiscount = cart.reduce((sum, item) => {
        const price = item.customPrice ?? Number(item.product.precio_venta)
        const discount = item.discount ?? 0
        return sum + (price * item.quantity * discount) / 100
    }, 0)

    const total = subtotal - totalDiscount

    return (
        <Sheet open={open} onOpenChange={onOpenChange} >
            <SheetContent className={cn("w-[400px] sm:w-[600px] sm:max-w-7xl", expandedView && "sm:w-[800px] lg:w-[1000px]")}>
                <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Carrito de Compras
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setExpandedView(!expandedView)}>
                            <Maximize2 className="w-4 h-4" />
                        </Button>
                    </SheetTitle>
                    <SheetDescription>{cart.length} productos en el carrito</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>El carrito está vacío</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                {cart.map((item) => {
                                    const basePrice = item.customPrice ?? Number(item.product.precio_venta)
                                    const discountAmount = (basePrice * item.quantity * (item.discount ?? 0)) / 100
                                    const itemTotal = basePrice * item.quantity - discountAmount

                                    return (
                                        <div key={item.product.id} className="border rounded-lg p-4 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm leading-tight">{item.product.descripcion}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {item.product.marca} • {item.product.codigo_oem}
                                                    </p>
                                                    {item.notes && (
                                                        <p className="text-xs text-blue-600 mt-1 italic">
                                                            Nota: {item.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(item.product.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            {/* Cantidad */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </Button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                </div>

                                                <div className="text-right">
                                                    <div className="font-bold text-green-600">${itemTotal.toFixed(2)}</div>
                                                    <div className="text-xs text-gray-500">${basePrice.toFixed(2)} c/u</div>
                                                    {discountAmount > 0 && (
                                                        <div className="text-xs text-red-500">-${discountAmount.toFixed(2)} desc.</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Precio y descuento */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-gray-500">Precio Unitario</Label>
                                                    {editingPrice === item.product.id ? (
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            defaultValue={basePrice}
                                                            className="h-8 text-sm"
                                                            onBlur={(e) => {
                                                                updatePrice(item.product.id, parseFloat(e.target.value) || basePrice)
                                                                setEditingPrice(null)
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    updatePrice(item.product.id, parseFloat((e.target as HTMLInputElement).value) || basePrice)
                                                                    setEditingPrice(null)
                                                                }
                                                            }}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-full justify-start text-sm bg-transparent"
                                                            onClick={() => setEditingPrice(item.product.id)}
                                                        >
                                                            <Edit3 className="w-3 h-3 mr-1" />${basePrice.toFixed(2)}
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    <Label className="text-xs text-gray-500">Descuento (%)</Label>
                                                    {editingDiscount === item.product.id ? (
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="100"
                                                            defaultValue={item.discount || 0}
                                                            className="h-8 text-sm"
                                                            onBlur={(e) => {
                                                                updateDiscount(item.product.id, parseFloat(e.target.value) || 0)
                                                                setEditingDiscount(null)
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    updateDiscount(item.product.id, parseFloat((e.target as HTMLInputElement).value) || 0)
                                                                    setEditingDiscount(null)
                                                                }
                                                            }}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-full justify-start text-sm bg-transparent"
                                                            onClick={() => setEditingDiscount(item.product.id)}
                                                        >
                                                            <Edit3 className="w-3 h-3 mr-1" />
                                                            {item.discount ?? 0}%
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Notas */}
                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-500">Notas</Label>
                                                <Textarea
                                                    placeholder="Agregar notas del producto..."
                                                    value={item.notes || ""}
                                                    onChange={(e) => updateNotes(item.product.id, e.target.value)}
                                                    className="h-16 text-sm resize-none"
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Subtotal:</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Descuentos:</span>
                                            <span className="font-medium text-red-600">-${totalDiscount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                                        <span>Total:</span>
                                        <span className="text-green-600">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Button className="w-full" size="lg" onClick={() => {/* checkout */ }}>
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Proceder a la Venta
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent">
                                        <Receipt className="w-4 h-4 mr-2" />
                                        Guardar Cotización
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default CartSidebar
