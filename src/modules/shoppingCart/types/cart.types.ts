import type { ProductGet } from "@/modules/products/types/ProductGet";

export type CartItem = {
    product: ProductGet;
    quantity: number;
    customPrice?: number;
    customSubtotal?: number;
};

export type CartState = {
    items: CartItem[];
    discountAmount?: number
    discountPercent?: number

    addItem: (item: CartItem) => void
    removeItem: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    updateCustomPrice: (productId: number, price: number) => void
    updateCustomSubtotal: (productId: number, subtotal: number) => void
    clearCart: () => void

    setDiscountAmount: (amount: number) => void
    setDiscountPercent: (percent: number) => void

    getItemSubtotal: (productId: number) => number
    getCartSubtotal: () => number
    getCartTotal: () => number
};