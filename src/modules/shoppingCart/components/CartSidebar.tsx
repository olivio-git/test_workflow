import { useEffect, useState } from "react"
import { Button } from "@/components/atoms/button"
import { Separator } from "@/components/atoms/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/atoms/sheet"
import { cn } from "@/lib/utils"
import { BrushCleaning, CreditCard, Maximize2, Receipt, ShoppingCart } from "lucide-react"
import CartItemComponent from "./cartItemComponent"
import { Label } from "@/components/atoms/label"
import { useNavigate } from "react-router"
import { useCartWithUtils } from "../hooks/useCartWithUtils"
import authSDK from "@/services/sdk-simple-auth"
import { useHotkeys, useHotkeysContext } from "react-hotkeys-hook";
import { useBranchStore } from "@/states/branchStore"
import { EditablePercentage } from "./EditablePercentage"
import { EditablePrice } from "./editablePrice"

const CartSidebar = ({
    open,
    onOpenChange
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) => {
    const user = authSDK.getCurrentUser()
    const { enableScope, disableScope } = useHotkeysContext();
    const { selectedBranchId } = useBranchStore()

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
        clearCart,
    } = useCartWithUtils(user?.name || '', selectedBranchId ?? '')

    useHotkeys('escape',
        (event) => {
            event.preventDefault();
            event.stopPropagation();
            onOpenChange(false);
        },
        {
            scopes: ['cart-sidebar'],
            enabled: open,
            preventDefault: true,
            keydown: true,
            keyup: false
        }
    );

    useEffect(() => {
        if (open) {
            enableScope('cart-sidebar');
            disableScope("esc-key");
        } else {
            disableScope('cart-sidebar');
            setTimeout(() => {
                enableScope("esc-key");
            }, 100);
        }
    }, [open, enableScope, disableScope]);

    const subtotal = getCartSubtotal();
    const total = getCartTotal();

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
                                <div className="flex items-center gap-2">
                                    <Button
                                        className="cursor-pointer"
                                        size={'sm'}
                                        onClick={clearCart}
                                        variant={'destructive'}
                                    >
                                        <BrushCleaning />
                                        Limpiar Carrito
                                    </Button>
                                    <Button className="size-8 mr-4 cursor-pointer" variant="outline" size="sm" onClick={() => setExpandedView(!expandedView)}>
                                        <Maximize2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            )
                        }
                    </SheetTitle>
                    <SheetDescription className="-mt-2" >
                        {cart.length} productos en el carrito
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-2 max-h-[87vh] h-full">
                    {cart.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>El carrito está vacío</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 justify-between h-full">
                            <div className="space-y-2 grow overflow-y-auto">
                                {cart.map((item) => (
                                    <CartItemComponent
                                        key={`item-${item.product.id}`}
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
                                                    <EditablePercentage
                                                        key={discountPercent}
                                                        value={discountPercent}
                                                        onSubmit={(value) => setDiscountPercent(value as number)}
                                                        className="w-full"
                                                        buttonClassName="w-full"
                                                        showEditIcon={false}
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label className="text-xs text-gray-500">Desc. Monto ($)</Label>
                                                    <EditablePrice
                                                        key={discountAmount}
                                                        value={discountAmount}
                                                        onSubmit={(value) => setDiscountAmount(value as number)}
                                                        className="w-full"
                                                        buttonClassName="w-full"
                                                        showEditIcon={false}
                                                    />
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
                                        <Button
                                            className="w-full cursor-pointer" size={"sm"} onClick={() => {
                                                navigate('/dashboard/create-sale')
                                                onOpenChange(false)
                                            }}>
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Proceder a la Venta
                                        </Button>
                                        <Button
                                            size={'sm'}
                                            variant="outline" className="w-full cursor-pointer">
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
