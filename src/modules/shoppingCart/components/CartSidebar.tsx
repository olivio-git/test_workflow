import { useState } from "react"
import { Button } from "@/components/atoms/button"
import { Separator } from "@/components/atoms/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/atoms/sheet"
import { cn } from "@/lib/utils"
import { CreditCard, Maximize2, Receipt, ShoppingCart } from "lucide-react"
import { useCartStore } from "../store/cartStore"
import CartItemComponent from "./cartItemComponent"
import { Label } from "@/components/atoms/label"
import { Input } from "@/components/atoms/input"
import { useNavigate } from "react-router"

const CartSidebar = ({
    open,
    onOpenChange
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) => {
    const [expandedView, setExpandedView] = useState(false)
    const navigate = useNavigate()

    const {
        items: cart,
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
    } = useCartStore();

    const subtotal = getCartSubtotal();
    const total = getCartTotal();
    const [editingGlobalAmount, setEditingGlobalAmount] = useState(false);
    const [editingGlobalPercent, setEditingGlobalPercent] = useState(false);

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
    return (
        <Sheet open={open} onOpenChange={onOpenChange} >
            <SheetContent className={cn("w-[400px] sm:w-[600px] sm:max-w-7xl", expandedView && "sm:w-[800px] lg:w-[1000px]")}>
                <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Carrito de ventas
                        </div>
                        {
                            cart.length > 0 && (
                                <Button className="size-8 mr-4 cursor-pointer" variant="outline" size="sm" onClick={() => setExpandedView(!expandedView)}>
                                    <Maximize2 className="w-4 h-4" />
                                </Button>
                            )
                        }
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-2 max-h-[90vh] h-full">
                    {cart.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>El carrito está vacío</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 justify-between h-full">
                            <div className="space-y-4 grow overflow-y-auto">
                                {cart.map((item) => (
                                    <CartItemComponent
                                        key={item.product.id}
                                        item={item}
                                        removeItem={removeItem}
                                        updateQuantity={updateQuantity}
                                        updateCustomPrice={updateCustomPrice}
                                        updateCustomSubtotal={updateCustomSubtotal}
                                    />
                                ))}
                            </div>

                            <div className="h-max">
                                <Separator />

                                <div className="pt-2 space-y-2">
                                    <div className="space-y-2">

                                        <div className="space-y-3">
                                            <Label className="text-sm font-medium text-text-primary">Descuentos Globales</Label>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-gray-500">Desc. Porcentaje (%)</Label>
                                                    {editingGlobalPercent ? (
                                                        <Input
                                                            value={discountPercent?.toString()}
                                                            onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                                                            onBlur={(e) => handleGlobalPercentSubmit(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleGlobalPercentSubmit(e.currentTarget.value)}
                                                            className="h-8 text-sm"
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.1"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <Button
                                                            onClick={() => setEditingGlobalPercent(true)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-full justify-start text-sm bg-transparent cursor-pointer"
                                                        >
                                                            {discountPercent ?? 0}%
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    <Label className="text-xs text-gray-500">Desc. Monto ($)</Label>
                                                    {editingGlobalAmount ? (
                                                        <Input
                                                            value={discountAmount?.toString()}
                                                            onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                                                            onBlur={(e) => handleGlobalAmountSubmit(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleGlobalAmountSubmit(e.currentTarget.value)}
                                                            className="h-8 text-sm"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <Button
                                                            onClick={() => setEditingGlobalAmount(true)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-full justify-start text-sm bg-transparent cursor-pointer"
                                                        >
                                                            ${discountAmount?.toFixed(2) ?? 0.00}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 font-medium">Subtotal:</span>
                                            <span className="">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-medium text-lg">
                                            <span>Total:</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Separator />

                                    <div className="grid sm:grid-cols-2 gap-2">
                                        <Button className="w-full cursor-pointer" size="lg" onClick={() => {
                                            navigate('/dashboard/create-sale')
                                            onOpenChange(false)
                                        }}>
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Proceder a la Venta
                                        </Button>
                                        <Button variant="outline" className="w-full bg-transparent cursor-pointer">
                                            <Receipt className="w-4 h-4 mr-2" />
                                            Guardar Cotización
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default CartSidebar
