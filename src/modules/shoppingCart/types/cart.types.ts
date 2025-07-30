import type { ProductGet } from "@/modules/products/types/ProductGet";

export type CartItem = {
    product: ProductGet;
    quantity: number;
    customPrice: number;
    customSubtotal: number;
};
type DiscountMode = 'amount' | 'percent' | null

export type CartState = {
    items: CartItem[];
    discountAmount: number
    discountPercent: number
    discountMode: DiscountMode

    addItem: (item: ProductGet) => void
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

    getCartCount: () => number;
    getDiscountAmount: () => number;
    isItemInCart: (productId: number) => boolean;
    getItemQuantity: (productId: number) => number;
    recalculateDiscount: () => void;
};

export interface CartSummary {
    itemCount: number;
    subtotal: number;
    discount: number;
    total: number;
    itemsLength: number;
}

export interface StoreItem {
    items: CartItem[];
    discountAmount?: number
    discountPercent?: number
}