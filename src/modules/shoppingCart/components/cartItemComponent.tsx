import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { Trash2 } from "lucide-react";
import type { CartItem } from "../types/cart.types";
import { EditableQuantity } from "./editableQuantity";
import { EditablePrice } from "./editablePrice";

interface CartItemProps {
    item: CartItem
    updateQuantity: (productId: number, quantity: number) => void
    updateCustomPrice: (productId: number, price: number) => void
    updateCustomSubtotal: (productId: number, subtotal: number) => void
    removeItem: (productId: number) => void
}
const CartItemComponent: React.FC<CartItemProps> = ({
    item,
    removeItem,
    updateQuantity,
    updateCustomPrice,
    updateCustomSubtotal,
}) => {

    const basePrice = item.customPrice
    const itemSubtotal = item.customSubtotal

    return (
        <div key={item.product.id} className="border border-gray-200 rounded-lg p-2 space-y-1">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h4 className="font-medium text-sm leading-tight">{item.product.descripcion}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                        {item.product.marca} • {item.product.codigo_oem}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.product.id)}
                    className="text-destructive hover:bg-gray-100 size-8 cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div>
                    <Label className="text-xs text-gray-600 mb-1">Cantidad</Label>
                    <EditableQuantity
                        value={item.quantity}
                        className="w-full"
                        buttonClassName="w-full"
                        // updateQuantity(product.product.id, parseInt(e.target.value) || product.quantity)
                        onSubmit={(value) => updateQuantity(item.product.id, value as number)}
                        validate={(val) => {
                            const num = parseInt(val);
                            return !isNaN(num) && num > 0;
                        }}
                    />
                </div>

                <div>
                    <Label className="text-xs text-gray-600 mb-1">Precio Unit.</Label>
                    <EditablePrice
                        value={basePrice}
                        onSubmit={(value) => updateCustomPrice(item.product.id, value as number)}
                        className="w-full"
                        buttonClassName="w-full"
                        numberProps={{ min: 0, step: 0.01 }}
                    />
                </div>

                <div>
                    <Label className="text-xs text-gray-600 mb-1">Subtotal</Label>
                    <EditablePrice
                        value={itemSubtotal}
                        onSubmit={(value) => updateCustomSubtotal(item.product.id, value as number)}
                        className="w-full"
                        buttonClassName="hover:bg-green-50 text-green-600 hover:text-green-600 w-full"
                        numberProps={{ min: 0, step: 0.01 }}
                    />
                </div>
            </div>
        </div>
    );
}

export default CartItemComponent;