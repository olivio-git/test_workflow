import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Edit3, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { CartItem } from "../types/cart.types";

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
    const [editingPrice, setEditingPrice] = useState<number | null>(null);
    const [editingSubtotal, setEditingSubtotal] = useState<number | null>(null);
    const [editingQuantity, setEditingQuantity] = useState<number | null>(null);

    const basePrice = item.customPrice ?? parseFloat(item.product.precio_venta);
    const itemSubtotal = item.customSubtotal ?? basePrice * item.quantity;

    return (
        <div key={item.product.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
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

            {/* Cantidad */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="size-8 cursor-pointer"
                    >
                        <Minus className="w-3 h-3" />
                    </Button>
                    {editingQuantity === item.product.id ? (
                        <Input
                            type="number"
                            step="1"
                            defaultValue={item.quantity}
                            className="h-8 text-sm"
                            onBlur={(e) => {
                                updateQuantity(item.product.id, parseInt(e.target.value) || item.quantity)
                                setEditingQuantity(null)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    updateQuantity(item.product.id, parseInt((e.target as HTMLInputElement).value) || item.quantity)
                                    setEditingQuantity(null)
                                }
                            }}
                            autoFocus
                        />
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-full justify-start text-sm bg-transparent hover:bg-gray-100 cursor-pointer"
                            onClick={() => setEditingQuantity(item.product.id)}
                        >
                            {item.quantity}
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="size-8 cursor-pointer"
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>

                <div className="text-right">
                    <div className="font-bold text-green-600">${itemSubtotal.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">${basePrice.toFixed(2)} c/u</div>
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
                                updateCustomPrice(item.product.id, parseFloat(e.target.value) || basePrice)
                                setEditingPrice(null)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    updateCustomPrice(item.product.id, parseFloat((e.target as HTMLInputElement).value) || basePrice)
                                    setEditingPrice(null)
                                }
                            }}
                            autoFocus
                        />
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-full justify-start text-sm bg-transparent cursor-pointer"
                            onClick={() => setEditingPrice(item.product.id)}
                        >
                            <Edit3 className="w-3 h-3 mr-1" />${basePrice.toFixed(2)}
                        </Button>
                    )}
                </div>

                <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Subtotal</Label>
                    {editingSubtotal === item.product.id ? (
                        <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            defaultValue={itemSubtotal}
                            className="h-8 text-sm"
                            onBlur={(e) => {
                                updateCustomSubtotal(item.product.id, parseFloat(e.target.value) || itemSubtotal)
                                setEditingSubtotal(null)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    updateCustomSubtotal(item.product.id, parseFloat((e.target as HTMLInputElement).value) || itemSubtotal)
                                    setEditingSubtotal(null)
                                }
                            }}
                            autoFocus
                        />
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-full justify-start text-sm bg-transparent cursor-pointer"
                            onClick={() => setEditingSubtotal(item.product.id)}
                        >
                            <Edit3 className="w-3 h-3 mr-1" />
                            ${itemSubtotal.toFixed(2)}
                        </Button>
                    )}
                </div>
            </div>

        </div>
    );
}

export default CartItemComponent;