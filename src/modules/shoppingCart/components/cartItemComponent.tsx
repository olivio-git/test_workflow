import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { Trash2 } from "lucide-react";
import type { CartItem } from "../types/cart.types";
import { EditableQuantity } from "./editableQuantity";
import { EditablePrice } from "./editablePrice";
import { Badge } from "@/components/atoms/badge";

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
        <div key={item.product.id} className="border-gray-200 rounded-lg p-3 border">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <Badge variant="secondary" className="text-xs">
                            {item.product.codigo_oem}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.product.marca}</span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{item.product.descripcion}</h4>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <Label className="text-xs text-gray-600 mb-1">Cantidad</Label>
                            <EditableQuantity
                                value={item.quantity}
                                className="w-full"
                                buttonClassName="w-full"
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
                                inputClassName="hover:bg-green-50 text-green-600 hover:text-green-600 border-green-200"
                                numberProps={{ min: 0, step: 0.01 }}
                            />
                        </div>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-500 hover:text-red-500 size-7"
                >
                    <Trash2 className="size-3" />
                </Button>
            </div>
        </div>
    )
}

export default CartItemComponent;